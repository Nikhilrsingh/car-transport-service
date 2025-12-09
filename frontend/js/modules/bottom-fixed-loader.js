const path = window.location.pathname;
const isInPagesFolder = path.includes("/pages/");
const base = isInPagesFolder ? ".." : ".";
fetch(`${base}/components/bottom-fixed-buttons.html`)
  .then((res) => res.text())
  .then((html) => {
    document.body.insertAdjacentHTML("beforeend", html);

    // Now the element exists — attach event
    const quoteBtn = document.getElementById("openQuoteModal");
    if (quoteBtn) {
      quoteBtn.addEventListener("click", () => {
        if (window.openQuoteModal) window.openQuoteModal();
      });
    }
  });
