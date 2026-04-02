Promise.all([fetch("footer.html").then(res => res.text())])
  .then(async ([footerHtml]) => {
    document.getElementById("footer-placeholder").innerHTML = footerHtml;

    // Now update footer info
    const { companyInfo } = await import("./company.js");

    document.getElementById("phone").innerText = companyInfo.phone;
    document.getElementById("phone").href = "tel:" + companyInfo.phoneHref;

    document.getElementById("email").innerText = companyInfo.email;
    document.getElementById("email").href = "mailto:" + companyInfo.email;

    // Fix comma between city and province
    const city = document.getElementById("city")?.innerText.trim();
    const province = document.getElementById("province")?.innerText.trim();
    const cityComma = document.getElementById("cityComma");

    if (cityComma) {
      cityComma.innerText = city && province ? ", " : "";
    }

    // Refresh AOS for animations
    if (AOS) AOS.refresh();
  })
  .catch(err => console.error("Error loading footer:", err));