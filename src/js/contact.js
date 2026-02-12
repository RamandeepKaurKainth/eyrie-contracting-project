
document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  console.log(formData);

  const response = await fetch("http://localhost:3000/send-email", {
    method: "POST",
    body: formData
  });

  const result = await response.json();
  if (result.success) {
    alert("Your request has been sent!");
  } else {
    alert("Error sending message");
  }
});


fetch("header.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("menu-placeholder").innerHTML = html;
  });
