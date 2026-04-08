Promise.all([fetch("footer.html").then(res => res.text())])
  .then(async ([footerHtml]) => {
    document.getElementById("footer-placeholder").innerHTML = footerHtml;

    const { companyInfo } = await import("./company.js");

    const footerPhone = document.getElementById("footer-phone");
    const footerEmail = document.getElementById("footer-email");
    const footerOfficeHour = document.getElementById("footer-officeHour");

    if (footerPhone) {
      footerPhone.innerText = companyInfo.phone;
      footerPhone.href = `tel:${companyInfo.phoneHref}`;
    }

    if (footerEmail) {
      footerEmail.innerText = companyInfo.email;
      footerEmail.href = `mailto:${companyInfo.email}`;
    }

    if (footerOfficeHour) {
      footerOfficeHour.innerText = companyInfo.businessHours;
    }

    if (typeof AOS !== "undefined") {
      AOS.refresh();
    }
  })
  .catch(err => console.error("Error loading footer:", err));