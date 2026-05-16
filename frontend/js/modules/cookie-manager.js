/**
 * Cookie Manager Module
 */

export function initCookiePopup() {
    const popup = document.getElementById("cookie-popup");
    const acceptBtn = document.getElementById("accept-cookie");
    const rejectBtn = document.getElementById("reject-cookie");
    if (!popup || !acceptBtn || !rejectBtn) return;

    if (!localStorage.getItem("cookieDecision")) {
        popup.style.display = "flex";
    }

    acceptBtn.addEventListener("click", () => {
        localStorage.setItem("cookieDecision", "accepted");
        popup.style.display = "none";
    });

    rejectBtn.addEventListener("click", () => {
        localStorage.setItem("cookieDecision", "rejected");
        popup.style.display = "none";
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCookiePopup);
} else {
    initCookiePopup();
}
