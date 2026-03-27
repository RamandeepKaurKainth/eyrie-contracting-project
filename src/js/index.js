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
        const target = Number(counter.getAttribute("data-target"));
        let count = 0;
        const increment = target / 80;

        function update() {
          count += increment;

          if (count < target) {
            counter.textContent = Math.floor(count);
            requestAnimationFrame(update);
          } else {
            counter.textContent = target + (target === 10 ? "+" : "%");
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

  const logosA = [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Home_Depot_logo.svg/512px-Home_Depot_logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Costco_Wholesale_logo_2010-10-26.svg/512px-Costco_Wholesale_logo_2010-10-26.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/RONA_logo.svg/512px-RONA_logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Canadian_Tire_Logo.svg/512px-Canadian_Tire_Logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Walmart_logo.svg/512px-Walmart_logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Best_Buy_Logo.svg/512px-Best_Buy_Logo.svg.png"
  ];

  const logosB = [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Safeway_logo.svg/512px-Safeway_logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Loblaws_logo.svg/512px-Loblaws_logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Staples_2019.svg/512px-Staples_2019.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/7-Eleven_logo.svg/512px-7-Eleven_logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/IKEA_logo.svg/512px-IKEA_logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Target_logo.svg/512px-Target_logo.svg.png"
  ];

  let showingA = true;

  function setPartnerLogos(logos) {
    cards.forEach((card, i) => {
      card.innerHTML = `<img src="${logos[i]}" alt="Partner logo" class="w-full h-20 object-contain">`;
    });
  }

  function swapPartnerLogos() {
    cards.forEach((card) => {
      card.classList.remove("fade-in");
      card.classList.add("fade-out");
    });

    setTimeout(() => {
      const newSet = showingA ? logosB : logosA;
      setPartnerLogos(newSet);

      cards.forEach((card) => {
        card.classList.remove("fade-out");
        card.classList.add("fade-in");
      });

      showingA = !showingA;
    }, 500);
  }

  setPartnerLogos(logosA);
  setInterval(swapPartnerLogos, 5000);
}