// Region Search Functionality
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('regionSearch');
  const regionGrid = document.getElementById('regionGrid');
  
  if (!searchInput || !regionGrid) return;
  
  const regionButtons = regionGrid.querySelectorAll('.region-btn');
  
  searchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    regionButtons.forEach(button => {
      const cityName = button.textContent.toLowerCase();
      
      if (cityName.includes(searchTerm)) {
        button.style.display = 'block';
      } else {
        button.style.display = 'none';
      }
    });
  });
});
