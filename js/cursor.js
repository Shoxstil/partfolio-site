"use strict";

// Same library, type and colour as the owner's original 2023 portfolio.
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
