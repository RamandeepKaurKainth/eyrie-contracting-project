document.addEventListener("DOMContentLoaded", () => {
    class GalleryItem {
        constructor(imageSrc, title, description, images = []) {
            this.imageSrc = imageSrc;
            this.title = title;
            this.description = description;
            this.images = images;
        }

        render(index) {
            const wrapper = document.createElement("article");
            wrapper.className = "gallery-card bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-4 gap-8 items-center p-6";
            wrapper.dataset.projectIndex = index.toString();

            const media = document.createElement("div");
            media.className = "md:col-span-3";

            const viewport = document.createElement("div");
            viewport.className = "gallery-viewport shadow-lg cursor-pointer";

            const track = document.createElement("div");
            track.className = "gallery-track";
            track.dataset.images = this.images.length > 0 ? this.images.join(",") : this.imageSrc;
            track.dataset.activeIndex = "0";

            const imageList = this.images.length > 0 ? this.images : [this.imageSrc];
            imageList.forEach((src) => {
                const img = document.createElement("img");
                img.src = src;
                img.alt = this.title;
                img.className = "gallery-img";
                track.appendChild(img);
            });

            const controls = document.createElement("div");
            controls.className = "gallery-controls";
            
            // dim on hover to make arrows and dot nav more visible
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
            imageList.forEach((_, dotIndex) => {
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
            if (index % 2 === 0) {
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

        render() {
            this.listElement.innerHTML = "";
            this.items.forEach((item, index) => {
                this.listElement.appendChild(item.render(index));
            });
        }
    }

    const data = [
        new GalleryItem(
            "images/gallery-projects/project1-a/main.jpg",
            "Project 1",
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.",
            [
                "images/gallery-projects/project1-a/main.jpg",
                "images/gallery-projects/project1-a/gallery2.jpg",
                "images/gallery-projects/project1-a/gallery3.jpg",
                "images/gallery-projects/project1-a/gallery4.jpg"
            ]
        ),
        new GalleryItem(
            "images/gallery-projects/project2-b/main.jpg",
            "Project 2",
            "Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.",
            [
                "images/gallery-projects/project2-b/main.jpg",
                "images/gallery-projects/project2-b/gallery6.jpg",
                "images/gallery-projects/project2-b/gallery7.jpg"
            ]
        ),
        new GalleryItem(
            "images/gallery-projects/project3-c/main.jpg",
            "Project 3",
            "Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta.",
            [
                "images/gallery-projects/project3-c/main.jpg",
                "images/gallery-projects/project3-c/gallery9.jpg",
                "images/gallery-projects/project3-c/gallery10.jpg",
                "images/gallery-projects/project3-c/gallery11.jpg",
                "images/gallery-projects/project3-c/gallery12.jpg",
                "images/gallery-projects/project3-c/gallery13.jpg"
            ]
        )
    ];

    const listElement = document.getElementById("gallery-list");
    const view = new GalleryView(data, listElement);
    view.render();

    const tracks = document.querySelectorAll(".gallery-track");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const closeBtn = document.getElementById("closeBtn");
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");

    let currentProjectIndex = 0;
    let currentImageIndex = 0;

    const rotationTimers = new WeakMap();

    // update dot nav active state for a track
    function updateDots(trackElement, activeIndex) {
        const dots = trackElement.parentElement?.querySelectorAll(".gallery-dot") || [];
        dots.forEach((dot) => {
            const dotIndex = parseInt(dot.dataset.dotIndex || "0");
            if (dotIndex === activeIndex) {
                dot.classList.add("is-active");
            } else {
                dot.classList.remove("is-active");
            }
        });
    }

    // rotate to specific image index for a track
    function rotateTo(trackElement, activeIndex) {
        const list = trackElement.dataset.images ? trackElement.dataset.images.split(",") : [];
        if (list.length === 0) {
            return;
        }
        const safeIndex = ((activeIndex % list.length) + list.length) % list.length;
        trackElement.dataset.activeIndex = safeIndex.toString();
        trackElement.style.transform = `translateX(-${safeIndex * 100}%)`;
        updateDots(trackElement, safeIndex);
    }

    // schedule automatic rotation for a track with specified delay
    function scheduleRotation(trackElement, delay) {
        const list = trackElement.dataset.images ? trackElement.dataset.images.split(",") : [];
        if (list.length <= 1) {
            return;
        }

        // clear any existing timer for this track before scheduling a new one
        if (rotationTimers.has(trackElement)) {
            clearTimeout(rotationTimers.get(trackElement));
        }

        // set a new timer to rotate to the next image after the specified delay
        const timerId = setTimeout(() => {
            const current = parseInt(trackElement.dataset.activeIndex || "0");
            rotateTo(trackElement, current + 1);
            scheduleRotation(trackElement, 3000);
        }, delay);

        // store the timer ID in the WeakMap so it can be cleared later if needed
        rotationTimers.set(trackElement, timerId);
    }

    // start automatic rotation for all tracks with a 3 second delay
    tracks.forEach((track) => scheduleRotation(track, 3000));

    // Open lightbox when clicking a project image
    listElement.addEventListener("click", (event) => {
        const card = event.target.closest(".gallery-card");
        if (!card) {
            return;
        }

        const action = event.target.dataset.action;
        const dotIndex = event.target.dataset.dotIndex;
        const track = card.querySelector(".gallery-track");
        
        // 5 second delay before auto rotation resumes after manual navigation
        if (action && track) {
            const current = parseInt(track.dataset.activeIndex || "0");
            const nextIndex = action === "next" ? current + 1 : current - 1;
            rotateTo(track, nextIndex);
            scheduleRotation(track, 5000);
            return;
        }
        // same here for dot navigation
        if (dotIndex && track) {
            rotateTo(track, parseInt(dotIndex));
            scheduleRotation(track, 5000);
            return;
        }

        const projectIndex = parseInt(card.dataset.projectIndex || "0");
        const activeIndex = parseInt(track?.dataset.activeIndex || "0");

        currentProjectIndex = projectIndex;
        currentImageIndex = activeIndex;
        showImage();
        lightbox.classList.remove("hidden");
        lightbox.classList.add("show");
    });

    // Show selected image
    function showImage() {
        const projectImages = data[currentProjectIndex]?.images || [];
        const fallback = data[currentProjectIndex]?.imageSrc || "";
        const list = projectImages.length > 0 ? projectImages : [fallback];
        const safeIndex = ((currentImageIndex % list.length) + list.length) % list.length;
        lightboxImg.src = list[safeIndex];
        lightboxImg.alt = data[currentProjectIndex]?.title || "Gallery image";
    }

    // Close lightbox
    closeBtn.addEventListener("click", () => {
        lightbox.classList.add("hidden");
        lightbox.classList.remove("show");
    });

    // Next image
    nextBtn.addEventListener("click", () => {
        const list = data[currentProjectIndex]?.images || [];
        if (list.length === 0) {
            return;
        }
        currentImageIndex = (currentImageIndex + 1) % list.length;
        showImage();
    });

    // Previous image
    prevBtn.addEventListener("click", () => {
        const list = data[currentProjectIndex]?.images || [];
        if (list.length === 0) {
            return;
        }
        currentImageIndex = (currentImageIndex - 1 + list.length) % list.length;
        showImage();
    });

    // Close on background click
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
            lightbox.classList.add("hidden");
            lightbox.classList.remove("show");
        }
    });

    // Close on ESC key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            lightbox.classList.add("hidden");
            lightbox.classList.remove("show");
        }
    });
});
