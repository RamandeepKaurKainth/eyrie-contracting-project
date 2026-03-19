Promise.all([
  fetch("footer.html").then(res => res.text())
])
.then(([footerHtml]) => {  // destructure the first element from the array
  document.getElementById("footer-placeholder").innerHTML = footerHtml;

  // Refresh AOS so animations work on dynamically loaded content
  if (AOS) AOS.refresh();
})
.catch(err => console.error("Error loading footer:", err));
