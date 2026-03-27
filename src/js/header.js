Promise.all([
  fetch("panel.html").then(res => res.text()),
  fetch("header.html").then(res => res.text())
])
.then(([panelHtml, headerHtml]) => {
  document.getElementById("panel-placeholder").innerHTML = panelHtml;
  document.getElementById("header-placeholder").innerHTML = headerHtml;
  initHeaderFunctions();
})
.catch(err => console.error("Error loading header/panel:", err));

function initHeaderFunctions() {
  let panelOpen = false;

  window.toggleMenu = function () {
    const mobileMenu = document.getElementById("mobileMenu");
    if (mobileMenu) {
      mobileMenu.classList.toggle("hidden");
    }
  };

  window.toggleMobileServices = function () {
    const mobileDropdown = document.getElementById("mobileServicesDropdown");
    if (mobileDropdown) {
      mobileDropdown.classList.toggle("hidden");
    }
  };

  window.openPanel = function (event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const panel = document.getElementById("callPanel");
    const overlay = document.getElementById("overlay");

    if (panel) panel.style.right = "0";
    if (overlay) overlay.classList.remove("hidden");

    panelOpen = true;
  };

  window.closePanel = function () {
    const panel = document.getElementById("callPanel");
    const overlay = document.getElementById("overlay");

    if (panel) panel.style.right = "-100%";
    if (overlay) overlay.classList.add("hidden");

    panelOpen = false;
  };

  const overlay = document.getElementById("overlay");
  if (overlay) {
    overlay.addEventListener("click", closePanel);
  }

  const callPanel = document.getElementById("callPanel");
  if (callPanel) {
    callPanel.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  }

  document.addEventListener("click", function (e) {
    const panel = document.getElementById("callPanel");

    if (
      panelOpen &&
      panel &&
      !panel.contains(e.target)
    ) {
      closePanel();
    }
  });

  let scrollTimeout;
  window.addEventListener("scroll", function () {
    if (!panelOpen) return;

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      closePanel();
    }, 80);
  }, { passive: true });
}