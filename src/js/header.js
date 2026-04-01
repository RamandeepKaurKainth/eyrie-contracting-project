Promise.all([
  fetch("panel.html").then((res) => res.text()),
  fetch("header.html").then((res) => res.text())
])
  .then(([panelHtml, headerHtml]) => {
    const panelPlaceholder = document.getElementById("panel-placeholder");
    const headerPlaceholder = document.getElementById("header-placeholder");

    if (panelPlaceholder) panelPlaceholder.innerHTML = panelHtml;
    if (headerPlaceholder) headerPlaceholder.innerHTML = headerHtml;

    initHeaderFunctions();
  })
  .catch((err) => console.error("Error loading header/panel:", err));

function initHeaderFunctions() {
  let panelOpen = false;

  window.toggleMenu = function () {
    const mobileMenu = document.getElementById("mobileMenu");
    if (!mobileMenu) return;
    mobileMenu.classList.toggle("hidden");
  };

  window.openPanel = function (event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const panel = document.getElementById("callPanel");
    const overlay = document.getElementById("overlay");
    const mobileMenu = document.getElementById("mobileMenu");

    if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
      mobileMenu.classList.add("hidden");
    }

    if (panel) panel.style.right = "0";
    if (overlay) overlay.classList.remove("hidden");

    panelOpen = true;
    document.body.classList.add("panel-open");
  };

  window.closePanel = function () {
    const panel = document.getElementById("callPanel");
    const overlay = document.getElementById("overlay");

    if (panel) panel.style.right = "-100%";
    if (overlay) overlay.classList.add("hidden");

    panelOpen = false;
    document.body.classList.remove("panel-open");
  };

  const overlay = document.getElementById("overlay");
  if (overlay) {
    overlay.addEventListener("click", window.closePanel);
  }

  const callPanel = document.getElementById("callPanel");
  if (callPanel) {
    callPanel.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  }

  document.addEventListener("click", function (e) {
    const panel = document.getElementById("callPanel");
    const mobileMenu = document.getElementById("mobileMenu");

    if (
      mobileMenu &&
      !mobileMenu.classList.contains("hidden") &&
      !mobileMenu.contains(e.target) &&
      !e.target.closest(".mobile-toggle-btn")
    ) {
      mobileMenu.classList.add("hidden");
    }

    if (
      panelOpen &&
      panel &&
      !panel.contains(e.target) &&
      !e.target.closest(".header-cta-btn") &&
      !e.target.closest(".btn-primary")
    ) {
      window.closePanel();
    }
  });

  let scrollTimeout;
  window.addEventListener(
    "scroll",
    function () {
      if (!panelOpen) return;

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        window.closePanel();
      }, 100);
    },
    { passive: true }
  );

  window.addEventListener("resize", function () {
    const mobileMenu = document.getElementById("mobileMenu");
    if (window.innerWidth >= 768 && mobileMenu) {
      mobileMenu.classList.add("hidden");
    }
  });
}