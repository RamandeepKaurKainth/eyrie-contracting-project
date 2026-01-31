document.addEventListener("DOMContentLoaded", () => {

    const images = document.querySelectorAll(".gallery-img");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const closeBtn = document.getElementById("closeBtn");
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");

    let currentIndex = 0;

    // Open lightbox when clicking an image
    images.forEach(img => {
        img.addEventListener("click", () => {
            currentIndex = parseInt(img.dataset.index);
            showImage();
            lightbox.classList.remove("hidden");
            lightbox.classList.add("show");
        });
    });

    // Show selected image
    function showImage() {
        lightboxImg.src = images[currentIndex].src;
    }

    // Close lightbox
    closeBtn.addEventListener("click", () => {
        lightbox.classList.add("hidden");
        lightbox.classList.remove("show");
    });

    // Next image
    nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % images.length;
        showImage();
    });

    // Previous image
    prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
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
