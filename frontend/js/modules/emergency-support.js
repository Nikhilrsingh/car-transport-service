// Emergency Support Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initEmergencyForm();
    initChatWidget();
    initEmergencyAnimations();
});

// Initialize Emergency Contact Form
function initEmergencyForm() {
    const form = document.getElementById('emergencyContactForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateEmergencyForm()) {
                return;
            }
            
            // Get form data
            const formData = new FormData(form);
            
            // Create emergency request object
            const emergencyRequest = {
                urgencyLevel: formData.get('urgencyLevel'),
                issueType: formData.get('issueType'),
                fullName: formData.get('fullName'),
                phoneNumber: formData.get('phoneNumber'),
                emailAddress: formData.get('emailAddress'),
                bookingId: formData.get('bookingId'),
                currentLocation: formData.get('currentLocation'),
                issueDescription: formData.get('issueDescription'),
                smsUpdates: formData.get('smsUpdates') === 'on',
                timestamp: new Date().toISOString(),
                requestId: generateRequestId()
            };
            
            // Log emergency request (in production, send to server)
            console.log('Emergency request submitted:', emergencyRequest);
            
            // Show success message with request ID
            showEmergencyNotification(
                `Emergency request submitted successfully!<br>
                <strong>Request ID: ${emergencyRequest.requestId}</strong><br>
                Our team will contact you within ${getResponseTime(emergencyRequest.urgencyLevel)}.`,
                'success'
            );
            
            // Reset form
            form.reset();
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// Validate Emergency Form
function validateEmergencyForm() {
    const urgencyLevel = document.getElementById('urgencyLevel').value;
    const issueType = document.getElementById('issueType').value;
    const fullName = document.getElementById('fullName').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const emailAddress = document.getElementById('emailAddress').value;
    const issueDescription = document.getElementById('issueDescription').value;
    
    // Check required fields
    if (!urgencyLevel || !issueType || !fullName || !phoneNumber || !emailAddress || !issueDescription) {
        showEmergencyNotification('Please fill in all required fields.', 'error');
        return false;
    }
    
    // Validate email
    if (!isValidEmail(emailAddress)) {
        showEmergencyNotification('Please enter a valid email address.', 'error');
        return false;
    }
    
    // Validate phone
    if (!isValidPhone(phoneNumber)) {
        showEmergencyNotification('Please enter a valid phone number.', 'error');
        return false;
    }
    
    // Check description length
    if (issueDescription.length < 20) {
        showEmergencyNotification('Please provide a more detailed description of the emergency (at least 20 characters).', 'error');
        return false;
    }
    
    return true;
}

// Generate unique request ID
function generateRequestId() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `EMG-${timestamp}-${random}`;
}

// Get response time based on urgency
function getResponseTime(urgencyLevel) {
    const responseTimes = {
        'critical': '15 minutes',
        'high': '1 hour',
        'medium': '4 hours',
        'low': '24 hours'
    };
    return responseTimes[urgencyLevel] || '2 hours';
}

// Live Chat Widget Functions
function initChatWidget() {
    const chatWidget = document.getElementById('liveChatWidget');
    
    // Add floating chat button if widget exists
    if (chatWidget) {
        createFloatingChatButton();
    }
}

function createFloatingChatButton() {
    const existingButton = document.querySelector('.floating-chat-trigger');
    if (existingButton) return;
    
    const button = document.createElement('button');
    button.className = 'floating-chat-trigger';
    button.innerHTML = '<i class="fas fa-comments"></i>';
    button.onclick = openLiveChat;
    
    button.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #004e89 0%, #ff6b35 100%);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 999;
        transition: all 0.3s ease;
    `;
    
    button.onmouseenter = function() {
        this.style.transform = 'scale(1.1)';
        this.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
    };
    
    button.onmouseleave = function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    };
    
    document.body.appendChild(button);
}

function openLiveChat() {
    const chatWidget = document.getElementById('liveChatWidget');
    if (chatWidget) {
        chatWidget.classList.add('active');
        
        // Simulate connection to agent
        setTimeout(() => {
            const messageEl = chatWidget.querySelector('.chat-widget-message');
            if (messageEl) {
                messageEl.innerHTML = `
                    <div style="text-align: left; color: #333;">
                        <p><strong>Agent Sarah:</strong> Hello! I'm here to help with your emergency. How can I assist you today?</p>
                        <textarea placeholder="Type your message..." style="width: 100%; padding: 0.75rem; border: 2px solid #ddd; border-radius: 8px; margin-top: 1rem; min-height: 80px;"></textarea>
                        <button onclick="sendChatMessage()" style="width: 100%; padding: 0.75rem; background: #ff6b35; color: white; border: none; border-radius: 8px; margin-top: 0.5rem; cursor: pointer; font-weight: 600;">Send Message</button>
                    </div>
                `;
            }
        }, 1500);
    }
}

function closeLiveChat() {
    const chatWidget = document.getElementById('liveChatWidget');
    if (chatWidget) {
        chatWidget.classList.remove('active');
    }
}

function sendChatMessage() {
    showEmergencyNotification('Chat feature is currently in demo mode. Please call our emergency hotline for immediate assistance.', 'info');
}

// Emergency Notification System
function showEmergencyNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `emergency-notification emergency-notification-${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };
    
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        info: '#2563eb',
        warning: '#ffc107'
    };
    
    notification.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 1.25rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        z-index: 10000;
        animation: slideInRight 0.4s ease;
        max-width: 450px;
        font-weight: 500;
        line-height: 1.5;
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
        font-size: 1.2rem;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 7 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s ease';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 400);
    }, 7000);
}

// Emergency Animations
function initEmergencyAnimations() {
    // Pulse animation for emergency badges
    const emergencyBadges = document.querySelectorAll('.emergency-badge, .hours-badge');
    emergencyBadges.forEach(badge => {
        badge.style.animation = 'pulse 2s infinite';
    });
    
    // Highlight critical hotline card
    const urgentCard = document.querySelector('.hotline-card.urgent');
    if (urgentCard) {
        setInterval(() => {
            urgentCard.style.borderColor = urgentCard.style.borderColor === 'rgb(220, 53, 69)' ? '#ff6b35' : '#dc3545';
        }, 1000);
    }
}

// Validation Helper Functions
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// Emergency Hotline Click Tracking
document.querySelectorAll('.hotline-btn, .emergency-call-btn, .sidebar-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const phoneNumber = this.textContent.trim();
        console.log('Emergency call initiated:', phoneNumber);
        
        // Track emergency call (analytics)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'emergency_call', {
                'event_category': 'emergency',
                'event_label': phoneNumber
            });
        }
    });
});

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
    
    @keyframes pulse {
        0%, 100% {
            opacity: 1;
            transform: scale(1);
        }
        50% {
            opacity: 0.8;
            transform: scale(1.02);
        }
    }
`;
document.head.appendChild(style);

// Urgency Level Auto-suggestion
const urgencySelect = document.getElementById('urgencyLevel');
const issueTypeSelect = document.getElementById('issueType');

if (issueTypeSelect && urgencySelect) {
    issueTypeSelect.addEventListener('change', function() {
        const issueType = this.value;
        
        // Auto-suggest urgency based on issue type
        const urgencySuggestions = {
            'accident': 'critical',
            'breakdown': 'high',
            'damage': 'high',
            'lost': 'critical',
            'delay': 'medium'
        };
        
        if (urgencySuggestions[issueType] && !urgencySelect.value) {
            urgencySelect.value = urgencySuggestions[issueType];
            urgencySelect.style.borderColor = '#ffc107';
            
            setTimeout(() => {
                urgencySelect.style.borderColor = '';
            }, 2000);
        }
    });
}

// Export functions for global access
window.openLiveChat = openLiveChat;
window.closeLiveChat = closeLiveChat;
window.sendChatMessage = sendChatMessage;
window.showEmergencyNotification = showEmergencyNotification;

console.log('Emergency Support page loaded successfully');
