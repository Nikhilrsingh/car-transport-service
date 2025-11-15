// How It Works Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initChecklistInteractivity();
    initScrollAnimations();
    initProgressTracking();
});

// Initialize checklist interactivity
function initChecklistInteractivity() {
    const checkboxes = document.querySelectorAll('.checklist-items input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateChecklistProgress();
            saveChecklistState();
        });
    });
    
    // Load saved checklist state
    loadChecklistState();
}

// Update checklist progress
function updateChecklistProgress() {
    const allCheckboxes = document.querySelectorAll('.checklist-items input[type="checkbox"]');
    const checkedBoxes = document.querySelectorAll('.checklist-items input[type="checkbox"]:checked');
    
    const progress = (checkedBoxes.length / allCheckboxes.length) * 100;
    
    // You can display this progress somewhere if needed
    console.log(`Checklist Progress: ${Math.round(progress)}%`);
}

// Save checklist state to localStorage
function saveChecklistState() {
    const checkboxes = document.querySelectorAll('.checklist-items input[type="checkbox"]');
    const state = {};
    
    checkboxes.forEach((checkbox, index) => {
        state[`check${index + 1}`] = checkbox.checked;
    });
    
    localStorage.setItem('vehiclePreparationChecklist', JSON.stringify(state));
}

// Load checklist state from localStorage
function loadChecklistState() {
    const savedState = localStorage.getItem('vehiclePreparationChecklist');
    
    if (savedState) {
        const state = JSON.parse(savedState);
        const checkboxes = document.querySelectorAll('.checklist-items input[type="checkbox"]');
        
        checkboxes.forEach((checkbox, index) => {
            const key = `check${index + 1}`;
            if (state[key] !== undefined) {
                checkbox.checked = state[key];
            }
        });
        
        updateChecklistProgress();
    }
}

// Initialize scroll animations for steps
function initScrollAnimations() {
    const stepItems = document.querySelectorAll('.step-item');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    stepItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'all 0.6s ease';
        observer.observe(item);
    });
}

// Track user progress through the process
function initProgressTracking() {
    const processSteps = document.querySelectorAll('.step-item');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stepNumber = entry.target.dataset.step;
                trackStepView(stepNumber);
            }
        });
    }, observerOptions);
    
    processSteps.forEach(step => {
        observer.observe(step);
    });
}

// Track which step the user is viewing
function trackStepView(stepNumber) {
    // You can send this data to analytics or use it for user engagement tracking
    console.log(`User viewing Step ${stepNumber}`);
    
    // Example: Update URL hash without scrolling
    // history.replaceState(null, null, `#step-${stepNumber}`);
}

// Reset checklist (optional function)
function resetChecklist() {
    const checkboxes = document.querySelectorAll('.checklist-items input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    localStorage.removeItem('vehiclePreparationChecklist');
    updateChecklistProgress();
}

// Print checklist functionality
function printChecklist() {
    window.print();
}

// Export checklist as text
function exportChecklist() {
    const checklistItems = document.querySelectorAll('.checklist-items li');
    let text = 'Vehicle Preparation Checklist\n\n';
    
    checklistItems.forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        const label = item.querySelector('label');
        const status = checkbox.checked ? '[✓]' : '[ ]';
        text += `${status} ${label.textContent}\n`;
    });
    
    // Create download link
    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vehicle-preparation-checklist.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Smooth scroll to specific step
function scrollToStep(stepNumber) {
    const step = document.querySelector(`[data-step="${stepNumber}"]`);
    if (step) {
        step.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// FAQ accordion functionality (if needed in future)
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const answer = item.querySelector('.faq-answer');
            const isOpen = answer.style.maxHeight;
            
            // Close all other FAQs
            document.querySelectorAll('.faq-answer').forEach(a => {
                a.style.maxHeight = null;
            });
            
            // Toggle current FAQ
            if (!isOpen) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
}

// Estimate delivery time based on distance
function estimateDeliveryTime(distance) {
    if (distance <= 300) {
        return '1-3 days';
    } else if (distance <= 1000) {
        return '3-5 days';
    } else if (distance <= 2000) {
        return '5-7 days';
    } else {
        return '7-10 days';
    }
}

// Show tooltip or additional info on hover
function initTooltips() {
    const features = document.querySelectorAll('.feature');
    
    features.forEach(feature => {
        feature.addEventListener('mouseenter', function() {
            // Add tooltip functionality if needed
        });
    });
}

// Track CTA button clicks
document.querySelectorAll('.step-btn, .primary-cta-btn, .secondary-cta-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const buttonText = this.textContent.trim();
        console.log(`CTA clicked: ${buttonText}`);
        // You can send this to analytics
    });
});

// Mobile menu highlight current step
function highlightCurrentStep() {
    const stepItems = document.querySelectorAll('.step-item');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        stepItems.forEach(step => {
            const stepTop = step.offsetTop;
            const scrollPosition = window.pageYOffset;
            
            if (scrollPosition >= stepTop - 200) {
                current = step.dataset.step;
            }
        });
        
        // You can use this to highlight navigation or progress indicator
        console.log(`Current step in view: ${current}`);
    });
}

// Initialize all features
function init() {
    initChecklistInteractivity();
    initScrollAnimations();
    initProgressTracking();
    highlightCurrentStep();
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export functions for external use
window.howItWorks = {
    resetChecklist,
    printChecklist,
    exportChecklist,
    scrollToStep,
    estimateDeliveryTime
};
