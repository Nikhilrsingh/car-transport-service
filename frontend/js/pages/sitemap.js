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
            noResultsMsg.innerHTML = `
                <div style="text-align: center; padding: 3rem; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.07);">
                    <i class="fas fa-search" style="font-size: 3rem; color: #dee2e6; margin-bottom: 1rem;"></i>
                    <h3 style="color: #6c757d; margin-bottom: 0.5rem;">No pages found</h3>
                    <p style="color: #adb5bd;">Try searching with different keywords</p>
                </div>
            `;
            document.querySelector('.sitemap-grid').after(noResultsMsg);
        }
        noResultsMsg.style.display = 'block';
    } else if (noResultsMsg) {
        noResultsMsg.style.display = 'none';
    }
}

// Intersection Observer for fade-in animations
function observeElements() {
    const options = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, options);
    
    // Observe all fade-in elements
    const fadeElements = document.querySelectorAll('.fade-in');
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
