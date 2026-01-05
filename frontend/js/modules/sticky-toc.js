// sticky-toc.js
(() => {
  const headings = Array.from(document.querySelectorAll("h2, h3"));
  if (!headings.length) return;

  // Check saved state
  const isCollapsed = localStorage.getItem("tocSidebarCollapsed") === "true";

  // Create wrapper container
  const wrapper = document.createElement("div");
  wrapper.id = "toc-wrapper";
  wrapper.className = "toc-wrapper";
  Object.assign(wrapper.style, {
    position: "fixed",
    top: "100px",
    right: "0",
    zIndex: "9999",
    display: "flex",
    alignItems: "flex-start",
    transition: "transform 0.3s ease, opacity 0.4s ease, visibility 0.4s ease",
    transform: isCollapsed ? "translateX(calc(100% - 32px))" : "translateX(0)",
    opacity: "0",
    visibility: "hidden"
  });

  // Create toggle tab (arrow button)
  const toggleTab = document.createElement("div");
  toggleTab.id = "toc-toggle-tab";
  Object.assign(toggleTab.style, {
    width: "32px",
    height: "40px",
    background: "#ff6347",
    borderRadius: "8px 0 0 8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "-2px 2px 8px rgba(0,0,0,0.15)",
    flexShrink: "0"
  });

  const arrow = document.createElement("span");
  arrow.innerHTML = "&#9664;"; // Left arrow
  Object.assign(arrow.style, {
    color: "#fff",
    fontSize: "14px",
    transition: "transform 0.3s ease",
    transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)"
  });
  toggleTab.appendChild(arrow);

  // Create sidebar
  const toc = document.createElement("div");
  toc.id = "toc-sidebar";
  Object.assign(toc.style, {
    width: "260px",
    maxHeight: "70vh",
    overflowY: "auto",
    background: "#ffffff",
    border: "1px solid #ddd",
    borderRadius: "8px 0 0 8px",
    padding: "12px",
    fontSize: "14px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
  });

  const title = document.createElement("div");
  title.textContent = "On this page";
  Object.assign(title.style, {
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#333",
    borderBottom: "2px solid #ff6347",
    paddingBottom: "8px"
  });
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
      transition: "background 0.2s",
      color: "#555"
    });

    item.addEventListener("click", () => {
      document.getElementById(heading.id).scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });

    item.addEventListener("mouseenter", () => {
      item.style.background = "#f5f5f5";
    });
    item.addEventListener("mouseleave", () => {
      if (item.style.fontWeight !== "bold") {
        item.style.background = "transparent";
      }
    });

    toc.appendChild(item);
    links.push(item);
  });

  // Assemble wrapper
  wrapper.appendChild(toggleTab);
  wrapper.appendChild(toc);
  document.body.appendChild(wrapper);

  // Show TOC after preloader finishes
  function showToc() {
    wrapper.style.opacity = "1";
    wrapper.style.visibility = "visible";
  }

  // Check if page is already loaded
  if (document.body.classList.contains('loaded')) {
    showToc();
  } else {
    // Listen for when preloader finishes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target === document.body && document.body.classList.contains('loaded')) {
          showToc();
          observer.disconnect();
        }
      });
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  // Toggle functionality
  let collapsed = isCollapsed;

  function toggleToc() {
    collapsed = !collapsed;
    localStorage.setItem("tocSidebarCollapsed", collapsed);

    if (collapsed) {
      wrapper.style.transform = "translateX(calc(100% - 32px))";
      arrow.style.transform = "rotate(180deg)";
    } else {
      wrapper.style.transform = "translateX(0)";
      arrow.style.transform = "rotate(0deg)";
    }
  }

  toggleTab.addEventListener("click", toggleToc);

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
        link.style.color = "#ff6347";
      } else {
        link.style.background = "transparent";
        link.style.fontWeight = "normal";
        link.style.color = "#555";
      }
    });
  }

  document.addEventListener("scroll", onScroll);
  onScroll();
})();
