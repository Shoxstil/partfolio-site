"use strict";

// Keep the original cursor's two-speed follow, now as a planet and satellite.
(() => {
  if (typeof window.kursor !== "function") return;

  const mouse = window.matchMedia("(hover: hover) and (pointer: fine)");
  let cursor;

  function initialize() {
    if (!mouse.matches || cursor) return;
    cursor = new window.kursor({
      type: 1,
      color: "#fff",
      removeDefaultCursor: false,
    });
    cursor.kursor.setAttribute("aria-hidden", "true");
    cursor.kursorChild.setAttribute("aria-hidden", "true");

    const planet = document.createElement("span");
    planet.className = "cursor-planet";
    cursor.kursorChild.append(planet);

    const plane = document.createElement("span");
    plane.className = "cursor-orbit-plane";
    const rotor = document.createElement("span");
    rotor.className = "cursor-orbit-rotor";
    const satellite = document.createElement("span");
    satellite.className = "cursor-satellite";
    rotor.append(satellite);
    plane.append(rotor);
    cursor.kursor.append(plane);
  }

  function hide() {
    document.documentElement.classList.remove("cursor-enabled");
    if (cursor) cursor.kursor.classList.remove("--hover", "kursor--down");
  }

  initialize();
  window.addEventListener("mousemove", (event) => {
    if (!mouse.matches || !cursor) return;
    document.documentElement.classList.add("cursor-enabled");
    cursor.kursor.classList.toggle(
      "--hover",
      Boolean(event.target.closest("a, button, summary, [role='button']")),
    );
  });
  document.addEventListener("mouseleave", hide);
  window.addEventListener("blur", hide);
  mouse.addEventListener("change", () => {
    hide();
    initialize();
  });

  // Native dialogs live in the browser's top layer, above ordinary z-indexes.
  // Move both cursor elements into that layer while keeping them adjacent.
  const dialog = document.querySelector(".project-dialog");
  if (dialog) {
    new MutationObserver(() => {
      if (!cursor) return;
      const host = dialog.open ? dialog : document.body;
      host.append(cursor.kursor, cursor.kursorChild);
    }).observe(dialog, { attributes: true, attributeFilter: ["open"] });
  }
})();
