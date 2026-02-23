// Region Section Loader
document.addEventListener('DOMContentLoaded', function () {
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

        // Fix all paths (links and images)
        fixSectionPaths(regionContainer, isInPagesFolder);

        // Dispatch custom event to notify that region section is loaded
        const event = new CustomEvent('regionSectionLoaded');
        document.dispatchEvent(event);
      })
      .catch(error => {
        console.error('Error loading region section:', error);
        regionContainer.innerHTML = '<p style="text-align: center; padding: 40px;">Unable to load city listings. Please refresh the page.</p>';
      });
  }

  function fixSectionPaths(container, isInPagesFolder) {
    // 1. Fix Link Paths (a[href])
    const links = container.querySelectorAll('a[href]');
    links.forEach(link => {
      let href = link.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('#')) return;

      // Normalize: remove starting ./ or /
      let normalizedHref = href.replace(/^\.?\//, '');

      if (isInPagesFolder) {
        // In /pages/, links to other pages (like city.html) should be direct
        if (normalizedHref.startsWith('pages/')) {
          link.setAttribute('href', normalizedHref.replace('pages/', ''));
        }
      } else {
        // On root, make sure it points to pages/
        if (!normalizedHref.startsWith('pages/') && normalizedHref.endsWith('.html')) {
          link.setAttribute('href', 'pages/' + normalizedHref);
        }
      }
    });

    // 2. Fix Image Paths (img[src])
    const images = container.querySelectorAll('img[src]');
    images.forEach(img => {
      let src = img.getAttribute('src');
      if (!src || src.startsWith('data:') || src.startsWith('http')) return;

      // Normalize: remove starting ./ or /
      let normalizedSrc = src.replace(/^\.?\//, '');

      if (isInPagesFolder) {
        // In /pages/, assets are at ../assets/
        if (normalizedSrc.startsWith('assets/')) {
          img.setAttribute('src', '../' + normalizedSrc);
        }
      } else {
        // On homepage, assets/ is correct relative path
        if (normalizedSrc.startsWith('assets/')) {
          img.setAttribute('src', './' + normalizedSrc);
        }
      }
    });
  }
});
