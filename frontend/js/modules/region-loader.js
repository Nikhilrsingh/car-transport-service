// Region Section Loader
document.addEventListener('DOMContentLoaded', function() {
  const regionContainer = document.getElementById('region-container');
  
  if (regionContainer) {
    fetch('./components/region-section.html')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load region section');
        }
        return response.text();
      })
      .then(html => {
        regionContainer.innerHTML = html;
        
        // Dispatch custom event to notify that region section is loaded
        const event = new CustomEvent('regionSectionLoaded');
        document.dispatchEvent(event);
      })
      .catch(error => {
        console.error('Error loading region section:', error);
        regionContainer.innerHTML = '<p style="text-align: center; padding: 40px;">Unable to load city listings. Please refresh the page.</p>';
      });
  }
});
