Promise.all([fetch("footer.html").then(res => res.text())])
  .then(async ([footerHtml]) => {
    document.getElementById("footer-placeholder").innerHTML = footerHtml;

    // Now update footer info
    const { companyInfo } = await import("./company.js");

    document.getElementById("companyName").innerText = companyInfo.name;
    document.getElementById("country").innerText = companyInfo.country;
    document.getElementById("address1").innerText = companyInfo.address1;
    document.getElementById("city").innerText = companyInfo.city;
    document.getElementById("province").innerText = companyInfo.Province;
    document.getElementById("postalCode").innerText = companyInfo.postalCode;

    document.getElementById("phone").innerText = companyInfo.phone;
    document.getElementById("phone").href = "tel:" + companyInfo.phoneHref;

    document.getElementById("email").innerText = companyInfo.email;
    document.getElementById("email").href = "mailto:" + companyInfo.email;

    // Refresh AOS for animations
    if (AOS) AOS.refresh();
  })
  .catch(err => console.error("Error loading footer:", err));