// Region Section Loader
document.addEventListener('DOMContentLoaded', function() {
  const regionContainer = document.getElementById('region-container');
  
  if (regionContainer) {
    // Determine the correct path based on current location
    const path = window.location.pathname;
    const isInPagesFolder = path.includes('/pages/');
    const base = isInPagesFolder ? '..' : '.';
    
    fetch(`${base}/components/region-section.html`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load region section');
        }
        return response.text();
      })
      .then(html => {
        regionContainer.innerHTML = html;
        
        // Fix paths for root pages
        if (!isInPagesFolder) {
          fixPathsForRootPage(regionContainer);
        }
        
        // Dispatch custom event to notify that region section is loaded
        const event = new CustomEvent('regionSectionLoaded');
        document.dispatchEvent(event);
      })
      .catch(error => {
        console.error('Error loading region section:', error);
        regionContainer.innerHTML = '<p style="text-align: center; padding: 40px;">Unable to load city listings. Please refresh the page.</p>';
      });
  }
  
  function fixPathsForRootPage(container) {
    // Fix link paths - convert ../pages/ to pages/ for root-level pages
    const links = container.querySelectorAll('a[href]');
    links.forEach(link => {
      const currentHref = link.getAttribute('href');
      if (currentHref && currentHref.startsWith('./pages/')) {
        link.setAttribute('href', currentHref.replace(/^\.\/pages\//, 'pages/'));
      }
    });
  }
});
