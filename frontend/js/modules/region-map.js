/**
 * Google Maps Network Map Logic
 */

function updateGoogleMap(location) {
    const mapFrame = document.getElementById('googleNetworkMap');
    const loadingOverlay = document.getElementById('mapLoading');
    if (!mapFrame) return;

    if (loadingOverlay) loadingOverlay.style.display = 'flex';

   
    const isDark = document.body.classList.contains('neon-theme') || 
                   document.body.getAttribute('data-theme') === 'dark';
    
    
    
    const searchUrl = `https://www.google.com/maps?q=${encodeURIComponent(location)}&t=${isDark ? 'k' : 'm'}&z=5&output=embed`;
    
    mapFrame.src = searchUrl;

    mapFrame.onload = () => {
        if (loadingOverlay) loadingOverlay.style.display = 'none';
    };
}

function initMapInteractions() {
    const legendItems = document.querySelectorAll('.legend-item');
    
    legendItems.forEach(item => {
        item.addEventListener('click', () => {
            
            let location = item.getAttribute('data-region') || item.textContent.trim();
            
            
            if (!location.toLowerCase().includes('india')) {
                location += ", India";
            }

            updateGoogleMap(location);
            
            legendItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });

    
    const observer = new MutationObserver(() => {
        const activeItem = document.querySelector('.legend-item.active');
        const location = activeItem ? activeItem.textContent.trim() : "India";
        updateGoogleMap(location);
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class', 'data-theme'] });
}


document.addEventListener('DOMContentLoaded', () => updateGoogleMap("India"));
document.addEventListener('regionSectionLoaded', initMapInteractions);