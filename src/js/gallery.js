document.addEventListener("DOMContentLoaded", () => {
  const MEDIA_PRIORITY = {
    video360: 0,
    video: 1,
    image: 2
  };

  function prioritizeMedia(media = []) {
    return [...media].sort((a, b) => {
      const aRank = MEDIA_PRIORITY[a.type] ?? 99;
      const bRank = MEDIA_PRIORITY[b.type] ?? 99;
      return aRank - bRank;
    });
  }

  class GalleryItem {
    constructor(title, description, media = []) {
      this.title = title;
      this.description = description;
      this.media = prioritizeMedia(media);
    }

    render(projectIndex, onCreateVideo) {
      const wrapper = document.createElement("article");
      wrapper.className = "gallery-card bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-4 gap-8 items-center p-6";
      wrapper.dataset.projectIndex = projectIndex.toString();

      const media = document.createElement("div");
      media.className = "md:col-span-3";

      const viewport = document.createElement("div");
      viewport.className = "gallery-viewport shadow-lg";

      const track = document.createElement("div");
      track.className = "gallery-track";
      track.dataset.activeIndex = "0";
      const imageIndexes = this.media
        .map((mediaItem, idx) => ({ type: mediaItem.type, idx }))
        .filter((item) => item.type === "image")
        .map((item) => item.idx);
      track.dataset.imageIndexes = imageIndexes.join(",");
      track.dataset.autoRotate = imageIndexes.length > 1 ? "true" : "false";

      this.media.forEach((mediaItem, mediaIndex) => {
        const slide = document.createElement("div");
        slide.className = "gallery-slide";
        slide.dataset.mediaType = mediaItem.type;
        slide.dataset.mediaSrc = mediaItem.src;

        if (mediaItem.type === "image") {
          const img = document.createElement("img");
          img.src = mediaItem.src;
          img.alt = this.title;
          img.className = "gallery-img";
          img.loading = "eager";
          img.decoding = "async";
          slide.appendChild(img);
        } else if (mediaItem.type === "video") {
          const video = createVideoElement(mediaItem.src, mediaItem.poster);
          onCreateVideo(video);
          slide.appendChild(video);
        } else if (mediaItem.type === "video360") {
          slide.appendChild(createVideo360Scene(mediaItem.src, projectIndex, mediaIndex));
        }

        track.appendChild(slide);
      });

      const controls = document.createElement("div");
      controls.className = "gallery-controls";

      const dim = document.createElement("div");
      dim.className = "gallery-dim";

      const leftArrow = document.createElement("button");
      leftArrow.className = "gallery-arrow gallery-arrow-left";
      leftArrow.type = "button";
      leftArrow.dataset.action = "prev";
      leftArrow.innerHTML = "&#10094;";

      const rightArrow = document.createElement("button");
      rightArrow.className = "gallery-arrow gallery-arrow-right";
      rightArrow.type = "button";
      rightArrow.dataset.action = "next";
      rightArrow.innerHTML = "&#10095;";

      const dots = document.createElement("div");
      dots.className = "gallery-dots";
      this.media.forEach((_, dotIndex) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "gallery-dot" + (dotIndex === 0 ? " is-active" : "");
        dot.dataset.dotIndex = dotIndex.toString();
        dots.appendChild(dot);
      });

      const content = document.createElement("div");
      content.className = "md:col-span-1";

      const heading = document.createElement("h3");
      heading.className = "text-2xl font-bold text-gray-800";
      heading.textContent = this.title;

      const text = document.createElement("p");
      text.className = "text-gray-600 mt-3 leading-relaxed";
      text.textContent = this.description;

      content.appendChild(heading);
      content.appendChild(text);
      viewport.appendChild(track);
      controls.appendChild(dim);
      controls.appendChild(leftArrow);
      controls.appendChild(rightArrow);
      controls.appendChild(dots);
      viewport.appendChild(controls);
      media.appendChild(viewport);

      if (projectIndex % 2 === 0) {
        wrapper.appendChild(media);
        wrapper.appendChild(content);
      } else {
        media.classList.add("md:order-2");
        content.classList.add("md:order-1");
        wrapper.appendChild(content);
        wrapper.appendChild(media);
      }

      return wrapper;
    }
  }

  class GalleryView {
    constructor(items, listElement) {
      this.items = items;
      this.listElement = listElement;
    }

    render(onCreateVideo) {
      this.listElement.innerHTML = "";
      this.items.forEach((item, index) => {
        this.listElement.appendChild(item.render(index, onCreateVideo));
      });
    }
  }

  const data = [
    new GalleryItem(
      "Project 1",
      "Example with just images.",
      [
        { type: "image", src: "gallery-projects/project1-a/gallery1.jpg" },
        { type: "image", src: "gallery-projects/project1-a/gallery2.jpg" },
        { type: "image", src: "gallery-projects/project1-a/gallery3.jpg" },
        { type: "image", src: "gallery-projects/project1-a/gallery4.jpg" }
      ]
    ),
    new GalleryItem(
      "Project 2",
      "Example with video, clickable to pause and play, it will always be first and not switch to other pictures unless user manually does so.",
      [
        { type: "image", src: "gallery-projects/project2-b/gallery8.jpg" },
        { type: "video", src: "gallery-projects/project2-b/placeholder_video1.mp4" },
        { type: "image", src: "gallery-projects/project2-b/gallery6.jpg" },
        { type: "image", src: "gallery-projects/project2-b/gallery7.jpg" }
      ]
    ),
    new GalleryItem(
      "Project 3",
      "Example with 360 video, can click and drag to look around, it will always be first and not switch to other pictures unless user manually does so.",
      [
        { type: "image", src: "gallery-projects/project3-c/main.jpg" },
        { type: "video360", src: "gallery-projects/project3-c/360 video example.mp4" },
        { type: "image", src: "gallery-projects/project3-c/gallery9.jpg" },
        { type: "image", src: "gallery-projects/project3-c/gallery10.jpg" }
      ]
    )
  ];

  const listElement = document.getElementById("gallery-list");
  const lightbox = document.getElementById("lightbox");
  const lightboxMedia = document.getElementById("lightboxMedia");
  const closeBtn = document.getElementById("closeBtn");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");

  const managedVideos = new Set();
  const rotationTimers = new WeakMap();
  let scrollBeforeFullscreen = null;

  let currentProjectIndex = 0;
  let currentMediaIndex = 0;

  const view = new GalleryView(data, listElement);
  view.render((video) => {
    registerManagedVideo(video);
  });

  preloadGalleryImages(data);

  const tracks = document.querySelectorAll(".gallery-track");
  tracks.forEach((track) => {
    const current = parseInt(track.dataset.activeIndex || "0", 10);
    updateViewportMode(track, current);
    if (track.dataset.autoRotate === "true" && isImageIndex(track, current)) {
      scheduleRotation(track, 3500);
    }
  });

  createVideoVisibilityObserver();
  setupFullscreenScrollLock();

  function preloadGalleryImages(items) {
    const imageSources = new Set();

    items.forEach((item) => {
      item.media.forEach((mediaItem) => {
        if (mediaItem.type === "image" && mediaItem.src) {
          imageSources.add(mediaItem.src);
        }
      });
    });

    imageSources.forEach((src) => {
      const image = new Image();
      image.decoding = "async";
      image.src = src;

      if (typeof image.decode === "function") {
        image.decode().catch(() => { });
      }
    });
  }

  function createVideoElement(src, poster) {
    const video = document.createElement("video");
    video.className = "gallery-video";
    video.src = src;
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.controls = true;
    video.preload = "metadata";
    video.dataset.galleryVideo = "true";
    video.dataset.galleryVideoKind = "standard";
    video.tabIndex = 0;
    if (poster) {
      video.poster = poster;
    }
    return video;
  }

  function createVideo360Scene(src, projectIndex, mediaIndex) {
    const wrapper = document.createElement("div");
    wrapper.className = "gallery-360";

    const scene = document.createElement("a-scene");
    scene.setAttribute("embedded", "");
    scene.setAttribute("vr-mode-ui", "enabled: false");
    scene.setAttribute("device-orientation-permission-ui", "enabled: false");
    scene.setAttribute("renderer", "antialias: true; colorManagement: true");

    const assets = document.createElement("a-assets");
    const video = document.createElement("video");
    const videoId = `video360-${projectIndex}-${mediaIndex}`;
    video.id = videoId;
    video.src = src;
    video.setAttribute("autoplay", "");
    video.setAttribute("muted", "");
    video.setAttribute("loop", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.setAttribute("crossorigin", "anonymous");
    video.dataset.galleryVideo = "true";
    video.dataset.galleryVideoKind = "360";
    video.tabIndex = 0;

    // A-Frame asset videos are hidden DOM nodes; set media properties directly
    // so autoplay is honored before the videosphere binds the texture.
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    registerManagedVideo(video);

    const camera = document.createElement("a-camera");
    camera.setAttribute("look-controls", "pointerLockEnabled: false; touchEnabled: true; magicWindowTrackingEnabled: true");

    const sphere = document.createElement("a-videosphere");
    sphere.setAttribute("src", `#${videoId}`);

    assets.appendChild(video);
    scene.appendChild(assets);
    scene.appendChild(camera);
    scene.appendChild(sphere);
    wrapper.appendChild(scene);

    return wrapper;
  }

  function registerManagedVideo(video) {
    managedVideos.add(video);

    const muteOthersAndUnmuteCurrent = () => {
      managedVideos.forEach((managedVideo) => {
        if (managedVideo !== video) {
          managedVideo.muted = true;
        }
      });
      video.muted = false;
      video.play().catch(() => { });
    };

    video.addEventListener("focus", muteOthersAndUnmuteCurrent);
    video.addEventListener("click", muteOthersAndUnmuteCurrent);
    video.addEventListener("pointerdown", muteOthersAndUnmuteCurrent);
    video.addEventListener("blur", () => {
      video.muted = true;
    });
  }

  function createVideoVisibilityObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (!(video instanceof HTMLVideoElement)) {
            return;
          }

          if (entry.isIntersecting) {
            video.play().catch(() => { });
          } else {
            video.pause();
            video.muted = true;
          }
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll("video[data-gallery-video='true'][data-gallery-video-kind='standard']").forEach((video) => {
      observer.observe(video);
    });
  }

  function updateDots(trackElement, activeIndex) {
    const dots = trackElement.parentElement?.querySelectorAll(".gallery-dot") || [];
    dots.forEach((dot) => {
      const dotIndex = parseInt(dot.dataset.dotIndex || "0", 10);
      if (dotIndex === activeIndex) {
        dot.classList.add("is-active");
      } else {
        dot.classList.remove("is-active");
      }
    });
  }

  function rotateTo(trackElement, activeIndex) {
    const slideCount = trackElement.children.length;
    if (slideCount === 0) {
      return;
    }

    const safeIndex = ((activeIndex % slideCount) + slideCount) % slideCount;
    trackElement.dataset.activeIndex = safeIndex.toString();
    trackElement.style.transform = `translateX(-${safeIndex * 100}%)`;
    updateViewportMode(trackElement, safeIndex);
    updateDots(trackElement, safeIndex);
  }

  function updateViewportMode(trackElement, activeIndex) {
    const viewport = trackElement.parentElement;
    if (!viewport) {
      return;
    }

    const slide = trackElement.children[activeIndex];
    const mediaType = slide?.dataset?.mediaType;
    viewport.classList.toggle("is-360-active", mediaType === "video360");
  }

  function getActiveMediaType(trackElement) {
    const activeIndex = parseInt(trackElement.dataset.activeIndex || "0", 10);
    const activeSlide = trackElement.children[activeIndex];
    return activeSlide?.dataset?.mediaType || "image";
  }

  function setupFullscreenScrollLock() {
    document.addEventListener("fullscreenchange", () => {
      if (document.fullscreenElement) {
        scrollBeforeFullscreen = window.scrollY;
        return;
      }

      if (typeof scrollBeforeFullscreen === "number") {
        const y = scrollBeforeFullscreen;
        requestAnimationFrame(() => {
          window.scrollTo({ top: y, behavior: "auto" });
        });
      }
    });
  }

  function getImageIndexes(trackElement) {
    const raw = trackElement.dataset.imageIndexes || "";
    if (!raw) {
      return [];
    }
    return raw
      .split(",")
      .map((value) => parseInt(value, 10))
      .filter((value) => !Number.isNaN(value));
  }

  function isImageIndex(trackElement, index) {
    return getImageIndexes(trackElement).includes(index);
  }

  function getNextImageIndex(trackElement, currentIndex) {
    const imageIndexes = getImageIndexes(trackElement);
    if (imageIndexes.length === 0) {
      return null;
    }

    const sorted = [...imageIndexes].sort((a, b) => a - b);
    for (const imageIndex of sorted) {
      if (imageIndex > currentIndex) {
        return imageIndex;
      }
    }
    return sorted[0];
  }

  function clearRotation(trackElement) {
    if (rotationTimers.has(trackElement)) {
      clearTimeout(rotationTimers.get(trackElement));
      rotationTimers.delete(trackElement);
    }
  }

  function scheduleRotation(trackElement, delay) {
    if (trackElement.dataset.autoRotate !== "true") {
      return;
    }

    const current = parseInt(trackElement.dataset.activeIndex || "0", 10);
    if (!isImageIndex(trackElement, current)) {
      clearRotation(trackElement);
      return;
    }

    const imageIndexes = getImageIndexes(trackElement);
    if (imageIndexes.length <= 1) {
      return;
    }

    clearRotation(trackElement);

    const timerId = setTimeout(() => {
      const current = parseInt(trackElement.dataset.activeIndex || "0", 10);
      const nextImage = getNextImageIndex(trackElement, current);
      if (nextImage === null) {
        return;
      }
      rotateTo(trackElement, nextImage);
      scheduleRotation(trackElement, 3500);
    }, delay);

    rotationTimers.set(trackElement, timerId);
  }

  function getProjectMediaList(projectIndex) {
    return data[projectIndex]?.media || [];
  }

  function clearLightboxMedia() {
    lightboxMedia.querySelectorAll("video").forEach((video) => {
      video.pause();
      video.muted = true;
    });
    lightboxMedia.innerHTML = "";
  }

  function showLightboxMedia() {
    clearLightboxMedia();

    const mediaList = getProjectMediaList(currentProjectIndex);
    if (mediaList.length === 0) {
      return;
    }

    const safeIndex = ((currentMediaIndex % mediaList.length) + mediaList.length) % mediaList.length;
    const mediaItem = mediaList[safeIndex];

    if (mediaItem.type === "image") {
      const img = document.createElement("img");
      img.src = mediaItem.src;
      img.alt = data[currentProjectIndex]?.title || "Gallery media";
      img.className = "max-h-[80vh] max-w-[80vw] object-contain";
      lightboxMedia.appendChild(img);
      return;
    }

    if (mediaItem.type === "video") {
      const video = createVideoElement(mediaItem.src, mediaItem.poster);
      video.className = "max-h-[80vh] max-w-[80vw] object-contain bg-black";
      registerManagedVideo(video);
      lightboxMedia.appendChild(video);
      video.play().catch(() => { });
      return;
    }

    if (mediaItem.type === "video360") {
      lightboxMedia.appendChild(createVideo360Scene(mediaItem.src, currentProjectIndex, safeIndex));
    }
  }

  function closeLightbox() {
    lightbox.classList.add("hidden");
    lightbox.classList.remove("show");
    clearLightboxMedia();
  }

  listElement.addEventListener("click", (event) => {
    const card = event.target.closest(".gallery-card");
    if (!card) {
      return;
    }

    const track = card.querySelector(".gallery-track");
    const action = event.target.dataset.action;
    const dotIndex = event.target.dataset.dotIndex;

    if (action && track) {
      const current = parseInt(track.dataset.activeIndex || "0", 10);
      const nextIndex = action === "next" ? current + 1 : current - 1;
      rotateTo(track, nextIndex);

      const safeIndex = parseInt(track.dataset.activeIndex || "0", 10);
      if (track.dataset.autoRotate === "true" && isImageIndex(track, safeIndex)) {
        scheduleRotation(track, 5000);
      } else {
        clearRotation(track);
      }
      return;
    }

    if (dotIndex && track) {
      rotateTo(track, parseInt(dotIndex, 10));

      const safeIndex = parseInt(track.dataset.activeIndex || "0", 10);
      if (track.dataset.autoRotate === "true" && isImageIndex(track, safeIndex)) {
        scheduleRotation(track, 5000);
      } else {
        clearRotation(track);
      }
      return;
    }

    if (track && getActiveMediaType(track) !== "image") {
      return;
    }

    // Let users interact with videos directly (unmute/controls) without opening the lightbox.
    if (event.target.closest("video") || event.target.closest(".gallery-360")) {
      return;
    }

    const projectIndex = parseInt(card.dataset.projectIndex || "0", 10);
    const activeIndex = parseInt(track?.dataset.activeIndex || "0", 10);

    currentProjectIndex = projectIndex;
    currentMediaIndex = activeIndex;

    showLightboxMedia();
    lightbox.classList.remove("hidden");
    lightbox.classList.add("show");
  });

  closeBtn.addEventListener("click", closeLightbox);

  nextBtn.addEventListener("click", () => {
    const list = getProjectMediaList(currentProjectIndex);
    if (list.length === 0) {
      return;
    }
    currentMediaIndex = (currentMediaIndex + 1) % list.length;
    showLightboxMedia();
  });

  prevBtn.addEventListener("click", () => {
    const list = getProjectMediaList(currentProjectIndex);
    if (list.length === 0) {
      return;
    }
    currentMediaIndex = (currentMediaIndex - 1 + list.length) % list.length;
    showLightboxMedia();
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLightbox();
    }
  });
});
