// Dummy tracking data with enhanced features
const trackingData = {
    'TRK12345': {
        vehicle: 'Toyota Innova Crysta',
        currentLocation: 'Nagpur, Maharashtra',
        status: 'In Transit',
        statusClass: 'status-in-transit',
        eta: '2025-11-15T18:00:00', // ISO format for countdown
        etaDisplay: '15 Nov 2025, 6:00 PM',
        distance: '320 km',
        route: 'Mumbai, MH → Nagpur, MH',
        mapUrl: 'https://www.google.com/maps?q=Mumbai+to+Nagpur&output=embed',
        driver: {
            name: 'Rajesh Kumar',
            phone: '+91 98765 43210',
            license: 'MH-12-2023-0045678',
            rating: 4.8,
            vehicleNumber: 'MH-12-AB-1234'
        },
        timeline: [
            { step: 1, title: 'Order Placed', description: 'Your vehicle transport order has been confirmed', time: '1 Nov 2025, 10:00 AM', completed: true },
            { step: 2, title: 'Vehicle Picked Up', description: 'Vehicle picked up from Mumbai, MH', time: '1 Nov 2025, 2:00 PM', completed: true },
            { step: 3, title: 'In Transit', description: 'Currently in Nagpur, MH', time: '3 Nov 2025, 11:30 AM', completed: true },
            { step: 4, title: 'Out for Delivery', description: 'Vehicle will be delivered soon', time: 'Pending', completed: false },
            { step: 5, title: 'Delivered', description: 'Vehicle to be delivered to Nagpur, MH', time: 'Pending', completed: false }
        ]
    },
    'TRK67890': {
        vehicle: 'Honda City',
        currentLocation: 'Hyderabad, Telangana',
        status: 'Awaiting Pickup',
        statusClass: 'status-pickup',
        eta: '2025-11-14T14:00:00',
        etaDisplay: '14 Nov 2025, 2:00 PM',
        distance: '1,280 km',
        route: 'Hyderabad, TS → Kolkata, WB',
        mapUrl: 'https://www.google.com/maps?q=Hyderabad+to+Kolkata&output=embed',
        driver: {
            name: 'Amit Sharma',
            phone: '+91 98765 43211',
            license: 'TS-09-2022-0034567',
            rating: 4.6,
            vehicleNumber: 'TS-09-CD-5678'
        },
        timeline: [
            { step: 1, title: 'Order Placed', description: 'Your vehicle transport order has been confirmed', time: '2 Nov 2025, 9:00 AM', completed: true },
            { step: 2, title: 'Awaiting Pickup', description: 'Driver assigned, pickup scheduled', time: '3 Nov 2025, 8:00 AM', completed: false },
            { step: 3, title: 'In Transit', description: 'Vehicle on the way', time: 'Pending', completed: false },
            { step: 4, title: 'Out for Delivery', description: 'Vehicle will be delivered soon', time: 'Pending', completed: false },
            { step: 5, title: 'Delivered', description: 'Vehicle to be delivered to Kolkata, WB', time: 'Pending', completed: false }
        ]
    },
    'TRK11111': {
        vehicle: 'Tata Harrier',
        currentLocation: 'Chennai, Tamil Nadu',
        status: 'Delivered',
        statusClass: 'status-delivered',
        eta: '2025-11-01T14:30:00',
        etaDisplay: 'Delivered',
        distance: '0 km',
        route: 'Pune, MH → Chennai, TN',
        mapUrl: 'https://www.google.com/maps?q=Pune+to+Chennai&output=embed',
        driver: {
            name: 'Suresh Patil',
            phone: '+91 98765 43212',
            license: 'MH-14-2021-0012345',
            rating: 4.9,
            vehicleNumber: 'MH-14-EF-9012'
        },
        deliveryProof: {
            signature: 'Available',
            photo: 'Available',
            timestamp: '1 Nov 2025, 2:30 PM',
            receivedBy: 'John Doe'
        },
        timeline: [
            { step: 1, title: 'Order Placed', description: 'Your vehicle transport order has been confirmed', time: '28 Oct 2025, 11:00 AM', completed: true },
            { step: 2, title: 'Vehicle Picked Up', description: 'Vehicle picked up from Pune, MH', time: '28 Oct 2025, 3:00 PM', completed: true },
            { step: 3, title: 'In Transit', description: 'Vehicle transported across states', time: '30 Oct 2025', completed: true },
            { step: 4, title: 'Out for Delivery', description: 'Final delivery in progress', time: '1 Nov 2025, 9:00 AM', completed: true },
            { step: 5, title: 'Delivered', description: 'Vehicle delivered to Chennai, TN', time: '1 Nov 2025, 2:30 PM', completed: true }
        ]
    }
};

// Live update simulation
let updateInterval = null;
let currentTrackingId = null;

function startLiveUpdates(trackingId) {
    stopLiveUpdates();
    currentTrackingId = trackingId;
    
    // Simulate updates every 30 seconds
    updateInterval = setInterval(() => {
        simulateStatusUpdate(trackingId);
    }, 30000);
}

function stopLiveUpdates() {
    if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
    }
}

function simulateStatusUpdate(trackingId) {
    const data = trackingData[trackingId];
    if (!data || data.status === 'Delivered') return;
    
    // Simulate random distance decrease
    const currentDistance = parseInt(data.distance);
    if (currentDistance > 0) {
        const newDistance = Math.max(0, currentDistance - Math.floor(Math.random() * 20 + 10));
        data.distance = newDistance + ' km';
        document.getElementById('displayDistance').textContent = data.distance;
        
        // Show live update notification
        showLiveUpdateNotification('Location updated');
    }
}

function showLiveUpdateNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'live-update-notification';
    notification.innerHTML = `<i class="fas fa-sync-alt"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ETA Countdown Timer
function startCountdown(etaDate, elementId) {
    const countdownElement = document.getElementById(elementId);
    if (!countdownElement) return;
    
    function updateCountdown() {
        const now = new Date().getTime();
        const eta = new Date(etaDate).getTime();
        const distance = eta - now;
        
        if (distance < 0) {
            countdownElement.innerHTML = '<span class="countdown-expired">ETA Passed</span>';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        countdownElement.innerHTML = `
            <div class="countdown-timer">
                <div class="countdown-item">
                    <span class="countdown-value">${days}</span>
                    <span class="countdown-label">Days</span>
                </div>
                <div class="countdown-separator">:</div>
                <div class="countdown-item">
                    <span class="countdown-value">${hours.toString().padStart(2, '0')}</span>
                    <span class="countdown-label">Hours</span>
                </div>
                <div class="countdown-separator">:</div>
                <div class="countdown-item">
                    <span class="countdown-value">${minutes.toString().padStart(2, '0')}</span>
                    <span class="countdown-label">Minutes</span>
                </div>
                <div class="countdown-separator">:</div>
                <div class="countdown-item">
                    <span class="countdown-value">${seconds.toString().padStart(2, '0')}</span>
                    <span class="countdown-label">Seconds</span>
                </div>
            </div>
        `;
    }
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    // Store interval for cleanup
    countdownElement.dataset.interval = interval;
}

// Driver Contact Card
function displayDriverCard(driverData) {
    const driverCard = document.getElementById('driverCard');
    if (!driverCard || !driverData) return;
    
    const stars = '★'.repeat(Math.floor(driverData.rating)) + '☆'.repeat(5 - Math.floor(driverData.rating));
    
    driverCard.innerHTML = `
        <div class="driver-header">
            <div class="driver-avatar">
                <i class="fas fa-user-circle"></i>
            </div>
            <div class="driver-info">
                <h3>${driverData.name}</h3>
                <div class="driver-rating">
                    <span class="stars">${stars}</span>
                    <span class="rating-value">${driverData.rating}</span>
                </div>
            </div>
        </div>
        <div class="driver-details">
            <div class="driver-detail-item">
                <i class="fas fa-id-card"></i>
                <span>License: ${driverData.license}</span>
            </div>
            <div class="driver-detail-item">
                <i class="fas fa-truck"></i>
                <span>Vehicle: ${driverData.vehicleNumber}</span>
            </div>
        </div>
        <div class="driver-actions">
            <a href="tel:${driverData.phone}" class="driver-action-btn call-btn">
                <i class="fas fa-phone"></i>
                Call Driver
            </a>
            <a href="sms:${driverData.phone}" class="driver-action-btn sms-btn">
                <i class="fas fa-sms"></i>
                Send SMS
            </a>
        </div>
    `;
    
    driverCard.style.display = 'block';
}

// Notification Preferences
function initNotificationPreferences() {
    const notificationForm = document.getElementById('notificationPreferences');
    if (!notificationForm) return;
    
    notificationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const preferences = {
            sms: document.getElementById('smsNotifications').checked,
            email: document.getElementById('emailNotifications').checked,
            pickup: document.getElementById('notifyPickup').checked,
            transit: document.getElementById('notifyTransit').checked,
            delivery: document.getElementById('notifyDelivery').checked,
            phone: document.getElementById('notificationPhone').value,
            email: document.getElementById('notificationEmail').value
        };
        
        // Save preferences (in real app, this would be an API call)
        localStorage.setItem('trackingNotificationPrefs', JSON.stringify(preferences));
        
        // Show success message
        showNotificationSuccess();
    });
    
    // Load saved preferences
    const saved = localStorage.getItem('trackingNotificationPrefs');
    if (saved) {
        const prefs = JSON.parse(saved);
        document.getElementById('smsNotifications').checked = prefs.sms || false;
        document.getElementById('emailNotifications').checked = prefs.email || false;
        document.getElementById('notifyPickup').checked = prefs.pickup || false;
        document.getElementById('notifyTransit').checked = prefs.transit || false;
        document.getElementById('notifyDelivery').checked = prefs.delivery || false;
        if (prefs.phone) document.getElementById('notificationPhone').value = prefs.phone;
        if (prefs.email) document.getElementById('notificationEmail').value = prefs.email;
    }
}

function showNotificationSuccess() {
    const message = document.createElement('div');
    message.className = 'notification-success';
    message.innerHTML = '<i class="fas fa-check-circle"></i> Notification preferences saved successfully!';
    document.body.appendChild(message);
    
    setTimeout(() => message.classList.add('show'), 100);
    setTimeout(() => {
        message.classList.remove('show');
        setTimeout(() => message.remove(), 300);
    }, 3000);
}

// Delivery Proof Upload
function initDeliveryProofUpload() {
    const uploadForm = document.getElementById('deliveryProofForm');
    if (!uploadForm) return;
    
    const photoInput = document.getElementById('deliveryPhoto');
    const signatureInput = document.getElementById('deliverySignature');
    const photoPreview = document.getElementById('photoPreview');
    const signaturePreview = document.getElementById('signaturePreview');
    
    photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                photoPreview.innerHTML = `<img src="${event.target.result}" alt="Delivery Photo">`;
                photoPreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
    
    signatureInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                signaturePreview.innerHTML = `<img src="${event.target.result}" alt="Signature">`;
                signaturePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
    
    uploadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(uploadForm);
        
        // Simulate upload (in real app, this would be an API call)
        showUploadProgress();
        
        setTimeout(() => {
            showUploadSuccess();
            uploadForm.reset();
            photoPreview.style.display = 'none';
            signaturePreview.style.display = 'none';
        }, 2000);
    });
}

function showUploadProgress() {
    const progress = document.createElement('div');
    progress.className = 'upload-progress';
    progress.innerHTML = `
        <div class="progress-content">
            <i class="fas fa-spinner fa-spin"></i>
            <span>Uploading delivery proof...</span>
        </div>
    `;
    document.body.appendChild(progress);
    setTimeout(() => progress.classList.add('show'), 100);
    
    setTimeout(() => {
        progress.classList.remove('show');
        setTimeout(() => progress.remove(), 300);
    }, 2000);
}

function showUploadSuccess() {
    const success = document.createElement('div');
    success.className = 'upload-success';
    success.innerHTML = '<i class="fas fa-check-circle"></i> Delivery proof uploaded successfully!';
    document.body.appendChild(success);
    
    setTimeout(() => success.classList.add('show'), 100);
    setTimeout(() => {
        success.classList.remove('show');
        setTimeout(() => success.remove(), 300);
    }, 3000);
}

function displayDeliveryProof(proofData) {
    const proofSection = document.getElementById('deliveryProofSection');
    if (!proofSection || !proofData) return;
    
    proofSection.innerHTML = `
        <h3><i class="fas fa-certificate"></i> Delivery Proof</h3>
        <div class="proof-grid">
            <div class="proof-item">
                <i class="fas fa-camera"></i>
                <span>Photo: ${proofData.photo}</span>
            </div>
            <div class="proof-item">
                <i class="fas fa-signature"></i>
                <span>Signature: ${proofData.signature}</span>
            </div>
            <div class="proof-item">
                <i class="fas fa-user"></i>
                <span>Received By: ${proofData.receivedBy}</span>
            </div>
            <div class="proof-item">
                <i class="fas fa-clock"></i>
                <span>Time: ${proofData.timestamp}</span>
            </div>
        </div>
    `;
    
    proofSection.style.display = 'block';
}

// Set tracking ID from sample
function setTrackingId(id) {
    document.getElementById('trackingId').value = id;
    document.getElementById('trackingForm').dispatchEvent(new Event('submit'));
}

const trackingForm = document.getElementById('trackingForm');
if (trackingForm) {
    trackingForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const trackingId = document.getElementById('trackingId').value.trim().toUpperCase();
    const data = trackingData[trackingId];

    if (data) {
        // Stop any existing live updates
        stopLiveUpdates();
        
        document.getElementById('trackingInfo').classList.add('active');
        document.getElementById('displayTrackingId').textContent = trackingId;
        document.getElementById('displayVehicle').textContent = data.vehicle;
        document.getElementById('displayLocation').textContent = data.currentLocation;

        const statusBadge = document.getElementById('displayStatus');
        statusBadge.textContent = data.status;
        statusBadge.className = 'status-badge ' + data.statusClass;

        document.getElementById('displayETA').textContent = data.etaDisplay;
        document.getElementById('displayDistance').textContent = data.distance;
        document.getElementById('routeDisplay').textContent = data.route;
        document.getElementById('mapFrame').src = data.mapUrl;

        // Start ETA countdown timer if not delivered
        if (data.status !== 'Delivered') {
            startCountdown(data.eta, 'etaCountdown');
            document.getElementById('etaCountdownSection').style.display = 'block';
        } else {
            document.getElementById('etaCountdownSection').style.display = 'none';
        }

        // Display driver card if in transit
        if (data.status === 'In Transit' || data.status === 'Awaiting Pickup') {
            displayDriverCard(data.driver);
        } else {
            const driverCard = document.getElementById('driverCard');
            if (driverCard) driverCard.style.display = 'none';
        }

        // Display delivery proof if delivered
        if (data.status === 'Delivered' && data.deliveryProof) {
            displayDeliveryProof(data.deliveryProof);
        } else {
            const proofSection = document.getElementById('deliveryProofSection');
            if (proofSection) proofSection.style.display = 'none';
        }

        // Build timeline
        const timeline = document.getElementById('timeline');
        const timelineContent = document.getElementById('timelineContent');
        timelineContent.innerHTML = '';

        data.timeline.forEach(item => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            timelineItem.innerHTML = `
                <div class="timeline-dot ${item.completed ? 'completed' : ''}">${item.step}</div>
                <div class="timeline-content">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                    <div class="time"><i class="fas fa-clock"></i> ${item.time}</div>
                </div>
            `;
            timelineContent.appendChild(timelineItem);
        });

        timeline.style.display = 'block';
        
        // Start live updates simulation
        if (data.status !== 'Delivered') {
            startLiveUpdates(trackingId);
        }
        
        document.getElementById('trackingInfo').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
        alert('❌ Tracking ID not found!\n\nPlease try one of these sample IDs:\n• TRK12345\n• TRK67890\n• TRK11111');
    }
    });
}

function includeHTML(id, file) {
    const element = document.getElementById(id);
    if (element) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', file, true);
        xhr.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                element.innerHTML = this.responseText;
            }
        };
        xhr.send();
    }
}
if (document.getElementById('navbar-include')) {
    includeHTML('navbar-include', '../pages/navbar.html');
}
if (document.getElementById('footer-include')) {
    includeHTML('footer-include', '../pages/footer.html');
}

// Voice Search Integration with Tracking
document.addEventListener('DOMContentLoaded', function() {
    // Initialize notification preferences
    initNotificationPreferences();
    
    // Initialize delivery proof upload
    initDeliveryProofUpload();
    
    // Voice search auto-submit integration
    const trackingForm = document.getElementById('trackingForm');
    const trackingInput = document.getElementById('trackingId');
    
    // Auto-focus on input after voice search
    if (window.voiceSearch && trackingInput) {
        // Add event listener for successful voice input
        trackingInput.addEventListener('focus', function() {
            // Reset voice status when user manually focuses on input
            if (window.voiceSearch) {
                window.voiceSearch.resetVoiceStatus();
            }
        });
    }
    
    // Enhanced form submission with voice search feedback
    if (trackingForm) {
        trackingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const trackingId = trackingInput.value.trim().toUpperCase();
        
        // If voice search was used recently, show visual feedback
        if (window.voiceSearch && window.voiceSearch.lastVoiceInput === trackingId) {
            // Add visual feedback for voice-initiated search
            const submitBtn = trackingForm.querySelector('.btn-track');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-microphone"></i> Searching...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        }
        
        const data = trackingData[trackingId];
        
        if (data) {
            // Stop any existing live updates
            stopLiveUpdates();
            
            document.getElementById('trackingInfo').classList.add('active');
            document.getElementById('displayTrackingId').textContent = trackingId;
            document.getElementById('displayVehicle').textContent = data.vehicle;
            document.getElementById('displayLocation').textContent = data.currentLocation;

            const statusBadge = document.getElementById('displayStatus');
            statusBadge.textContent = data.status;
            statusBadge.className = 'status-badge ' + data.statusClass;

            document.getElementById('displayETA').textContent = data.etaDisplay;
            document.getElementById('displayDistance').textContent = data.distance;
            document.getElementById('routeDisplay').textContent = data.route;
            document.getElementById('mapFrame').src = data.mapUrl;

            // Start ETA countdown timer if not delivered
            if (data.status !== 'Delivered') {
                startCountdown(data.eta, 'etaCountdown');
                document.getElementById('etaCountdownSection').style.display = 'block';
            } else {
                document.getElementById('etaCountdownSection').style.display = 'none';
            }

            // Display driver card if in transit
            if (data.status === 'In Transit' || data.status === 'Awaiting Pickup') {
                displayDriverCard(data.driver);
            } else {
                const driverCard = document.getElementById('driverCard');
                if (driverCard) driverCard.style.display = 'none';
            }

            // Display delivery proof if delivered
            if (data.status === 'Delivered' && data.deliveryProof) {
                displayDeliveryProof(data.deliveryProof);
            } else {
                const proofSection = document.getElementById('deliveryProofSection');
                if (proofSection) proofSection.style.display = 'none';
            }

            const timeline = document.getElementById('timeline');
            const timelineContent = document.getElementById('timelineContent');
            timelineContent.innerHTML = '';

            data.timeline.forEach(item => {
                const timelineItem = document.createElement('div');
                timelineItem.className = 'timeline-item';
                timelineItem.innerHTML = `
                    <div class="timeline-dot ${item.completed ? 'completed' : ''}">${item.step}</div>
                    <div class="timeline-content">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                        <div class="time"><i class="fas fa-clock"></i> ${item.time}</div>
                    </div>
                `;
                timelineContent.appendChild(timelineItem);
            });

            timeline.style.display = 'block';
            
            // Start live updates simulation
            if (data.status !== 'Delivered') {
                startLiveUpdates(trackingId);
            }
            
            document.getElementById('trackingInfo').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            // Enhanced error message for voice search
            let errorMessage = '❌ Tracking ID not found!';
            if (window.voiceSearch && window.voiceSearch.lastVoiceInput === trackingId) {
                errorMessage += '\n\nVoice input detected. Please check if the tracking ID was recognized correctly.';
            }
            errorMessage += '\n\nPlease try one of these sample IDs:\n• TRK12345\n• TRK67890\n• TRK11111';
            
            alert(errorMessage);
        }
        });
    }
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        stopLiveUpdates();
    });
});