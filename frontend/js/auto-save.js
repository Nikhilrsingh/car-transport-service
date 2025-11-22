// ------------------------------
// AUTO-SAVE + AUTO-FILL FORM DATA
// ------------------------------

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("autoSaveForm");
    if (!form) return;

    const formKey = form.getAttribute("id");

    // Load Saved Data (Auto-Fill)
    const savedData = localStorage.getItem(formKey);
    if (savedData) {
        const formValues = JSON.parse(savedData);

        Object.keys(formValues).forEach((key) => {
            const field = form.elements.namedItem(key);
            if (field) field.value = formValues[key];
        });
    }

    // Auto-Save on Every Input Change
    form.addEventListener("input", () => {
        const formValues = {};
        [...form.elements].forEach((field) => {
            if (field.name) {
                formValues[field.name] = field.value;
            }
        });

        localStorage.setItem(formKey, JSON.stringify(formValues));
    });

    // Clear data on successful submit
    form.addEventListener("submit", () => {
        localStorage.removeItem(formKey);
    });
});
