// Careers Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initJobFilters();
    initApplicationForm();
    initFranchiseForm();
});

// Job Filter Functionality
function initJobFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const jobCards = document.querySelectorAll('.job-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get selected category
            const category = this.getAttribute('data-category');
            
            // Filter job cards
            jobCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Application Modal Functions
function openApplicationModal(position) {
    const modal = document.getElementById('applicationModal');
    const positionName = document.getElementById('positionName');
    
    positionName.textContent = position;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeApplicationModal() {
    const modal = document.getElementById('applicationModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Reset form
    document.getElementById('applicationForm').reset();
}

// Franchise Modal Functions
function openFranchiseModal() {
    const modal = document.getElementById('franchiseModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeFranchiseModal() {
    const modal = document.getElementById('franchiseModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Reset form
    document.getElementById('franchiseForm').reset();
}

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    const applicationModal = document.getElementById('applicationModal');
    const franchiseModal = document.getElementById('franchiseModal');
    
    if (event.target === applicationModal) {
        closeApplicationModal();
    }
    
    if (event.target === franchiseModal) {
        closeFranchiseModal();
    }
});

// Close modals with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeApplicationModal();
        closeFranchiseModal();
    }
});

// Application Form Submission
function initApplicationForm() {
    const form = document.getElementById('applicationForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateApplicationForm()) {
            return;
        }
        
        // Get form data
        const formData = new FormData(form);
        const position = document.getElementById('positionName').textContent;
        
        // Create data object
        const applicationData = {
            position: position,
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            city: formData.get('city'),
            state: formData.get('state'),
            zip: formData.get('zip'),
            experience: formData.get('experience'),
            availability: formData.get('availability'),
            coverLetter: formData.get('coverLetter'),
            references: formData.get('references'),
            authorized: formData.get('authorized') === 'on',
            consent: formData.get('consent') === 'on',
            submittedAt: new Date().toISOString()
        };
        
        // Log application data (in production, send to server)
        console.log('Application submitted:', applicationData);
        
        // Show success message
        showSuccessMessage('Application submitted successfully! We will review your application and contact you soon.');
        
        // Close modal and reset form
        closeApplicationModal();
    });
}

// Franchise Form Submission
function initFranchiseForm() {
    const form = document.getElementById('franchiseForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateFranchiseForm()) {
            return;
        }
        
        // Get form data
        const formData = new FormData(form);
        
        // Create data object
        const franchiseData = {
            firstName: formData.get('franchiseFirstName'),
            lastName: formData.get('franchiseLastName'),
            email: formData.get('franchiseEmail'),
            phone: formData.get('franchisePhone'),
            targetLocation: formData.get('targetLocation'),
            investment: formData.get('investment'),
            businessExperience: formData.get('businessExperience'),
            timeline: formData.get('timeline'),
            additionalInfo: formData.get('additionalInfo'),
            submittedAt: new Date().toISOString()
        };
        
        // Log franchise data (in production, send to server)
        console.log('Franchise inquiry submitted:', franchiseData);
        
        // Show success message
        showSuccessMessage('Thank you for your interest! Our franchise team will contact you within 2 business days.');
        
        // Close modal and reset form
        closeFranchiseModal();
    });
}

// Form Validation Functions
function validateApplicationForm() {
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const resume = document.getElementById('resume').files[0];
    const authorized = document.getElementById('authorized').checked;
    const consent = document.getElementById('consent').checked;
    
    // Email validation
    if (!isValidEmail(email)) {
        showError('Please enter a valid email address.');
        return false;
    }
    
    // Phone validation
    if (!isValidPhone(phone)) {
        showError('Please enter a valid phone number.');
        return false;
    }
    
    // Resume validation
    if (resume) {
        const fileSize = resume.size / 1024 / 1024; // Convert to MB
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        
        if (fileSize > 5) {
            showError('Resume file size must be less than 5MB.');
            return false;
        }
        
        if (!allowedTypes.includes(resume.type)) {
            showError('Resume must be in PDF, DOC, or DOCX format.');
            return false;
        }
    }
    
    // Checkbox validation
    if (!authorized) {
        showError('You must confirm that you are authorized to work in the United States.');
        return false;
    }
    
    if (!consent) {
        showError('You must consent to a background check and drug screening.');
        return false;
    }
    
    return true;
}

function validateFranchiseForm() {
    const email = document.getElementById('franchiseEmail').value;
    const phone = document.getElementById('franchisePhone').value;
    
    // Email validation
    if (!isValidEmail(email)) {
        showError('Please enter a valid email address.');
        return false;
    }
    
    // Phone validation
    if (!isValidPhone(phone)) {
        showError('Please enter a valid phone number.');
        return false;
    }
    
    return true;
}

// Validation Helper Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// Message Functions
function showError(message) {
    alert('Error: ' + message);
}

function showSuccessMessage(message) {
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 20px 30px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        gap: 15px;
        z-index: 10000;
        animation: slideInRight 0.5s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 5000);
}

// Smooth Scroll for CTA Button
document.querySelector('.cta-button')?.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
});

// Animate elements on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.benefit-card, .job-card, .training-card, .culture-card, .testimonial-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(element => {
        element.style.opacity = '0';
        observer.observe(element);
    });
}

// Initialize animations
animateOnScroll();

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Make functions globally available
window.openApplicationModal = openApplicationModal;
window.closeApplicationModal = closeApplicationModal;
window.openFranchiseModal = openFranchiseModal;
window.closeFranchiseModal = closeFranchiseModal;
