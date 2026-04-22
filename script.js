const revealElements = document.querySelectorAll(".reveal");
const parallaxLayers = document.querySelectorAll(".parallax-layer");
const topbar = document.querySelector("#topbar");
const themeToggle = document.querySelector("#theme-toggle");
const themeStorageKey = "winter-theme";

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -8% 0px",
  },
);

revealElements.forEach((element) => revealObserver.observe(element));

const updateTopbarState = () => {
  if (!topbar) {
    return;
  }

  topbar.classList.toggle("is-scrolled", window.scrollY > 18);
};

const handleParallax = () => {
  const viewportOffset = window.scrollY;

  parallaxLayers.forEach((layer) => {
    const speed = Number(layer.dataset.speed || 0.1);
    const translateY = viewportOffset * speed;
    layer.style.transform = `translate3d(0, ${translateY}px, 0)`;
  });
};

const handleScroll = () => {
  updateTopbarState();
  handleParallax();
};

const applyTheme = (theme) => {
  document.body.classList.toggle("dark-theme", theme === "dark");
};

const getPreferredTheme = () => {
  const savedTheme = window.localStorage.getItem(themeStorageKey);
  return savedTheme === "dark" ? "dark" : "light";
};

if (themeToggle) {
  applyTheme(getPreferredTheme());

  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("dark-theme") ? "light" : "dark";
    applyTheme(nextTheme);
    window.localStorage.setItem(themeStorageKey, nextTheme);
  });
}

handleScroll();
window.addEventListener("scroll", handleScroll, { passive: true });
