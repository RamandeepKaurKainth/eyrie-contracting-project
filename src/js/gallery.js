document.addEventListener("DOMContentLoaded", async () => {
  const projectId = "eko1zm8z";
  const dataset = "production";

  const imageObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        obs.unobserve(img);
      }
    });
  });


  function urlFor(ref) {
    const [id, dimensions, format] = ref.replace("image-", "").split("-");
    return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`;
  }

  const sanityData = await fetch(
    `https://${projectId}.api.sanity.io/v2026-04-02/data/query/${dataset}?query=*[_type=="projects"][0]`
  )
    .then((res) => res.json())
    .then((res) => res.result);

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

  function buildImageMedia(items = []) {
    return items.map((item) => ({
      type: "image",
      src: urlFor(item.asset._ref)
    }));
  }

  class GalleryItem {
    constructor(title, description, media = []) {
      this.title = title;
      this.description = description;
      this.media = prioritizeMedia(media);
    }

    render(projectIndex, onCreateVideo) {
      const wrapper = document.createElement("article");
      wrapper.className =
        "gallery-card bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-4 gap-8 items-center p-6";
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
          img.dataset.src = mediaItem.src;   // store real src
          img.src = "";                       // don't load immediately
          img.alt = this.title;
          img.className = "gallery-img";
          img.loading = "lazy";
          img.decoding = "async";
          imageObserver.observe(img);        // 👈 IMPORTANT
          slide.appendChild(img);
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

      const heading = document.createElement("h2");
      heading.className = "project-title";
      // heading.setAttribute("data-aos", "fade-up");
      // heading.setAttribute("data-aos-duration", "900");
      // heading.setAttribute("data-aos-delay", "100");
      heading.textContent = this.title;

      const text = document.createElement("p");
      text.className = "project-description";
      text.textContent = this.description;

      content.appendChild(heading);
      content.appendChild(text);

      viewport.appendChild(track);

      if (this.media.length > 1) {
        controls.appendChild(dim);
        controls.appendChild(leftArrow);
        controls.appendChild(rightArrow);
        controls.appendChild(dots);
        viewport.appendChild(controls);
      }

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
      "Design Concepts",
      "Our Design Concepts represent the strategic foundation of successful construction projects, integrating architectural vision, constructability, and cost planning from the outset. This section highlights conceptual designs, feasibility studies, and pre-construction planning for commercial, industrial, and institutional developments. We collaborate closely with clients, consultants, and stakeholders to develop buildable, code-compliant, and budget-aligned solutions, ensuring each concept is optimized for municipal approvals and long-term performance.",
      buildImageMedia(sanityData?.project1_media || [])
    ),
    new GalleryItem(
      "Commercial Tenant Improvements",
      "Our Commercial Tenant Improvement projects demonstrate our expertise in delivering high-quality interior construction and fit-outs across office, retail, hospitality, and institutional environments. We specialize in transforming spaces to meet evolving operational needs while maintaining strict adherence to schedule, budget, and regulatory compliance. With experience working within occupied buildings, we prioritize phased construction, minimal disruption, and coordinated delivery.",
      buildImageMedia(sanityData?.project2_media || [])
    ),
    new GalleryItem(
      "Industrial Expansions",
      "Our Industrial Expansions showcase complex projects focused on facility growth, operational efficiency, and infrastructure upgrades within active industrial environments. This includes structural expansions, equipment integration, and system modernization tailored to manufacturing, logistics, and processing facilities. We deliver these projects with a strong emphasis on safety, sequencing, and operational continuity, supporting clients with scalable long-term expansion strategies.",
      buildImageMedia(sanityData?.project3_media || [])
    )
  ];

  const listElement = document.getElementById("gallery-list");
  const lightbox = document.getElementById("lightbox");
  const lightboxMedia = document.getElementById("lightboxMedia");
  const closeBtn = document.getElementById("closeBtn");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");

  const rotationTimers = new WeakMap();
  let currentProjectIndex = 0;
  let currentMediaIndex = 0;

  const view = new GalleryView(data, listElement);
  view.render(() => { });
  //preloadGalleryImages(data);

  const tracks = document.querySelectorAll(".gallery-track");
  tracks.forEach((track) => {
    const current = parseInt(track.dataset.activeIndex || "0", 10);
    updateViewportMode(track, current);
    if (track.dataset.autoRotate === "true" && isImageIndex(track, current)) {
      scheduleRotation(track, 3500);
    }
  });

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
    if (poster) {
      video.poster = poster;
    }
    return video;
  }

  function updateDots(trackElement, activeIndex) {
    const dots = trackElement.parentElement?.querySelectorAll(".gallery-dot") || [];
    dots.forEach((dot) => {
      const dotIndex = parseInt(dot.dataset.dotIndex || "0", 10);
      dot.classList.toggle("is-active", dotIndex === activeIndex);
    });
  }

  function rotateTo(trackElement, activeIndex) {
    const slideCount = trackElement.children.length;
    if (slideCount === 0) return;

    const safeIndex = ((activeIndex % slideCount) + slideCount) % slideCount;
    trackElement.dataset.activeIndex = safeIndex.toString();
    trackElement.style.transform = `translateX(-${safeIndex * 100}%)`;
    updateViewportMode(trackElement, safeIndex);
    updateDots(trackElement, safeIndex);
  }

  function updateViewportMode(trackElement, activeIndex) {
    const viewport = trackElement.parentElement;
    if (!viewport) return;
    const slide = trackElement.children[activeIndex];
    const mediaType = slide?.dataset?.mediaType;
    viewport.classList.toggle("is-360-active", mediaType === "video360");
  }

  function getImageIndexes(trackElement) {
    const raw = trackElement.dataset.imageIndexes || "";
    if (!raw) return [];
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
    if (imageIndexes.length === 0) return null;

    const sorted = [...imageIndexes].sort((a, b) => a - b);
    for (const imageIndex of sorted) {
      if (imageIndex > currentIndex) return imageIndex;
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
    if (trackElement.dataset.autoRotate !== "true") return;

    const current = parseInt(trackElement.dataset.activeIndex || "0", 10);
    if (!isImageIndex(trackElement, current)) {
      clearRotation(trackElement);
      return;
    }

    const imageIndexes = getImageIndexes(trackElement);
    if (imageIndexes.length <= 1) return;

    clearRotation(trackElement);

    const timerId = setTimeout(() => {
      const currentIndex = parseInt(trackElement.dataset.activeIndex || "0", 10);
      const nextImage = getNextImageIndex(trackElement, currentIndex);
      if (nextImage === null) return;
      rotateTo(trackElement, nextImage);
      scheduleRotation(trackElement, 3500);
    }, delay);

    rotationTimers.set(trackElement, timerId);
  }

  function getProjectMediaList(projectIndex) {
    return data[projectIndex]?.media || [];
  }

  function clearLightboxMedia() {
    lightboxMedia.innerHTML = "";
  }

  function showLightboxMedia() {
    clearLightboxMedia();

    const mediaList = getProjectMediaList(currentProjectIndex);
    if (!mediaList.length) return;

    const safeIndex = ((currentMediaIndex % mediaList.length) + mediaList.length) % mediaList.length;
    const mediaItem = mediaList[safeIndex];

    if (mediaItem.type === "image") {
      const img = document.createElement("img");
      img.dataset.src = mediaItem.src;
      img.src = "";
      img.alt = data[currentProjectIndex]?.title || "Gallery media";
      img.className = "w-full h-full max-h-[80vh] object-contain rounded-xl bg-black";
      lightboxMedia.appendChild(img);
      return;
    }
  }

  function closeLightbox() {
    lightbox.classList.add("hidden");
    lightbox.classList.remove("show");
    clearLightboxMedia();
    document.body.style.overflow = "";
  }

  listElement.addEventListener("click", (event) => {
    const card = event.target.closest(".gallery-card");
    if (!card) return;

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

    const projectIndex = parseInt(card.dataset.projectIndex || "0", 10);
    const activeIndex = parseInt(track?.dataset.activeIndex || "0", 10);

    currentProjectIndex = projectIndex;
    currentMediaIndex = activeIndex;

    showLightboxMedia();
    lightbox.classList.remove("hidden");
    lightbox.classList.add("show");
    document.body.style.overflow = "hidden";
  });

  closeBtn.addEventListener("click", closeLightbox);

  nextBtn.addEventListener("click", () => {
    const list = getProjectMediaList(currentProjectIndex);
    if (!list.length) return;
    currentMediaIndex = (currentMediaIndex + 1) % list.length;
    showLightboxMedia();
  });

  prevBtn.addEventListener("click", () => {
    const list = getProjectMediaList(currentProjectIndex);
    if (!list.length) return;
    currentMediaIndex = (currentMediaIndex - 1 + list.length) % list.length;
    showLightboxMedia();
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (lightbox.classList.contains("hidden")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowRight") nextBtn.click();
    if (event.key === "ArrowLeft") prevBtn.click();
  });
});