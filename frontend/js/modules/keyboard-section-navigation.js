// keyboard-section-navigation.js
(function () {
  const sections = Array.from(document.querySelectorAll("h2, h3"));
  if (!sections.length) return;

  let index = 0;

  function highlight(el) {
    el.style.outline = "3px solid #ff9800";
    setTimeout(() => {
      el.style.outline = "";
    }, 700);
  }

  function goTo(i) {
    if (i < 0 || i >= sections.length) return;
    index = i;
    sections[index].scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
    highlight(sections[index]);
  }

  document.addEventListener("keydown", (e) => {
    // 🚫 Ignore typing inside inputs
    const tag = document.activeElement.tagName;
    if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;

    // ✅ Require Alt + Shift
    if (!e.altKey || !e.shiftKey) return;

    switch (e.key.toLowerCase()) {
      case "n": // Next
        e.preventDefault();
        goTo(Math.min(index + 1, sections.length - 1));
        break;

      case "p": // Previous
        e.preventDefault();
        goTo(Math.max(index - 1, 0));
        break;

      case "h": // Home
        e.preventDefault();
        goTo(0);
        break;

      case "e": // End
        e.preventDefault();
        goTo(sections.length - 1);
        break;
    }
  });
})();
