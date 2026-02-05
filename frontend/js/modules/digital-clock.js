function updateClock() {
  const now = new Date();

  const day = now.toLocaleDateString('en-US', { weekday: 'short' });
  const date = now.getDate();
  const month = now.toLocaleDateString('en-US', { month: 'short' });
  const time = now.toLocaleTimeString('en-US', {
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const formatted = `${day} ${date} ${month} ${time}`;

  // Update floating clock (legacy)
  const clockFull = document.getElementById('clock-full');
  if (clockFull) {
    clockFull.textContent = formatted;
  }

  // Update bottom bar clock
  const bottomBarClock = document.getElementById('bottomBarClock');
  if (bottomBarClock) {
    bottomBarClock.innerHTML = `
      <span class="clock-time">${time}</span>
      <span class="clock-date">${day} ${date} ${month}</span>
    `;
  }
}

// Start clock
setTimeout(() => {
  updateClock();
  setInterval(updateClock, 1000);
}, 100);

// Hide floating clock if bottom bar clock exists
document.addEventListener('DOMContentLoaded', () => {
  const macClock = document.getElementById('mac-clock');
  const bottomBarClock = document.getElementById('bottomBarClock');
  
  if (macClock && bottomBarClock) {
    macClock.style.display = 'none';
  }
});
