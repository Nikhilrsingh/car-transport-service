// ===============================
// SAMPLE DATA (Replace with API later)
// ===============================
const sampleBookings = [
  { id: 'BK001', customer: 'John Doe', pickup: 'New York, NY', delivery: 'Los Angeles, CA', date: '2026-01-15', status: 'pending', price: '$1,200' },
  { id: 'BK002', customer: 'Jane Smith', pickup: 'Chicago, IL', delivery: 'Miami, FL', date: '2026-01-14', status: 'completed', price: '$950' },
  { id: 'BK003', customer: 'Mike Johnson', pickup: 'Houston, TX', delivery: 'Seattle, WA', date: '2026-01-13', status: 'pending', price: '$1,450' },
  { id: 'BK004', customer: 'Sarah Williams', pickup: 'Boston, MA', delivery: 'Denver, CO', date: '2026-01-12', status: 'completed', price: '$1,100' },
  { id: 'BK005', customer: 'Tom Brown', pickup: 'Phoenix, AZ', delivery: 'Atlanta, GA', date: '2026-01-11', status: 'cancelled', price: '$1,300' }
];

// ===============================
// SIDEBAR TOGGLE
// ===============================
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');
const menuToggle = document.getElementById('menuToggle');

menuToggle.addEventListener('click', () => {
  if (window.innerWidth <= 1024) {
    sidebar.classList.toggle('visible');
  } else {
    sidebar.classList.toggle('hidden');
    mainContent.classList.toggle('expanded');
  }
});

// ===============================
// NAVIGATION
// ===============================
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const section = link.getAttribute('data-section');

    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    alert(`Switching to ${section} section`);

    if (window.innerWidth <= 1024) {
      sidebar.classList.remove('visible');
    }
  });
});

// ===============================
// DASHBOARD STATS
// ===============================
function updateStats() {
  document.getElementById('totalBookings').textContent = sampleBookings.length;
  document.getElementById('activeOrders').textContent = sampleBookings.filter(b => b.status === 'pending').length;

  let total = 0;
  sampleBookings.forEach(b => {
    total += Number(b.price.replace('$','').replace(',',''));
  });

  document.getElementById('totalRevenue').textContent = `$${total.toLocaleString()}`;
  document.getElementById('totalCustomers').textContent = '247';
}

// ===============================
// LOAD BOOKINGS TABLE
// ===============================
function loadBookings() {
  const container = document.getElementById('bookingsTable');

  container.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>Loading bookings...</p>
    </div>
  `;

  setTimeout(() => {
    let tableHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Customer</th>
            <th>Route</th>
            <th>Date</th>
            <th>Status</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
    `;

    sampleBookings.forEach(booking => {
      tableHTML += `
        <tr>
          <td><strong>${booking.id}</strong></td>
          <td>${booking.customer}</td>
          <td>${booking.pickup} → ${booking.delivery}</td>
          <td>${booking.date}</td>
          <td>
            <span class="status-badge status-${booking.status}">
              ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </td>
          <td><strong>${booking.price}</strong></td>
          <td>
            <div class="action-btns">
              <button class="action-btn btn-view" onclick="viewBooking('${booking.id}')">
                <i class="fas fa-eye"></i>
              </button>
              <button class="action-btn btn-edit" onclick="editBooking('${booking.id}')">
                <i class="fas fa-edit"></i>
              </button>
              <button class="action-btn btn-delete" onclick="deleteBooking('${booking.id}')">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    });

    tableHTML += `
        </tbody>
      </table>
    `;

    container.innerHTML = tableHTML;
  }, 500);
}

// ===============================
// ACTION FUNCTIONS
// ===============================
function viewBooking(id) {
  alert(`Viewing booking ${id}`);
}

function editBooking(id) {
  alert(`Editing booking ${id}`);
}

function deleteBooking(id) {
  if (confirm(`Delete booking ${id}?`)) {
    const index = sampleBookings.findIndex(b => b.id === id);
    if (index !== -1) {
      sampleBookings.splice(index, 1);
    }
    loadBookings();
    updateStats();
  }
}

// ===============================
// INITIAL LOAD
// ===============================
window.addEventListener('DOMContentLoaded', () => {
  updateStats();
  loadBookings();
});

// ===============================
// RESPONSIVE FIX
// ===============================
window.addEventListener('resize', () => {
  if (window.innerWidth > 1024) {
    sidebar.classList.remove('visible');
  }
});
