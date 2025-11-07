// Dummy tracking data
const trackingData = {
    'TRK12345': {
        vehicle: 'Toyota Innova Crysta',
        currentLocation: 'Nagpur, Maharashtra',
        status: 'In Transit',
        statusClass: 'status-in-transit',
        eta: '5 Nov 2025',
        distance: '320 km',
        route: 'Mumbai, MH → Nagpur, MH',
        mapUrl: 'https://www.google.com/maps?q=Mumbai+to+Nagpur&output=embed',
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
        eta: '4 Nov 2025',
        distance: '1,280 km',
        route: 'Hyderabad, TS → Kolkata, WB',
        mapUrl: 'https://www.google.com/maps?q=Hyderabad+to+Kolkata&output=embed',
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
        eta: 'Delivered',
        distance: '0 km',
        route: 'Pune, MH → Chennai, TN',
        mapUrl: 'https://www.google.com/maps?q=Pune+to+Chennai&output=embed',
        timeline: [
            { step: 1, title: 'Order Placed', description: 'Your vehicle transport order has been confirmed', time: '28 Oct 2025, 11:00 AM', completed: true },
            { step: 2, title: 'Vehicle Picked Up', description: 'Vehicle picked up from Pune, MH', time: '28 Oct 2025, 3:00 PM', completed: true },
            { step: 3, title: 'In Transit', description: 'Vehicle transported across states', time: '30 Oct 2025', completed: true },
            { step: 4, title: 'Out for Delivery', description: 'Final delivery in progress', time: '1 Nov 2025, 9:00 AM', completed: true },
            { step: 5, title: 'Delivered', description: 'Vehicle delivered to Chennai, TN', time: '1 Nov 2025, 2:30 PM', completed: true }
        ]
    }
};

// Set tracking ID from sample
function setTrackingId(id) {
    document.getElementById('trackingId').value = id;
    document.getElementById('trackingForm').dispatchEvent(new Event('submit'));
}

document.getElementById('trackingForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const trackingId = document.getElementById('trackingId').value.trim().toUpperCase();
    const data = trackingData[trackingId];

    if (data) {
        document.getElementById('trackingInfo').classList.add('active');
        document.getElementById('displayTrackingId').textContent = trackingId;
        document.getElementById('displayVehicle').textContent = data.vehicle;
        document.getElementById('displayLocation').textContent = data.currentLocation;

        const statusBadge = document.getElementById('displayStatus');
        statusBadge.textContent = data.status;
        statusBadge.className = 'status-badge ' + data.statusClass;

        document.getElementById('displayETA').textContent = data.eta;
        document.getElementById('displayDistance').textContent = data.distance;
        document.getElementById('routeDisplay').textContent = data.route;
        document.getElementById('mapFrame').src = data.mapUrl;

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
        document.getElementById('trackingInfo').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
        alert('❌ Tracking ID not found!\n\nPlease try one of these sample IDs:\n• TRK12345\n• TRK67890\n• TRK11111');
    }
});

function includeHTML(id, file) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', file, true);
    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            document.getElementById(id).innerHTML = this.responseText;
        }
    };
    xhr.send();
}
includeHTML('navbar-include', '../pages/navbar.html');
includeHTML('footer-include', '../pages/footer.html');

// Voice Search Integration with Tracking
document.addEventListener('DOMContentLoaded', function() {
    // Your existing tracking code...
    
    // Voice search auto-submit integration
    const trackingForm = document.getElementById('trackingForm');
    const trackingInput = document.getElementById('trackingId');
    
    // Auto-focus on input after voice search
    if (window.voiceSearch) {
        // Add event listener for successful voice input
        trackingInput.addEventListener('focus', function() {
            // Reset voice status when user manually focuses on input
            if (window.voiceSearch) {
                window.voiceSearch.resetVoiceStatus();
            }
        });
    }
    
    // Enhanced form submission with voice search feedback
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
        
        // Your existing tracking logic...
        const data = trackingData[trackingId];
        
        if (data) {
            // Your existing success handling...
            document.getElementById('trackingInfo').classList.add('active');
            document.getElementById('displayTrackingId').textContent = trackingId;
            document.getElementById('displayVehicle').textContent = data.vehicle;
            document.getElementById('displayLocation').textContent = data.currentLocation;

            const statusBadge = document.getElementById('displayStatus');
            statusBadge.textContent = data.status;
            statusBadge.className = 'status-badge ' + data.statusClass;

            document.getElementById('displayETA').textContent = data.eta;
            document.getElementById('displayDistance').textContent = data.distance;
            document.getElementById('routeDisplay').textContent = data.route;
            document.getElementById('mapFrame').src = data.mapUrl;

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
});