const revealElements = document.querySelectorAll(".reveal");
const parallaxLayers = document.querySelectorAll(".parallax-layer");
const topbar = document.querySelector("#topbar");
const themeToggles = document.querySelectorAll("[data-theme-toggle]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
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
  if (window.innerWidth <= 760) {
    parallaxLayers.forEach((layer) => {
      layer.style.transform = "";
    });
    return;
  }

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

const closeMobileMenu = () => {
  if (!menuToggle || !mobileMenu) {
    return;
  }

  mobileMenu.classList.remove("is-open");
  menuToggle.classList.remove("is-active");
  menuToggle.setAttribute("aria-expanded", "false");
};

applyTheme(getPreferredTheme());

themeToggles.forEach((themeToggle) => {
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("dark-theme") ? "light" : "dark";
    applyTheme(nextTheme);
    window.localStorage.setItem(themeStorageKey, nextTheme);
  });
});

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("is-open");
    menuToggle.classList.toggle("is-active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  document.addEventListener("click", (event) => {
    if (!topbar || !topbar.contains(event.target)) {
      closeMobileMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeMobileMenu();
    }
  });
}

handleScroll();
window.addEventListener("scroll", handleScroll, { passive: true });
