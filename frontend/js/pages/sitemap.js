// Sitemap Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize search functionality
    initSitemapSearch();
    
    // Add fade-in animation on scroll
    observeElements();
});

// Search functionality
function initSitemapSearch() {
    const searchInput = document.getElementById('sitemapSearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            filterSitemap(searchTerm);
        });
    }
}

function filterSitemap(searchTerm) {
    const categories = document.querySelectorAll('.sitemap-category');
    let hasVisibleResults = false;
    
    categories.forEach(category => {
        const links = category.querySelectorAll('.sitemap-links li');
        let categoryHasVisibleLinks = false;
        
        links.forEach(link => {
            const linkText = link.textContent.toLowerCase();
            
            if (searchTerm === '' || linkText.includes(searchTerm)) {
                link.classList.remove('hidden');
                categoryHasVisibleLinks = true;
                hasVisibleResults = true;
            } else {
                link.classList.add('hidden');
            }
        });
        
        // Hide category if no links match
        if (categoryHasVisibleLinks) {
            category.classList.remove('hidden');
        } else {
            category.classList.add('hidden');
        }
    });
    
    // Show "no results" message if needed
    showNoResultsMessage(!hasVisibleResults && searchTerm !== '');
}

function showNoResultsMessage(show) {
    let noResultsMsg = document.querySelector('.no-results-message');
    
    if (show) {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results-message';

            const card = document.createElement('div');
            card.className = 'no-results-card';

            const icon = document.createElement('i');
            icon.className = 'fas fa-search no-results-icon';

            const title = document.createElement('h3');
            title.className = 'no-results-title';
            title.textContent = 'No pages found';

            const text = document.createElement('p');
            text.className = 'no-results-text';
            text.textContent = 'Try searching with different keywords';

            card.appendChild(icon);
            card.appendChild(title);
            card.appendChild(text);
            noResultsMsg.appendChild(card);

            const sitemapGrid = document.querySelector('.sitemap-grid');
            if (sitemapGrid && sitemapGrid.parentNode) {
                sitemapGrid.after(noResultsMsg);
            }
        }
        noResultsMsg.style.display = 'block';
    } else if (noResultsMsg) {
        noResultsMsg.style.display = 'none';
    }
}

// Intersection Observer for fade-in animations
function observeElements() {
    const fadeElements = document.querySelectorAll('.fade-in');

    // Fallback for browsers without IntersectionObserver support
    if (!('IntersectionObserver' in window)) {
        fadeElements.forEach(el => el.classList.add('visible'));
        return;
    }

    const options = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, options);

    // Observe all fade-in elements
    fadeElements.forEach(el => observer.observe(el));
}

// Smooth scroll for internal links
document.querySelectorAll('.sitemap-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        // Add a subtle click animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 100);
    });
});
