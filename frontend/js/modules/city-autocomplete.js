/**
 * City Autocomplete Module
 * Handles city search and autocomplete in the hero section
 */

export function initCityAutocomplete() {
    let cities = [];
    const nextBtn = document.getElementById("step1Next");
    if (!nextBtn) return;
    
    nextBtn.disabled = true;

    fetch("/frontend/assets/data/cities.json")
        .then(res => res.json())
        .then(data => {
            cities = data.map(c => c.name.replace("Car Transport in ", ""));
            setupAutocomplete("fromCity", "fromCityDropdown", cities, nextBtn);
            setupAutocomplete("toCity", "toCityDropdown", cities, nextBtn);
        });
}

function isValidCity(value, cities) {
    return cities.some(city => city.toLowerCase() === value.toLowerCase());
}

function updateNextButton(cities, nextBtn) {
    const fromCity = document.getElementById("fromCity").value;
    const toCity = document.getElementById("toCity").value;
    nextBtn.disabled = !(isValidCity(fromCity, cities) && isValidCity(toCity, cities));
}

function setupAutocomplete(inputId, dropdownId, cities, nextBtn) {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);
    if (!input || !dropdown) return;

    input.addEventListener("input", () => {
        const value = input.value.toLowerCase();
        dropdown.innerHTML = "";

        if (!value) {
            updateNextButton(cities, nextBtn);
            return;
        }

        const matches = cities.filter(city => city.toLowerCase().startsWith(value));

        matches.forEach(city => {
            const div = document.createElement("div");
            div.textContent = city;
            div.addEventListener("mousedown", () => {
                input.value = city;
                dropdown.innerHTML = "";
                updateNextButton(cities, nextBtn);
            });
            dropdown.appendChild(div);
        });

        updateNextButton(cities, nextBtn);
    });

    input.addEventListener("blur", () => {
        if (input.value && !isValidCity(input.value, cities)) {
            input.value = "";
            alert("Service not available in this city");
        } else {
            updateNextButton(cities, nextBtn);
        }
    });
}

// Initialize on export or import
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCityAutocomplete);
} else {
    initCityAutocomplete();
}
