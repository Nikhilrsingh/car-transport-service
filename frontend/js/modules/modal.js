// modal.js
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("quoteModal");
    const closeBtn = document.getElementById("closeQuoteModal");

    // Global function to open modal
    window.openQuoteModal = function () {
        if (!modal) return;
        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
    };

    // Close modal button
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
            document.body.style.overflow = "";
        });
    }

    // Click outside to close
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
            document.body.style.overflow = "";
        }
    });
});
