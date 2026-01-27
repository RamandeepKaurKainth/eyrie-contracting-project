 document.getElementById("contactForm").addEventListener("submit", function (e) {
      e.preventDefault();

      alert("Thank you! Your request has been submitted.");

      // Later: send form data to backend using fetch()
      // const formData = new FormData(this);
      // fetch('/api/contact', { method: 'POST', body: formData });

      this.reset();
    });

fetch("header.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("menu-placeholder").innerHTML = html;
  });
