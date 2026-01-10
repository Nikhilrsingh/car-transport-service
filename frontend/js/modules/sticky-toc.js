// sticky-toc.js
/**
 * Sticky Table of Contents (TOC) with Vertical Dragging on Right Side
 * 
 * CHANGES:
 * - OLD: Fixed position at top: 100px, right: 0 (hardcoded, non-adjustable)
 * - NEW: Vertically draggable wrapper along right edge (top to bottom)
 * - FIXED: Single click/tap to toggle (no double-click required)
 * - FIXED: Works properly on mobile with tap and drag
 * 
 * Features:
 * - Vertical dragging (up/down) along the right side of the page (top to bottom)
 * - TOC content is HIDDEN during drag (only button visible for dragging)
 * - Always stays fixed to right: 0 (cannot move horizontally)
 * - Position saved to localStorage and restored on page reload
 * - Boundary checking to prevent going off-screen (top to bottom)
 * - Click/tap to toggle expand/collapse, drag up/down to reposition
 * - Works on desktop (mouse) and mobile (touch)
 */
(() => {
  const headings = Array.from(document.querySelectorAll("h2, h3"));
  if (!headings.length) return;

  // Check saved state - loads user's preferred vertical position
  const isCollapsed = localStorage.getItem("tocSidebarCollapsed") === "true";
  const savedTop = localStorage.getItem("tocWrapperTop");
  
  // OLD: hardcoded top: 100px, right: 0 - NOW DISABLED
  // NEW: uses saved top position or defaults (user can drag vertically)
  const initialTop = savedTop ? parseInt(savedTop, 10) : 100;

  // Create wrapper container - VERTICALLY DRAGGABLE on right side
  const wrapper = document.createElement("div");
  wrapper.id = "toc-wrapper";
  wrapper.className = "toc-wrapper";
  
  // Set initial position - ALWAYS fixed to right side
  const wrapperStyles = {
    position: "fixed",
    // OLD: top: "100px" - DISABLED, now uses dynamic top position
    top: `${initialTop}px`, // User-adjustable via vertical dragging
    right: "0", // ALWAYS fixed to right side - never changes
    zIndex: "9999",
    display: "flex",
    alignItems: "flex-start",
    transition: "transform 0.3s ease, opacity 0.4s ease, visibility 0.4s ease",
    opacity: "0",
    visibility: "hidden"
  };
  
  // Apply collapsed state with transform (only affects horizontal slide)
  if (isCollapsed) {
    wrapperStyles.transform = "translateX(calc(100% - 32px))";
  } else {
    wrapperStyles.transform = "translateX(0)";
  }
  
  Object.assign(wrapper.style, wrapperStyles);

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
    cursor: "grab",
    boxShadow: "-2px 2px 8px rgba(0,0,0,0.15)",
    flexShrink: "0",
    userSelect: "none",
    position: "relative"
  });
  
  // Add visual indicator for dragging
  toggleTab.title = "Click to toggle | Drag up/down to reposition (content hidden during drag)";

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
    // Don't toggle if currently dragging
    if (isDragging) return;
    
    collapsed = !collapsed;
    localStorage.setItem("tocSidebarCollapsed", collapsed);

    // Update transform for collapse/expand slide effect (horizontal slide)
    // Works with right positioning - slides in/out from right edge
    if (collapsed) {
      wrapper.style.transform = "translateX(calc(100% - 32px))";
      arrow.style.transform = "rotate(180deg)";
    } else {
      wrapper.style.transform = "translateX(0)";
      arrow.style.transform = "rotate(0deg)";
    }
  }

  // Vertical dragging functionality (up/down along right edge only)
  let isDragging = false;
  let dragStartY = 0;
  let dragStartTop = 0;
  let hasDragged = false;

  // Mouse events for vertical dragging and clicking (toggle)
  toggleTab.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return; // Only handle left mouse button
    
    e.preventDefault();
    hasDragged = false;
    dragStartY = e.clientY;
    dragStartTop = parseInt(wrapper.style.top, 10) || initialTop;
    
    const handleMouseMove = (moveEvent) => {
      // Only check vertical movement (ignore horizontal/X-axis)
      const deltaY = Math.abs(moveEvent.clientY - dragStartY);
      
      // Increased threshold to 10px to better distinguish drag from click
      if (deltaY > 10) {
        if (!isDragging) {
          isDragging = true;
          hasDragged = true;
          toggleTab.style.cursor = "grabbing";
          
          // Hide TOC content during drag (only show the drag button)
          toc.style.display = "none";
          toc.style.opacity = "0";
          toc.style.visibility = "hidden";
          
          // Disable transform during drag (collapse slide effect)
          // We'll re-apply transform after drag ends if collapsed
          wrapper.style.transform = "translateX(0)";
          wrapper.style.transition = "opacity 0.4s ease, visibility 0.4s ease";
          wrapper.style.userSelect = "none";
        }
        
        // Calculate new position based on VERTICAL drag distance only
        const newDeltaY = moveEvent.clientY - dragStartY;
        let newTop = dragStartTop + newDeltaY;
        
        // Use only toggleTab height for boundary calculation during drag (since content is hidden)
        const toggleTabHeight = toggleTab.offsetHeight || 40;
        
        // Boundary limits (vertical only - allows dragging from top to bottom along right edge)
        const minTop = 10; // Minimum distance from top
        const maxTop = window.innerHeight - toggleTabHeight - 80; // Leave space at bottom (for navbar etc.)
        
        // Clamp position within bounds (vertical only)
        newTop = Math.max(minTop, Math.min(maxTop, newTop));
        
        // Update position (only top - right stays at 0)
        wrapper.style.top = `${newTop}px`;
        // Ensure right stays at 0 (no horizontal movement)
        wrapper.style.right = "0";
        wrapper.style.left = ""; // Clear any left positioning
      }
    };
    
    const handleMouseUp = (upEvent) => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      
      if (isDragging) {
        // End drag - show TOC content again
        isDragging = false;
        toggleTab.style.cursor = "grab";
        wrapper.style.transition = "transform 0.3s ease, opacity 0.4s ease, visibility 0.4s ease";
        wrapper.style.userSelect = "";
        
        // Show TOC content again (restore visibility)
        // Use setTimeout to ensure smooth transition
        setTimeout(() => {
          // Restore content visibility - remove inline styles to restore default
          toc.style.display = ""; // Remove inline style, defaults to block for div
          toc.style.opacity = ""; // Remove inline style
          toc.style.visibility = ""; // Remove inline style, defaults to visible
        }, 50);
        
        // Re-apply transform if collapsed (restore collapse state)
        if (collapsed) {
          wrapper.style.transform = "translateX(calc(100% - 32px))";
        }
        
        // Ensure right stays at 0
        wrapper.style.right = "0";
        wrapper.style.left = "";
        
        // Save vertical position to localStorage (only top, not left)
        const finalTop = parseInt(wrapper.style.top, 10);
        if (finalTop !== undefined && finalTop !== null) {
          localStorage.setItem("tocWrapperTop", finalTop.toString());
        }
        // Clear any saved left position (not used for right-side dragging)
        localStorage.removeItem("tocWrapperLeft");
      } else if (!hasDragged) {
        // No drag occurred, treat as click (toggle)
        toggleToc();
      }
    };
    
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  });

  // Touch events for mobile vertical dragging (along right edge only)
  let touchStartY = 0;
  let touchStartTop = 0;
  let touchHasDragged = false;

  toggleTab.addEventListener("touchstart", (e) => {
    touchStartY = e.touches[0].clientY;
    touchStartTop = parseInt(wrapper.style.top, 10) || initialTop;
    touchHasDragged = false;
  }, { passive: true });

  toggleTab.addEventListener("touchmove", (e) => {
    const currentY = e.touches[0].clientY;
    const deltaY = Math.abs(currentY - touchStartY);
    
    // Increased threshold to 15px to better distinguish drag from tap
    if (deltaY > 15) {
      touchHasDragged = true;
      
      if (!isDragging) {
        isDragging = true;
        toggleTab.style.cursor = "grabbing";
        
        // Hide TOC content during drag (only show the drag button)
        toc.style.display = "none";
        toc.style.opacity = "0";
        toc.style.visibility = "hidden";
        
        // Disable transform during drag
        wrapper.style.transform = "translateX(0)";
        wrapper.style.transition = "opacity 0.4s ease, visibility 0.4s ease";
        wrapper.style.userSelect = "none";
      }
      
      // Prevent scrolling during drag
      e.preventDefault();
      
      // Calculate new position based on VERTICAL drag distance only
      const newDeltaY = currentY - touchStartY;
      let newTop = touchStartTop + newDeltaY;
      
      // Use only toggleTab height for boundary calculation during drag
      const toggleTabHeight = toggleTab.offsetHeight || 40;
      
      // Boundary limits (vertical only)
      const minTop = 10;
      const maxTop = window.innerHeight - toggleTabHeight - 80;
      
      // Clamp position within bounds
      newTop = Math.max(minTop, Math.min(maxTop, newTop));
      
      // Update position (only top - right stays at 0)
      wrapper.style.top = `${newTop}px`;
      wrapper.style.right = "0";
      wrapper.style.left = "";
    }
  }, { passive: false });

  toggleTab.addEventListener("touchend", (e) => {
    if (isDragging && touchHasDragged) {
      // End drag - show TOC content again
      isDragging = false;
      toggleTab.style.cursor = "grab";
      wrapper.style.transition = "transform 0.3s ease, opacity 0.4s ease, visibility 0.4s ease";
      wrapper.style.userSelect = "";
      
      // Show TOC content again
      setTimeout(() => {
        toc.style.display = "";
        toc.style.opacity = "";
        toc.style.visibility = "";
      }, 50);
      
      // Re-apply transform if collapsed
      if (collapsed) {
        wrapper.style.transform = "translateX(calc(100% - 32px))";
      }
      
      // Ensure right stays at 0
      wrapper.style.right = "0";
      wrapper.style.left = "";
      
      // Save position
      const finalTop = parseInt(wrapper.style.top, 10);
      if (finalTop !== undefined && finalTop !== null) {
        localStorage.setItem("tocWrapperTop", finalTop.toString());
      }
      localStorage.removeItem("tocWrapperLeft");
    } else if (!touchHasDragged) {
      // No drag detected - treat as tap (toggle)
      // ALWAYS toggle on tap - user wants simple tap to open/close
      toggleToc();
    }
    
    // Reset state
    touchHasDragged = false;
    touchStartY = 0;
    touchStartTop = 0;
  }, { passive: true });
  
  // Also handle click event for any devices that trigger it
  toggleTab.addEventListener("click", (e) => {
    // Only handle if not currently dragging
    if (!isDragging && !hasDragged) {
      toggleToc();
    }
  });

  // Update position on window resize to keep it in bounds (vertical only, right side fixed)
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const currentTop = parseInt(wrapper.style.top, 10) || initialTop;
      // Use toggleTab height for boundary calculation (content is hidden during drag)
      const toggleTabHeight = toggleTab.offsetHeight || 40;
      
      // Boundary limits (vertical only - allows dragging from top to bottom along right edge)
      const minTop = 10; // Minimum distance from top
      const maxTop = window.innerHeight - toggleTabHeight - 80; // Leave space at bottom (for navbar etc.)
      
      // Clamp position within bounds (vertical only)
      let newTop = Math.max(minTop, Math.min(maxTop, currentTop));
      
      // Ensure right stays at 0
      wrapper.style.right = "0";
      wrapper.style.left = "";
      
      // Update position if it changed (vertical only)
      if (newTop !== currentTop) {
        wrapper.style.top = `${newTop}px`;
        localStorage.setItem("tocWrapperTop", newTop.toString());
      }
    }, 100);
  });

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