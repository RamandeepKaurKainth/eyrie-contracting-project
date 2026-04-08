document.addEventListener("DOMContentLoaded", () => {
  initCounters();
  initSectorCards();
  initPartnerRow();
});

function initCounters() {
  const counters = document.querySelectorAll(".counter");
  const metricsSection = document.getElementById("metricsSection");

  if (!counters.length || !metricsSection) return;

  let hasAnimated = false;

  function animateValue(counter, target, suffix = "", isDecimal = false, duration = 1800) {
    let startTimestamp = null;

    function step(timestamp) {
      if (!startTimestamp) startTimestamp = timestamp;

      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
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

          obs.unobserve(metricsSection);
        }
      });
    },
    {
      threshold: 0.25
    }
  );

  observer.observe(metricsSection);
}

function initSectorCards() {
  const cards = document.querySelectorAll(".interactive-sector-card");

  if (!cards.length) return;

  cards.forEach((card) => {
    card.addEventListener(
      "touchstart",
      () => {
        cards.forEach((c) => {
          if (c !== card) c.classList.remove("is-active");
        });

        card.classList.toggle("is-active");
      },
      { passive: true }
    );

    card.addEventListener("mouseenter", () => {
      card.classList.add("is-active");
    });

    card.addEventListener("mouseleave", () => {
      card.classList.remove("is-active");
    });
  });
}

function initPartnerRow() {
  const partnerRow = document.getElementById("partnerRow");
  if (!partnerRow) return;

  const partnerSets = [
    [
      "Amazon",
      "FedEx",
      "Royal Columbian Hospital",
      "City of Vancouver",
      "Starbucks",
      "Chevron"
    ],
    [
      "Saputo",
      "McAsphalt Industries",
      "Dorigo Systems Ltd.",
      "Columbia Fuels",
      "Top Producers Realty",
      "NextLeaf Solutions"
    ],
    [
      "NextGen Integrated Systems",
      "HTEC",
      "Glass Tech",
      "City of Vancouver Parks Board",
      "Progressive Steel Industries",
      "SeaGate Mass Timber"
    ]
  ];

  let currentSetIndex = 0;
  let intervalId = null;

  function renderRow(items) {
    partnerRow.innerHTML = items
      .map(
        (name) => `
          <div class="partner-tile">
            <span class="partner-name">${name}</span>
          </div>
        `
      )
      .join("");
  }

  function swapRow() {
    partnerRow.classList.remove("is-fading-in");
    partnerRow.classList.add("is-fading-out");

    setTimeout(() => {
      currentSetIndex = (currentSetIndex + 1) % partnerSets.length;
      renderRow(partnerSets[currentSetIndex]);

      partnerRow.classList.remove("is-fading-out");
      partnerRow.classList.add("is-fading-in");
    }, 300);
  }

  renderRow(partnerSets[currentSetIndex]);
  partnerRow.classList.add("is-fading-in");

  intervalId = setInterval(swapRow, 4000);

  document.addEventListener("visibilitychange", () => {
    clearInterval(intervalId);

    if (!document.hidden) {
      intervalId = setInterval(swapRow, 4000);
    }
  });
}