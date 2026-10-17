"use strict";

const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const menu = document.getElementById("myNav");
const menuToggle = document.querySelector(".menu-toggle");

function openNav() {
  menu.inert = false;
  document.querySelector("main").inert = true;
  document.querySelector(".site-header").inert = true;
  menu.classList.add("is-open");
  document.body.classList.add("menu-open");
  menuToggle.setAttribute("aria-expanded", "true");
  menu.querySelector(".closebtn").focus();
}

function closeNav(returnFocus = true) {
  menu.inert = true;
  document.querySelector("main").inert = false;
  document.querySelector(".site-header").inert = false;
  menu.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
  if (returnFocus) menuToggle.focus();
}

menuToggle.addEventListener("click", openNav);
menu.querySelector(".closebtn").addEventListener("click", () => closeNav());
menu.addEventListener("click", (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;
  closeNav(false);
  const destination = document.querySelector(link.getAttribute("href"));
  if (destination) {
    destination.tabIndex = -1;
    destination.focus({ preventScroll: true });
  }
});
document.addEventListener("keydown", (event) => {
  if (!menu.classList.contains("is-open")) return;
  if (event.key === "Escape") closeNav();
  if (event.key !== "Tab") return;
  const focusable = [...menu.querySelectorAll("button, a[href]")];
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});
window.matchMedia("(max-width: 800px)").addEventListener("change", (event) => {
  if (!event.matches && menu.classList.contains("is-open")) closeNav(false);
});

// Text stays in the document if JavaScript or motion is unavailable.
const typer = document.querySelector(".typer");
let typingTimer;
if (typer) {
  const words = typer.dataset.words
    .split(",")
    .map((word) => word.trim())
    .filter(Boolean);
  let wordIndex = 0;
  let count = words[0].length;
  let deleting = true;
  function typeNext() {
    if (motionPreference.matches) return;
    if (document.hidden) {
      typingTimer = setTimeout(typeNext, 500);
      return;
    }
    const word = words[wordIndex];
    count += deleting ? -1 : 1;
    typer.textContent = word.slice(0, count);
    let delay = deleting ? 40 : 85;
    if (!deleting && count === word.length) {
      deleting = true;
      delay = 2300;
    } else if (deleting && count === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 250;
    }
    typingTimer = setTimeout(typeNext, delay);
  }
  if (!motionPreference.matches) typingTimer = setTimeout(typeNext, 2400);
  motionPreference.addEventListener("change", (event) => {
    clearTimeout(typingTimer);
    if (event.matches) typer.textContent = words[0];
    else {
      wordIndex = 0;
      count = words[0].length;
      deleting = true;
      typer.textContent = words[0];
      typingTimer = setTimeout(typeNext, 2400);
    }
  });
}

// Meters share one clock so the numbers and the height never drift apart.
const skillColumns = [...document.querySelectorAll(".skill-column")];
let skillAnimationFrame;
let skillsStarted = false;
function renderSkill(column, progress) {
  const value = Number(column.dataset.level) * progress;
  column.style.setProperty("--level", `${value}%`);
  column.querySelector(".text-skill").textContent = `${Math.round(value)}%`;
}
function finishSkills() {
  cancelAnimationFrame(skillAnimationFrame);
  skillColumns.forEach((column) => renderSkill(column, 1));
}
if (
  skillColumns.length &&
  !motionPreference.matches &&
  "IntersectionObserver" in window
) {
  skillColumns.forEach((column) => renderSkill(column, 0));
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting) || skillsStarted)
        return;
      skillsStarted = true;
      observer.disconnect();
      const start = performance.now();
      function animateSkills(now) {
        const progress = Math.min((now - start) / 1800, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        skillColumns.forEach((column) => renderSkill(column, eased));
        if (progress < 1)
          skillAnimationFrame = requestAnimationFrame(animateSkills);
      }
      skillAnimationFrame = requestAnimationFrame(animateSkills);
    },
    { threshold: 0.2 },
  );
  observer.observe(document.querySelector(".skills"));
  motionPreference.addEventListener("change", (event) => {
    if (event.matches) {
      observer.disconnect();
      finishSkills();
    }
  });
}

// Reveal content once. The page remains fully visible without this enhancement.
if ("IntersectionObserver" in window) {
  const reveals = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 },
  );
  reveals.forEach((element) => revealObserver.observe(element));
  document.documentElement.classList.add("motion-enabled");

  const navigation = [...document.querySelectorAll(".desktop-nav a")];
  const navigationObserver = new IntersectionObserver(
    (entries) => {
      const active = entries.find((entry) => entry.isIntersecting);
      if (!active) return;
      navigation.forEach((link) => {
        if (link.hash === `#${active.target.id}`)
          link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-15% 0px -65% 0px" },
  );
  document
    .querySelectorAll("main > section[id]")
    .forEach((section) => navigationObserver.observe(section));
}

// A small amount of tilt on precision pointers, without moving the text too far.
const precisePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
document.querySelectorAll("[data-tilt]").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (motionPreference.matches || !precisePointer.matches) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty(
      "--tilt-x",
      `${((event.clientY - rect.top) / rect.height - 0.5) * -5}deg`,
    );
    card.style.setProperty(
      "--tilt-y",
      `${((event.clientX - rect.left) / rect.width - 0.5) * 5}deg`,
    );
  });
  card.addEventListener("pointerleave", () => {
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
  });
});

// Keep the familiar particle atmosphere sparse and quiet.
if (window.particlesJS && !motionPreference.matches) {
  particlesJS("particles-js", {
    particles: {
      number: { value: 35, density: { enable: true, value_area: 1200 } },
      color: { value: "#b8dcd8" },
      shape: { type: "circle" },
      opacity: { value: 0.3, random: true },
      size: { value: 1.4, random: true },
      line_linked: {
        enable: true,
        distance: 130,
        color: "#90b8bf",
        opacity: 0.1,
        width: 0.5,
      },
      move: {
        enable: true,
        speed: 0.3,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: false },
        onclick: { enable: false },
        resize: true,
      },
    },
    retina_detect: true,
  });
  const destroyParticles = () => {
    if (window.pJSDom) {
      window.pJSDom.forEach((instance) => instance.pJS.fn.vendors.destroypJS());
      window.pJSDom = [];
    }
  };
  motionPreference.addEventListener("change", (event) => {
    if (event.matches) destroyParticles();
  });
  // Background work stops when the hero is out of view or the tab is hidden.
  const particleInstance = window.pJSDom && window.pJSDom[0];
  let heroVisible = true;
  let particlesRunning = true;
  function syncParticles() {
    if (
      !particleInstance ||
      motionPreference.matches ||
      !particleInstance.pJS.canvas.el.isConnected
    )
      return;
    const shouldRun = heroVisible && !document.hidden;
    if (shouldRun === particlesRunning) return;
    particlesRunning = shouldRun;
    if (shouldRun) particleInstance.pJS.fn.vendors.draw();
    else cancelAnimationFrame(particleInstance.pJS.fn.drawAnimFrame);
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
      syncParticles();
    }).observe(document.querySelector(".hero"));
  }
  document.addEventListener("visibilitychange", syncParticles);
}

// Native dialog provides focus trapping, Escape and focus restoration.
const projectDialog = document.querySelector(".project-dialog");
const dialogImage = projectDialog.querySelector(".dialog-image");
let lastProjectButton;
document.querySelectorAll(".project-preview").forEach((button) => {
  button.addEventListener("click", () => {
    const image = button.querySelector("img");
    const title = button.closest("article").querySelector("h3").textContent;
    document.getElementById("project-dialog-title").textContent = title;
    dialogImage.src = image.src;
    dialogImage.alt = image.alt;
    lastProjectButton = button;
    projectDialog.showModal();
    document.body.classList.add("dialog-open");
  });
});
projectDialog
  .querySelectorAll(".dialog-close, .dialog-dismiss")
  .forEach((button) => {
    button.addEventListener("click", () => projectDialog.close());
  });
projectDialog.addEventListener("click", (event) => {
  if (event.target !== projectDialog) return;
  const bounds = projectDialog.getBoundingClientRect();
  if (
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom
  )
    projectDialog.close();
});
projectDialog.addEventListener("close", () => {
  document.body.classList.remove("dialog-open");
  if (lastProjectButton) lastProjectButton.focus({ preventScroll: true });
});
document.getElementById("year").textContent = String(new Date().getFullYear());
