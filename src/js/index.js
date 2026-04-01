document.addEventListener("DOMContentLoaded", () => {
  initCounters();
  initPartnerLogos();
});

function initCounters() {
  const counters = document.querySelectorAll(".counter");
  if (!counters.length) return;

  const counterSection = counters[0].closest("section");
  if (!counterSection) return;

  let hasAnimated = false;

  function animateValue(counter, target, suffix, isDecimal, duration = 1800) {
    let startTimestamp = null;

    function step(timestamp) {
      if (!startTimestamp) startTimestamp = timestamp;

      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      // easeOutCubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = target * easedProgress;

      counter.textContent = isDecimal
        ? currentValue.toFixed(1) + suffix
        : Math.floor(currentValue) + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        counter.textContent = isDecimal
          ? target.toFixed(1) + suffix
          : Math.floor(target) + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;

          counters.forEach((counter) => {
            const target = parseFloat(counter.getAttribute("data-target")) || 0;
            const suffix = counter.getAttribute("data-suffix") || "";
            const isDecimal = counter.getAttribute("data-decimal") === "true";

            animateValue(counter, target, suffix, isDecimal);
          });

          obs.unobserve(counterSection);
        }
      });
    },
    {
      threshold: 0.3
    }
  );

  observer.observe(counterSection);
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

  if (cards.some((card) => !card)) return;

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
  let intervalId = null;

  function renderPartner(partner) {
    return `
      <div class="partner-tile premium-partner-tile">
        <div class="partner-badge">
          <span class="partner-badge-label">TRUSTED BY</span>
          <span class="partner-badge-name">${partner.name}</span>
        </div>
      </div>
    `;
  }

  function setPartnerLogos(partners) {
    cards.forEach((card, index) => {
      if (partners[index]) {
        card.innerHTML = renderPartner(partners[index]);
      }
    });
  }

  function fadeOutCards() {
    cards.forEach((card) => {
      card.classList.remove("fade-in");
      card.classList.add("fade-out");
    });
  }

  function fadeInCards() {
    cards.forEach((card) => {
      card.classList.remove("fade-out");
      card.classList.add("fade-in");
    });
  }

  function swapPartnerLogos() {
    fadeOutCards();

    setTimeout(() => {
      const nextSet = showingA ? partnersB : partnersA;
      setPartnerLogos(nextSet);
      fadeInCards();
      showingA = !showingA;
    }, 320);
  }

  setPartnerLogos(partnersA);
  fadeInCards();

  intervalId = setInterval(swapPartnerLogos, 4500);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clearInterval(intervalId);
    } else {
      clearInterval(intervalId);
      intervalId = setInterval(swapPartnerLogos, 4500);
    }
  });
}