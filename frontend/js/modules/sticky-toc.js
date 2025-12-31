// sticky-toc.js
(() => {
  const headings = Array.from(document.querySelectorAll("h2, h3"));
  if (!headings.length) return;

  // Create sidebar
  const toc = document.createElement("div");
  toc.id = "toc-sidebar";

  // Inline styles (no external CSS needed)
  Object.assign(toc.style, {
    position: "fixed",
    top: "100px",
    right: "20px",
    width: "260px",
    maxHeight: "70vh",
    overflowY: "auto",
    background: "#ffffff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "12px",
    fontSize: "14px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    zIndex: "9999"
  });

  const title = document.createElement("div");
  title.textContent = "On this page";
  title.style.fontWeight = "bold";
  title.style.marginBottom = "10px";
  toc.appendChild(title);

  const links = [];

  headings.forEach((heading, index) => {
    if (!heading.id) {
      heading.id = `toc-section-${index}`;
    }

    const item = document.createElement("div");
    item.textContent = heading.textContent;
    item.dataset.target = heading.id;

    Object.assign(item.style, {
      cursor: "pointer",
      padding: "6px",
      borderRadius: "4px",
      marginLeft: heading.tagName === "H3" ? "12px" : "0",
      transition: "background 0.2s"
    });

    item.addEventListener("click", () => {
      document.getElementById(heading.id).scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });

    toc.appendChild(item);
    links.push(item);
  });

  document.body.appendChild(toc);

  // Highlight active section while scrolling
  function onScroll() {
    let current = headings[0];

    headings.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 120) {
        current = section;
      }
    });

    links.forEach((link) => {
      if (link.dataset.target === current.id) {
        link.style.background = "#e3f2fd";
        link.style.fontWeight = "bold";
      } else {
        link.style.background = "transparent";
        link.style.fontWeight = "normal";
      }
    });
  }

  document.addEventListener("scroll", onScroll);
  onScroll();
})();
