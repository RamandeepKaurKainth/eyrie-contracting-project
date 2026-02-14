// Load PANEL
fetch("panel.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("panel-placeholder").innerHTML = html;
  });

// Load HEADER
fetch("header.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("header-placeholder").innerHTML = html;
    initHeaderFunctions();
  });

// Initialize header + panel functions
function initHeaderFunctions() {

  window.toggleMenu = function () {
    document.getElementById("mobileMenu").classList.toggle("hidden");
  };

  window.toggleMobileServices = function () {
    document.getElementById("mobileServicesDropdown").classList.toggle("hidden");
  };

  window.openPanel = function (event) {
    if (event) event.stopPropagation();
    document.getElementById("callPanel").style.right = "0";
    document.getElementById("overlay").classList.remove("hidden");
  };

  window.closePanel = function () {
    document.getElementById("callPanel").style.right = "-320px";
    document.getElementById("overlay").classList.add("hidden");
  };

  document.addEventListener("click", (e) => {
    const panel = document.getElementById("callPanel");
    if (panel && panel.style.right === "0px" && !panel.contains(e.target)) {
      closePanel();
    }
  });

  const callPanel = document.getElementById("callPanel");
  if (callPanel) {
    callPanel.addEventListener("click", (e) => e.stopPropagation());
  }
}
