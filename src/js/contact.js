import { companyInfo } from "./company.js";

function fillContactInfo() {
  const companyName = document.getElementById("companyName");
  const phone = document.getElementById("phone");
  const phoneLink = document.getElementById("phoneLink");
  const email = document.getElementById("email");
  const emailLink = document.getElementById("emailLink");
  const officeHour = document.getElementById("officeHour");

  if (companyName) companyName.innerText = companyInfo.name;

  if (phone) {
    phone.innerText = companyInfo.phone;
    phone.href = `tel:${companyInfo.phoneHref}`;
  }

  if (phoneLink) {
    phoneLink.href = `tel:${companyInfo.phoneHref}`;
  }

  if (email) {
    email.innerText = companyInfo.email;
    email.href = `mailto:${companyInfo.email}`;
  }

  if (emailLink) {
    emailLink.href = `mailto:${companyInfo.email}`;
  }

  if (officeHour) {
    officeHour.innerText = companyInfo.businessHours;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fillContactInfo();

  setTimeout(() => {
    fillContactInfo();
  }, 300);
});