// emergencies.js - Emergency requests page logic

let allEmergencies = [];
let currentEmergencyId = null;

document.addEventListener('DOMContentLoaded', () => {
  loadEmergencies();
  setupModalClose('viewEmergencyModal');
  
  // Check if there's an ID in URL to open specific emergency
  const urlParams = new URLSearchParams(window.location.search);
  const emergencyId = urlParams.get('id');
  if (emergencyId) {
    setTimeout(() => viewEmergency(emergencyId), 500);
  }
});

// Load all emergencies
async function loadEmergencies() {
  const containerId = 'emergenciesTable';
  showLoading(containerId);

  try {
    const emergencies = await apiCall(API_CONFIG.endpoints.getAllEmergencies);

    // Map backend fields to frontend-friendly fields
    allEmergencies = (emergencies || []).map(e => ({
      ...e,
      name: e.fullName,
      phone: e.phoneNumber,
      email: e.emailAddress,
      location: e.currentLocation,
      issue: e.issueDescription,
      priority: e.urgencyLevel
    }));

    if (allEmergencies.length === 0) {
      showEmptyState(containerId, 'No emergency requests found', 'exclamation-triangle');
      return;
    }

    renderEmergenciesTable(allEmergencies);

  } catch (error) {
    console.error('Error loading emergencies:', error);
    showError(containerId, 'Failed to load emergency requests. Please try again.');
  }
}

// Render emergencies table
function renderEmergenciesTable(emergencies) {
  const containerId = 'emergenciesTable';

  if (!emergencies.length) {
    showEmptyState(containerId, 'No emergencies match your criteria', 'exclamation-triangle');
    return;
  }

  let tableHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Priority</th>
          <th>Name</th>
          <th>Contact</th>
          <th>Location</th>
          <th>Issue</th>
          <th>Status</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  `;

  emergencies.forEach(emergency => {
    const priority = emergency.priority || determinePriority(emergency);

    tableHTML += `
      <tr style="${priority === 'high' ? 'background: rgba(220, 53, 69, 0.05);' : ''}">
        <td>${getPriorityBadge(priority)}</td>
        <td><strong>${emergency.name || 'N/A'}</strong></td>
        <td style="max-width: 150px; word-break: break-word;">
        ${emergency.phone ? `<div><i class="fas fa-phone" style="margin-right:5px;"></i><a href="tel:${emergency.phone}">${emergency.phone}</a></div>` : ''}
        ${emergency.email ? `<div><i class="fas fa-envelope" style="margin-right:5px;"></i><a href="mailto:${emergency.email}">${emergency.email}</a></div>` : ''}
        ${(!emergency.phone && !emergency.email) ? 'N/A' : ''}
      </td>
      
      <td style="max-width: 200px; word-break: break-word;">
        ${truncateText(emergency.location || '', 50)}
      </td>
      
        <td>${truncateText(emergency.issue || 'N/A', 40)}</td>
        <td>${getStatusBadge(emergency.status || 'pending')}</td>
        <td>${formatDate(emergency.createdAt || emergency.date)}</td>
        <td>
          <div class="action-btns">
            <button class="action-btn btn-view" onclick="viewEmergency('${emergency._id}')" title="View Details">
              <i class="fas fa-eye"></i>
            </button>
            <button class="action-btn btn-delete" onclick="deleteEmergency('${emergency._id}')" title="Delete">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  });

  tableHTML += `</tbody></table>`;
  document.getElementById(containerId).innerHTML = tableHTML;
}


// Determine priority based on keywords
function determinePriority(emergency) {
  const issue = (emergency.issue || emergency.description || '').toLowerCase();
  const highPriorityKeywords = ['accident', 'breakdown', 'stranded', 'stuck', 'urgent', 'immediate'];
  const mediumPriorityKeywords = ['help', 'problem', 'issue', 'assistance'];
  
  if (highPriorityKeywords.some(keyword => issue.includes(keyword))) {
    return 'high';
  } else if (mediumPriorityKeywords.some(keyword => issue.includes(keyword))) {
    return 'medium';
  }
  return 'low';
}

// Get priority badge HTML
function getPriorityBadge(priority) {
  const badges = {
    'high': '<span class="status-badge" style="background: rgba(220, 53, 69, 0.2); color: #a71d2a;"><i class="fas fa-exclamation-circle"></i> High</span>',
    'medium': '<span class="status-badge" style="background: rgba(255, 193, 7, 0.2); color: #c98700;"><i class="fas fa-exclamation-triangle"></i> Medium</span>',
    'low': '<span class="status-badge" style="background: rgba(23, 162, 184, 0.2); color: #117a8b;"><i class="fas fa-info-circle"></i> Low</span>'
  };
  return badges[priority] || badges['low'];
}

// View emergency details
async function viewEmergency(id) {
  currentEmergencyId = id;
  const emergency = allEmergencies.find(e => e._id === id);
  
  if (!emergency) {
    alert('Emergency request not found');
    return;
  }

  const priority = emergency.priority || determinePriority(emergency);

  const detailsHTML = `
    <div class="detail-row">
      <div class="detail-label">Priority:</div>
      <div class="detail-value">${getPriorityBadge(priority)}</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Name:</div>
      <div class="detail-value">${emergency.name || 'N/A'}</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Phone:</div>
      <div class="detail-value">
        ${emergency.phone ? `<a href="tel:${emergency.phone}" style="color: var(--primary-color); font-weight: 600;">${emergency.phone}</a>` : 'N/A'}
      </div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Email:</div>
      <div class="detail-value">
        ${emergency.email ? `<a href="mailto:${emergency.email}" style="color: var(--primary-color);">${emergency.email}</a>` : 'N/A'}
      </div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Location:</div>
      <div class="detail-value">${emergency.location || 'N/A'}</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Issue Description:</div>
      <div class="detail-value" style="white-space: pre-wrap;">${emergency.issue || emergency.description || 'N/A'}</div>
    </div>
    ${emergency.vehicleMake ? `
    <div class="detail-row">
      <div class="detail-label">Vehicle:</div>
      <div class="detail-value">
        ${emergency.vehicleMake} ${emergency.vehicleModel || ''} 
        ${emergency.vehicleYear ? `(${emergency.vehicleYear})` : ''}
        ${emergency.vehicleColor ? `- ${emergency.vehicleColor}` : ''}
      </div>
    </div>
    ` : ''}
    ${emergency.plateNumber ? `
    <div class="detail-row">
      <div class="detail-label">Plate Number:</div>
      <div class="detail-value">${emergency.plateNumber}</div>
    </div>
    ` : ''}
    ${emergency.additionalNotes ? `
    <div class="detail-row">
      <div class="detail-label">Additional Notes:</div>
      <div class="detail-value" style="white-space: pre-wrap;">${emergency.additionalNotes}</div>
    </div>
    ` : ''}
    <div class="detail-row">
      <div class="detail-label">Status:</div>
      <div class="detail-value">${getStatusBadge(emergency.status || 'pending')}</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Submitted On:</div>
      <div class="detail-value">${formatDate(emergency.createdAt || emergency.date)}</div>
    </div>
    ${emergency.resolvedAt ? `
    <div class="detail-row">
      <div class="detail-label">Resolved On:</div>
      <div class="detail-value">${formatDate(emergency.resolvedAt)}</div>
    </div>
    ` : ''}
  `;

  document.getElementById('emergencyDetails').innerHTML = detailsHTML;
  showModal('viewEmergencyModal');
}

// Update emergency status
async function updateEmergencyStatus(status) {
  if (!currentEmergencyId) return;

  try {
    await apiCall(`${API_CONFIG.endpoints.emergencies}/${currentEmergencyId}`, {
      method: 'PUT',
      body: JSON.stringify({ 
        status,
        resolvedAt: status === 'resolved' ? new Date().toISOString() : null
      })
    });

    showSuccess(`Emergency marked as ${status.replace('-', ' ')}`);
    hideModal('viewEmergencyModal');
    loadEmergencies();

  } catch (error) {
    console.error('Error updating emergency:', error);
    alert('Failed to update emergency status. Please try again.');
  }
}

// Delete emergency
async function deleteEmergency(id) {
  if (!confirmDelete('this emergency request')) {
    return;
  }

  try {
    await apiCall(`${API_CONFIG.endpoints.emergencies}/${id}`, {
      method: 'DELETE'
    });

    showSuccess('Emergency request deleted successfully');
    loadEmergencies();

  } catch (error) {
    console.error('Error deleting emergency:', error);
    alert('Failed to delete emergency request. Please try again.');
  }
}

// Delete emergency from modal
function deleteEmergencyFromModal() {
  if (currentEmergencyId) {
    hideModal('viewEmergencyModal');
    deleteEmergency(currentEmergencyId);
  }
}

// Handle search
const handleSearch = debounce(function() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  
  const filtered = allEmergencies.filter(emergency => {
    return (emergency.name?.toLowerCase().includes(searchTerm) ||
            emergency.phone?.toLowerCase().includes(searchTerm) ||
            emergency.email?.toLowerCase().includes(searchTerm) ||
            emergency.location?.toLowerCase().includes(searchTerm) ||
            emergency.issue?.toLowerCase().includes(searchTerm) ||
            emergency.description?.toLowerCase().includes(searchTerm) ||
            emergency.vehicleMake?.toLowerCase().includes(searchTerm));
  });

  renderEmergenciesTable(filtered);
}, 300);

// Handle filter
function handleFilter() {
  const status = document.getElementById('statusFilter').value;
  const priority = document.getElementById('priorityFilter').value;
  
  let filtered = [...allEmergencies];
  
  if (status !== 'all') {
    filtered = filtered.filter(e => (e.status || 'pending') === status);
  }
  
  if (priority !== 'all') {
    filtered = filtered.filter(e => {
      const emPriority = e.priority || determinePriority(e);
      return emPriority === priority;
    });
  }

  renderEmergenciesTable(filtered);
}

// Handle sort
function handleSort() {
  const sortBy = document.getElementById('sortFilter').value;
  let sorted = [...allEmergencies];

  switch(sortBy) {
    case 'newest':
      sorted.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
      break;
    case 'oldest':
      sorted.sort((a, b) => new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date));
      break;
    case 'priority':
      const priorityOrder = { 'high': 0, 'medium': 1, 'low': 2 };
      sorted.sort((a, b) => {
        const aPriority = a.priority || determinePriority(a);
        const bPriority = b.priority || determinePriority(b);
        return priorityOrder[aPriority] - priorityOrder[bPriority];
      });
      break;
  }

  renderEmergenciesTable(sorted);
}