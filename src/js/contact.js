
import { companyInfo } from "./company.js";

document.getElementById("companyName").innerText = companyInfo.name;
//document.getElementById("country").innerText = companyInfo.country;
document.getElementById("address1").innerText = companyInfo.address1;
document.getElementById("city").innerText = companyInfo.city;
document.getElementById("province").innerText = companyInfo.Province;
document.getElementById("postalCode").innerText = companyInfo.postalCode;

document.getElementById("phone").innerText = companyInfo.phone;
document.getElementById("phone").href ="tel:" + companyInfo.phoneHref;
document.getElementById("phoneLink").href = "tel:" + companyInfo.phoneHref;

document.getElementById("email").innerText = companyInfo.email;
document.getElementById("email").href = "mailto:" + companyInfo.email;
document.getElementById("emailLink").href = "mailto:" + companyInfo.email;

document.getElementById("officeHour").innerText = companyInfo.bussinessHour;
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


