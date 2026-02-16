// Theme toggle: three-way (system / light / dark) with circular expand animation
// Must be loaded in <head> to prevent flash of wrong theme.

let determineThemeSetting = () => {
  let s = localStorage.getItem("theme");
  return (s === "dark" || s === "light") ? s : "system";
};

let determineComputedTheme = () => {
  let s = determineThemeSetting();
  if (s === "system") {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return s;
};

let applyTheme = () => {
  document.documentElement.setAttribute("data-theme", determineComputedTheme());
};

// Apply immediately (no transition on first load)
applyTheme();

document.addEventListener("DOMContentLoaded", () => {
  const themeOrder = ["system", "light", "dark"];
  const track = document.querySelector(".theme-toggle__track");
  const buttons = document.querySelectorAll(".theme-toggle__btn");

  if (!track || !buttons.length) return;

  function setActiveButton(theme) {
    const index = Math.max(0, themeOrder.indexOf(theme));
    track.style.setProperty("--theme-index", index);
    buttons.forEach(btn => {
      const isActive = btn.dataset.theme === theme;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", isActive);
    });
  }

  function switchTheme(theme, event) {
    const doSwitch = () => {
      localStorage.setItem("theme", theme);
      setActiveButton(theme);
      applyTheme();
    };

    // Use View Transitions API with circular clip-path animation
    if (document.startViewTransition &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
        event) {
      const btn = event.currentTarget;
      const rect = btn.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      const maxX = Math.max(x, window.innerWidth - x);
      const maxY = Math.max(y, window.innerHeight - y);
      const radius = Math.sqrt(maxX * maxX + maxY * maxY);

      document.documentElement.style.setProperty("--theme-toggle-x", x + "px");
      document.documentElement.style.setProperty("--theme-toggle-y", y + "px");
      document.documentElement.style.setProperty("--theme-toggle-radius", radius + "px");

      document.documentElement.classList.add("theme-transitioning");
      const transition = document.startViewTransition(doSwitch);
      transition.finished.then(() => {
        document.documentElement.classList.remove("theme-transitioning");
      });
    } else {
      doSwitch();
    }
  }

  // Initialize from saved theme
  setActiveButton(determineThemeSetting());

  // Handle button clicks
  buttons.forEach(btn => {
    btn.addEventListener("click", function (e) {
      switchTheme(this.dataset.theme, e);
    });
  });

  // Listen for system theme changes
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (determineThemeSetting() === "system") applyTheme();
  });
});
