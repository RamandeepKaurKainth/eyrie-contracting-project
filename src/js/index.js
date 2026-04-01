document.addEventListener("DOMContentLoaded", () => {
  initCounters();
  initPartnerLogos();
});

function initCounters() {
  const counters = document.querySelectorAll(".counter");
  if (!counters.length) return;

  let started = false;

  function animateCounters() {
    if (started) return;

    const section = counters[0].closest("section");
    if (!section) return;

    const sectionTop = section.getBoundingClientRect().top;

    if (sectionTop < window.innerHeight - 100) {
      started = true;

      counters.forEach((counter) => {
        const target = parseFloat(counter.getAttribute("data-target"));
        const suffix = counter.getAttribute("data-suffix") || "";
        const isDecimal = counter.getAttribute("data-decimal") === "true";

        let count = 0;
        const increment = target / 80;

        function update() {
          count += increment;

          if (count < target) {
            counter.textContent = isDecimal
              ? count.toFixed(1) + suffix
              : Math.floor(count) + suffix;

            requestAnimationFrame(update);
          } else {
            counter.textContent = isDecimal
              ? target.toFixed(1) + suffix
              : Math.floor(target) + suffix;
          }
        }

        update();
      });
    }
  }

  window.addEventListener("scroll", animateCounters);
  animateCounters();
}

function initPartnerLogos() {
  const cards = [
    document.getElementById("partner1"),
    document.getElementById("partner2"),
    document.getElementById("partner3"),
    document.getElementById("partner4"),
    document.getElementById("partner5"),
    document.getElementById("partner6")
  ];

  if (cards.some(card => !card)) return;

  const partnersA = [
    { name: "Amazon" },
    { name: "FedEx" },
    { name: "Royal Columbian Hospital" },
    { name: "City of Vancouver" },
    { name: "Starbucks" },
    { name: "Chevron" }
  ];

  const partnersB = [
    { name: "Saputo" },
    { name: "HTEC" },
    { name: "Dorigo Systems Ltd." },
    { name: "McAsphalt Industries Limited" },
    { name: "Columbia Fuels" },
    { name: "Top Producers Realty Property Management" }
  ];

  let showingA = true;

  function renderPartner(partner) {
    return `
      <div class="partner-tile partner-text-tile premium-partner-tile">
        <span>${partner.name}</span>
      </div>
    `;
  }

  function setPartnerLogos(partners) {
    cards.forEach((card, i) => {
      card.innerHTML = renderPartner(partners[i]);
    });
  }

  function swapPartnerLogos() {
    cards.forEach((card) => {
      card.classList.remove("fade-in");
      card.classList.add("fade-out");
    });

    setTimeout(() => {
      const newSet = showingA ? partnersB : partnersA;
      setPartnerLogos(newSet);

      cards.forEach((card) => {
        card.classList.remove("fade-out");
        card.classList.add("fade-in");
      });

      showingA = !showingA;
    }, 400);
  }

  setPartnerLogos(partnersA);
  setInterval(swapPartnerLogos, 5000);
}