// enquiries.js - Enquiries page logic

let allEnquiries = [];
let currentEnquiryId = null;

document.addEventListener('DOMContentLoaded', () => {
  loadEnquiries();
  setupModalClose('viewEnquiryModal');
  
  // Check if there's an ID in URL
  const urlParams = new URLSearchParams(window.location.search);
  const enquiryId = urlParams.get('id');
  if (enquiryId) {
    setTimeout(() => viewEnquiry(enquiryId), 500);
  }
});

// Load all enquiries
async function loadEnquiries() {
  const containerId = 'enquiriesTable';
  showLoading(containerId);

  try {
    const enquiries = await apiCall(API_CONFIG.endpoints.getAllEnquiries);
    allEnquiries = enquiries || [];
    
    if (allEnquiries.length === 0) {
      showEmptyState(containerId, 'No enquiries found');
      return;
    }

    renderEnquiriesTable(allEnquiries);

  } catch (error) {
    console.error('Error loading enquiries:', error);
    showError(containerId, 'Failed to load enquiries. Please try again.');
  }
}

// Render enquiries table
function renderEnquiriesTable(enquiries) {
  const containerId = 'enquiriesTable';
  
  if (enquiries.length === 0) {
    showEmptyState(containerId, 'No enquiries match your criteria');
    return;
  }

  let tableHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Contact</th>
          <th>Service Type</th>
          <th>Route</th>
          <th>Details</th>
          <th>Status</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  `;

  enquiries.forEach(enquiry => {
    tableHTML += `
      <tr>
        <td><strong>${enquiry.name || 'N/A'}</strong></td>
        <td style="max-width: 180px; word-break: break-word;">
  ${enquiry.email ? `<div><i class="fas fa-envelope" style="margin-right:5px;"></i><a href="mailto:${enquiry.email}">${enquiry.email}</a></div>` : ''}
  ${enquiry.phone ? `<div><i class="fas fa-phone" style="margin-right:5px;"></i><a href="tel:${enquiry.phone}">${enquiry.phone}</a></div>` : ''}
  ${(!enquiry.email && !enquiry.phone) ? 'N/A' : ''}
</td>



        <td>
          <span style="
            display: inline-block;
            padding: 4px 10px;
            background: rgba(255, 99, 71, 0.1);
            border-radius: 20px;
            font-size: 0.85rem;
            color: var(--primary-color);
            font-weight: 600;
          ">
            ${enquiry.serviceType || enquiry.service || 'General'}
          </span>
        </td>
        <td style="max-width: 220px; word-break: break-word;">
        ${enquiry.pickupLocation ? `<div><i class="fas fa-map-marker-alt" style="color: var(--success);"></i> ${truncateText(enquiry.pickupLocation, 30)}</div>` : ''}
        ${enquiry.deliveryLocation ? `<div style="margin-top: 3px;"><i class="fas fa-map-marker-alt" style="color: var(--error);"></i> ${truncateText(enquiry.deliveryLocation, 30)}</div>` : ''}
        ${(!enquiry.pickupLocation && !enquiry.deliveryLocation) ? 'N/A' : ''}
      </td>
        <td>${truncateText(enquiry.details || enquiry.message || '', 50)}</td>
        <td>${getStatusBadge(enquiry.status || 'pending')}</td>
        <td>${formatDate(enquiry.createdAt || enquiry.date)}</td>
        <td>
          <div class="action-btns">
            <button class="action-btn btn-view" onclick="viewEnquiry('${enquiry._id}')" title="View Details">
              <i class="fas fa-eye"></i>
            </button>
            <button class="action-btn btn-delete" onclick="deleteEnquiry('${enquiry._id}')" title="Delete">
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

  document.getElementById(containerId).innerHTML = tableHTML;
}

// View enquiry details
async function viewEnquiry(id) {
  currentEnquiryId = id;
  const enquiry = allEnquiries.find(e => e._id === id);
  
  if (!enquiry) {
    alert('Enquiry not found');
    return;
  }

  const detailsHTML = `
    <div class="detail-row">
      <div class="detail-label">Service Type:</div>
      <div class="detail-value">
        <span style="
          display: inline-block;
          padding: 6px 14px;
          background: rgba(255, 99, 71, 0.1);
          border-radius: 20px;
          font-weight: 600;
          color: var(--primary-color);
        ">
          ${enquiry.serviceType || enquiry.service || 'General Enquiry'}
        </span>
      </div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Name:</div>
      <div class="detail-value">${enquiry.name || 'N/A'}</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Email:</div>
      <div class="detail-value">
        ${enquiry.email ? `<a href="mailto:${enquiry.email}" style="color: var(--primary-color);">${enquiry.email}</a>` : 'N/A'}
      </div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Phone:</div>
      <div class="detail-value">
        ${enquiry.phone ? `<a href="tel:${enquiry.phone}" style="color: var(--primary-color); font-weight: 600;">${enquiry.phone}</a>` : 'N/A'}
      </div>
    </div>
    ${enquiry.pickupLocation ? `
    <div class="detail-row">
      <div class="detail-label">Pickup Location:</div>
      <div class="detail-value">
        <i class="fas fa-map-marker-alt" style="color: var(--success);"></i> 
        ${enquiry.pickupLocation}
      </div>
    </div>
    ` : ''}
    ${enquiry.deliveryLocation ? `
    <div class="detail-row">
      <div class="detail-label">Delivery Location:</div>
      <div class="detail-value">
        <i class="fas fa-map-marker-alt" style="color: var(--error);"></i> 
        ${enquiry.deliveryLocation}
      </div>
    </div>
    ` : ''}
    ${enquiry.preferredDate ? `
    <div class="detail-row">
      <div class="detail-label">Preferred Date:</div>
      <div class="detail-value">${formatDate(enquiry.preferredDate)}</div>
    </div>
    ` : ''}
    ${enquiry.vehicleType ? `
    <div class="detail-row">
      <div class="detail-label">Vehicle Type:</div>
      <div class="detail-value">${enquiry.vehicleType}</div>
    </div>
    ` : ''}
    ${enquiry.vehicleDetails ? `
    <div class="detail-row">
      <div class="detail-label">Vehicle Details:</div>
      <div class="detail-value">${enquiry.vehicleDetails}</div>
    </div>
    ` : ''}
    ${enquiry.budget ? `
    <div class="detail-row">
      <div class="detail-label">Budget:</div>
      <div class="detail-value">${formatCurrency(enquiry.budget)}</div>
    </div>
    ` : ''}
    <div class="detail-row">
      <div class="detail-label">Details / Message:</div>
      <div class="detail-value" style="white-space: pre-wrap; line-height: 1.8;">
        ${enquiry.details || enquiry.message || 'No details provided'}
      </div>
    </div>
    ${enquiry.additionalInfo ? `
    <div class="detail-row">
      <div class="detail-label">Additional Info:</div>
      <div class="detail-value" style="white-space: pre-wrap;">${enquiry.additionalInfo}</div>
    </div>
    ` : ''}
    <div class="detail-row">
      <div class="detail-label">Status:</div>
      <div class="detail-value">${getStatusBadge(enquiry.status || 'pending')}</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Submitted On:</div>
      <div class="detail-value">${formatDate(enquiry.createdAt || enquiry.date)}</div>
    </div>
    ${enquiry.updatedAt && enquiry.updatedAt !== enquiry.createdAt ? `
    <div class="detail-row">
      <div class="detail-label">Last Updated:</div>
      <div class="detail-value">${formatDate(enquiry.updatedAt)}</div>
    </div>
    ` : ''}
    ${enquiry.resolvedAt ? `
    <div class="detail-row">
      <div class="detail-label">Resolved On:</div>
      <div class="detail-value">${formatDate(enquiry.resolvedAt)}</div>
    </div>
    ` : ''}
  `;

  document.getElementById('enquiryDetails').innerHTML = detailsHTML;
  showModal('viewEnquiryModal');
}

// Update enquiry status
async function updateEnquiryStatus(status) {
  if (!currentEnquiryId) return;

  try {
    await apiCall(`${API_CONFIG.endpoints.getEnquiryByReference}/${currentEnquiryId}`, {
      method: 'PUT',
      body: JSON.stringify({ 
        status,
        updatedAt: new Date().toISOString(),
        resolvedAt: status === 'resolved' ? new Date().toISOString() : null
      })
    });

    showSuccess(`Enquiry marked as ${status.replace('-', ' ')}`);
    hideModal('viewEnquiryModal');
    loadEnquiries();

  } catch (error) {
    console.error('Error updating enquiry:', error);
    alert('Failed to update enquiry status. Please try again.');
  }
}

// Delete enquiry
async function deleteEnquiry(id) {
  if (!confirmDelete('this enquiry')) {
    return;
  }

  try {
    await apiCall(`${API_CONFIG.endpoints.getAllEnquiries}/${id}`, {
      method: 'DELETE'
    });

    showSuccess('Enquiry deleted successfully');
    loadEnquiries();

  } catch (error) {
    console.error('Error deleting enquiry:', error);
    alert('Failed to delete enquiry. Please try again.');
  }
}

// Delete enquiry from modal
function deleteEnquiryFromModal() {
  if (currentEnquiryId) {
    hideModal('viewEnquiryModal');
    deleteEnquiry(currentEnquiryId);
  }
}

// Handle search
const handleSearch = debounce(function() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  
  const filtered = allEnquiries.filter(enquiry => {
    return (enquiry.name?.toLowerCase().includes(searchTerm) ||
            enquiry.email?.toLowerCase().includes(searchTerm) ||
            enquiry.phone?.toLowerCase().includes(searchTerm) ||
            enquiry.serviceType?.toLowerCase().includes(searchTerm) ||
            enquiry.service?.toLowerCase().includes(searchTerm) ||
            enquiry.details?.toLowerCase().includes(searchTerm) ||
            enquiry.message?.toLowerCase().includes(searchTerm) ||
            enquiry.pickupLocation?.toLowerCase().includes(searchTerm) ||
            enquiry.deliveryLocation?.toLowerCase().includes(searchTerm));
  });

  renderEnquiriesTable(filtered);
}, 300);

// Handle filter
function handleFilter() {
  const status = document.getElementById('statusFilter').value;
  const service = document.getElementById('serviceFilter').value;
  
  let filtered = [...allEnquiries];
  
  if (status !== 'all') {
    filtered = filtered.filter(e => (e.status || 'pending') === status);
  }
  
  if (service !== 'all') {
    filtered = filtered.filter(e => {
      const enquiryService = (e.serviceType || e.service || '').toLowerCase();
      return enquiryService.includes(service.toLowerCase());
    });
  }

  renderEnquiriesTable(filtered);
}

// Handle sort
function handleSort() {
  const sortBy = document.getElementById('sortFilter').value;
  let sorted = [...allEnquiries];

  switch(sortBy) {
    case 'newest':
      sorted.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
      break;
    case 'oldest':
      sorted.sort((a, b) => new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date));
      break;
    case 'name':
      sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      break;
  }

  renderEnquiriesTable(sorted);
}