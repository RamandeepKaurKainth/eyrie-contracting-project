// ===============================
// MOBILE MENU TOGGLE
// ===============================
function toggleMenu() {
  document.getElementById("mobileMenu").classList.toggle("hidden");
}

function toggleMobileServices() {
  document
    .getElementById("mobileServicesDropdown")
    .classList.toggle("hidden");
}

// ===============================
// SLIDE-IN CONTACT PANEL
// ===============================
function openPanel(event) {
  if (event) event.stopPropagation();
  document.getElementById("callPanel").style.right = "0px";
}

function closePanel() {
  document.getElementById("callPanel").style.right = "-320px";
}

// ===============================
// CLOSE PANEL WHEN CLICKING OUTSIDE
// ===============================
document.addEventListener("click", (e) => {
  const panel = document.getElementById("callPanel");

  if (
    panel &&
    panel.style.right === "0px" &&
    !panel.contains(e.target)
  ) {
    closePanel();
  }
});

// ===============================
// PREVENT PANEL FROM CLOSING
// WHEN CLICKING INSIDE IT
// ===============================
const callPanel = document.getElementById("callPanel");
if (callPanel) {
  callPanel.addEventListener("click", (e) => {
    e.stopPropagation();
  });
}

// ===============================
// AUTO-CLOSE MOBILE MENU ON LINK CLICK
// ===============================
document.querySelectorAll("#mobileMenu a").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("mobileMenu").classList.add("hidden");
  });
});


// share header with all other pages
fetch("header.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("menu-placeholder").innerHTML = html;
  });
