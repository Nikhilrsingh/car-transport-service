function updateClock() {
  const clockTime = document.getElementById('clock-time');
  const clockDate = document.getElementById('clock-date');
  
  if (clockTime && clockDate) {
    const now = new Date();
    
    const timeString = now.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    const dateString = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    clockTime.textContent = timeString;
    clockDate.textContent = dateString;
  }
}

// Start clock with a small delay to ensure elements are loaded
setTimeout(() => {
  updateClock();
  setInterval(updateClock, 1000);
}, 100);