// Apply glow-inputs class to all inputs, selects, and textareas
window.addEventListener("load", () => {
    const fields = document.querySelectorAll("input, select, textarea");
    fields.forEach(field => {
        field.classList.add("glow-inputs");
    });
    console.log("Glow class applied to", fields.length, "fields");
});
