function updateClock() {
  const clockFull = document.getElementById('clock-full');

  if (clockFull) {
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
    clockFull.textContent = formatted;
  }
}

// Start clock
setTimeout(() => {
  updateClock();
  setInterval(updateClock, 1000);
}, 100);



// function updateClock() {
//   const clockTime = document.getElementById('clock-time');
//   const clockDate = document.getElementById('clock-date');
  
//   if (clockTime && clockDate) {
//     const now = new Date();
    
//     const timeString = now.toLocaleTimeString('en-US', {
//       hour12: true,
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit'
//     });
    
//     const dateString = now.toLocaleDateString('en-US', {
//       weekday: 'short',
//       day: 'numeric',
//       month: 'short',
//       year: 'numeric',
//     });
    
//     clockTime.textContent = timeString;
//     clockDate.textContent = dateString;
//   }
// }

// // Start clock with a small delay to ensure elements are loaded
// setTimeout(() => {
//   updateClock();
//   setInterval(updateClock, 1000);
// }, 100);