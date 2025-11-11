// ==== CONFIG ====
const REPO_OWNER = "Nikhilrsingh"; // change to your repo owner
const REPO_NAME = "car-transport-service"; // change to your repo name
const GITHUB_TOKEN = ""; // optional  

// ==== GLOBAL STATE ====
let allContributors = [];
let contributorDetails = new Map();
let recentCommits = [];
let currentPage = 1;
const contributorsPerPage = 10;
let currentSort = 'contributions';
let currentFilter = 'all';

// ==== CONTRIBUTOR TIERS ====
const TIERS = {
  GOLD: { min: 50, emoji: '🥇', class: 'tier-gold', name: 'Gold' },
  SILVER: { min: 20, emoji: '🥈', class: 'tier-silver', name: 'Silver' },
  BRONZE: { min: 10, emoji: '🥉', class: 'tier-bronze', name: 'Bronze' },
  CONTRIBUTOR: { min: 1, emoji: '⭐', class: 'tier-contributor', name: 'Contributor' }
};

// ==== UTIL ====
function safeSetText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function animateCounter(element, target, duration = 1000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = Math.round(target);
      clearInterval(timer);
    } else {
      element.textContent = Math.round(current);
    }
  }, 16);
}

async function fetchWithAuth(url) {
  const headers = GITHUB_TOKEN
    ? { Authorization: `token ${GITHUB_TOKEN}` }
    : {};
  const res = await fetch(url, { headers });
  const text = await res.text();
  try {
    const json = JSON.parse(text);
    if (json.message) {
      console.warn(`⚠️ GitHub API error: ${json.message}`);
    }
    return json;
  } catch {
    console.error("❌ Failed to parse JSON:", text);
    return [];
  }
}

const spinner = document.getElementById("spinner");
const list = document.getElementById("contributorsList");

window.showSpinner = () => {
  if (spinner) spinner.style.display = "flex";
  if (list) list.style.display = "none";
};

window.hideSpinner = () => {
  if (spinner) spinner.style.display = "none";
  if (list) list.style.display = "grid";
};

// ==== TIER CALCULATION ====
function getContributorTier(contributions) {
  if (contributions >= TIERS.GOLD.min) return TIERS.GOLD;
  if (contributions >= TIERS.SILVER.min) return TIERS.SILVER;
  if (contributions >= TIERS.BRONZE.min) return TIERS.BRONZE;
  return TIERS.CONTRIBUTOR;
}

// ==== BADGE CALCULATION ====
function calculateBadges(contributor, allContributors, recentCommits) {
  const badges = [];
  
  // Top Contributor (most commits)
  const maxContributions = Math.max(...allContributors.map(c => c.contributions));
  if (contributor.contributions === maxContributions) {
    badges.push({ type: 'top', label: '🏆 Top Contributor', class: 'badge-top' });
  }
  
  // Rising Star (active in recent commits)
  const recentActivity = recentCommits.filter(c => 
    c.author && c.author.login === contributor.login
  ).length;
  if (recentActivity >= 5) {
    badges.push({ type: 'rising', label: '🌟 Rising Star', class: 'badge-rising' });
  }
  
  // First Contributor (if they have the least commits but still contributed)
  const minContributions = Math.min(...allContributors.map(c => c.contributions));
  if (contributor.contributions === minContributions && contributor.contributions <= 3) {
    badges.push({ type: 'first', label: '🎯 First Contributor', class: 'badge-first' });
  }
  
  // Quality Contributor (10+ commits)
  if (contributor.contributions >= 10) {
    badges.push({ type: 'quality', label: '💎 Quality Contributor', class: 'badge-quality' });
  }
  
  return badges;
}

// ==== FETCH RECENT COMMITS FOR TIMELINE ====
async function fetchRecentCommits() {
  try {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits?per_page=30`;
    const commits = await fetchWithAuth(url);
    
    if (!Array.isArray(commits)) {
      console.warn("No commits found or API error");
      return [];
    }
    
    recentCommits = commits;
    return commits;
  } catch (err) {
    console.error("❌ Failed to load recent commits:", err);
    return [];
  }
}

// ==== FETCH CONTRIBUTOR DETAILS ====
async function fetchContributorDetails(username) {
  if (contributorDetails.has(username)) {
    return contributorDetails.get(username);
  }
  
  try {
    // Fetch user stats
    const userUrl = `https://api.github.com/users/${username}`;
    const userStats = await fetchWithAuth(userUrl);
    
    // Fetch user's commits in the repo
    const commitsUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits?author=${username}&per_page=100`;
    const userCommits = await fetchWithAuth(commitsUrl);
    
    // Calculate stats
    let totalAdditions = 0;
    let totalDeletions = 0;
    const commitDates = [];
    
    if (Array.isArray(userCommits)) {
      for (const commit of userCommits.slice(0, 30)) {
        if (commit.sha) {
          try {
            const commitDetailUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits/${commit.sha}`;
            const commitDetail = await fetchWithAuth(commitDetailUrl);
            
            if (commitDetail.stats) {
              totalAdditions += commitDetail.stats.additions || 0;
              totalDeletions += commitDetail.stats.deletions || 0;
            }
            
            if (commit.commit && commit.commit.author && commit.commit.author.date) {
              commitDates.push(new Date(commit.commit.author.date));
            }
          } catch (err) {
            console.warn(`Failed to fetch commit detail for ${commit.sha}`);
          }
        }
      }
    }
    
    const details = {
      additions: totalAdditions,
      deletions: totalDeletions,
      pullRequests: Math.floor(userCommits.length / 3), // Estimate
      commitDates: commitDates,
      totalCommits: userCommits.length
    };
    
    contributorDetails.set(username, details);
    return details;
  } catch (err) {
    console.error(`❌ Failed to load details for ${username}:`, err);
    return {
      additions: 0,
      deletions: 0,
      pullRequests: 0,
      commitDates: [],
      totalCommits: 0
    };
  }
}

// ==== FETCH CONTRIBUTORS ====
async function fetchContributors() {
  try {
    showSpinner();
    console.log("📡 Fetching contributors...");
    
    // Fetch contributors
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contributors?per_page=100`;
    const contributors = await fetchWithAuth(url);

    if (!Array.isArray(contributors)) {
      throw new Error("Invalid contributors response");
    }

    // Fetch recent commits for timeline and badges
    await fetchRecentCommits();

    allContributors = contributors
      .filter((c) => c.login.toLowerCase() !== "nikhilrsingh") // Exclude project lead
      .map((c) => ({
        login: c.login,
        avatar_url: c.avatar_url,
        html_url: c.html_url,
        contributions: c.contributions,
        tier: getContributorTier(c.contributions),
        badges: []
      }));
    
    // Calculate badges for each contributor
    allContributors.forEach(contributor => {
      contributor.badges = calculateBadges(contributor, allContributors, recentCommits);
    });

    console.log(`✅ Loaded ${allContributors.length} contributors`);
    updateStats();
    displayTimeline();
    displayContributors();
  } catch (err) {
    console.error("❌ Failed to load contributors:", err);
    safeSetText(
      "errorMessage",
      "Failed to load contributors. Check console for details."
    );
  } finally {
    hideSpinner();
  }
}

// ==== DISPLAY TIMELINE ====
function displayTimeline() {
  const timelineContent = document.getElementById("timelineContent");
  if (!timelineContent || !recentCommits || recentCommits.length === 0) return;
  
  timelineContent.innerHTML = "";
  
  const displayCommits = recentCommits.slice(0, 10);
  
  displayCommits.forEach(commit => {
    if (!commit.author) return;
    
    const item = document.createElement("div");
    item.className = "timeline-item";
    
    const date = commit.commit && commit.commit.author ? 
      new Date(commit.commit.author.date).toLocaleDateString() : 
      'Unknown date';
    
    const message = commit.commit && commit.commit.message ? 
      commit.commit.message.split('\n')[0].substring(0, 60) : 
      'No message';
    
    item.innerHTML = `
      <img src="${commit.author.avatar_url}" alt="${commit.author.login}" class="timeline-avatar">
      <div class="timeline-info">
        <strong>${commit.author.login}</strong>
        <p>${message}</p>
        <span class="timeline-date">${date}</span>
      </div>
    `;
    
    timelineContent.appendChild(item);
  });
}

// ==== DISPLAY CONTRIBUTORS ====
function displayContributors() {
  const list = document.getElementById("contributorsList");
  if (!list) {
    console.warn("⚠️ Missing element with id='contributorsList'");
    return;
  }

  list.innerHTML = "";
  
  let filteredContributors = [...allContributors];
  
  // Apply filters
  switch(currentFilter) {
    case 'top10':
      filteredContributors = filteredContributors.slice(0, 10);
      break;
    case 'gold':
      filteredContributors = filteredContributors.filter(c => c.contributions >= TIERS.GOLD.min);
      break;
    case 'silver':
      filteredContributors = filteredContributors.filter(c => c.contributions >= TIERS.SILVER.min && c.contributions < TIERS.GOLD.min);
      break;
    case 'bronze':
      filteredContributors = filteredContributors.filter(c => c.contributions >= TIERS.BRONZE.min && c.contributions < TIERS.SILVER.min);
      break;
    case 'contributor':
      filteredContributors = filteredContributors.filter(c => c.contributions < TIERS.BRONZE.min);
      break;
    case 'new':
      filteredContributors = filteredContributors.filter(c => c.contributions <= 5);
      break;
  }
  
  // Apply sorting
  switch(currentSort) {
    case 'contributions':
      filteredContributors.sort((a, b) => b.contributions - a.contributions);
      break;
    case 'alphabetical':
      filteredContributors.sort((a, b) => a.login.localeCompare(b.login));
      break;
    case 'recent':
      // Sort by recent activity (based on recent commits)
      filteredContributors.sort((a, b) => {
        const aRecent = recentCommits.filter(c => c.author && c.author.login === a.login).length;
        const bRecent = recentCommits.filter(c => c.author && c.author.login === b.login).length;
        return bRecent - aRecent;
      });
      break;
  }

  const start = (currentPage - 1) * contributorsPerPage;
  const end = start + contributorsPerPage;
  const pageContributors = filteredContributors.slice(start, end);

  for (const c of pageContributors) {
    const item = document.createElement("div");
    item.className = "contributor";
    item.style.cursor = "pointer";
    
    const badgesHtml = c.badges.map(b => 
      `<span class="badge ${b.class}">${b.label}</span>`
    ).join('');
    
    item.innerHTML = `
      <img src="${c.avatar_url}" alt="${c.login}" width="70" height="70">
      <a href="${c.html_url}" target="_blank" onclick="event.stopPropagation()">${c.login}</a>
      <span class="tier-badge ${c.tier.class}">${c.tier.emoji} ${c.tier.name}</span>
      <div class="contributor-stats">
        <strong>${c.contributions}</strong> commits
      </div>
      <div class="contributor-badges">
        ${badgesHtml}
      </div>
    `;
    
    // Add click handler to show modal
    item.addEventListener('click', () => showContributorModal(c));
    
    list.appendChild(item);
  }

  safeSetText("currentPage", currentPage);
  safeSetText("totalPages", Math.ceil(filteredContributors.length / contributorsPerPage));
}

// ==== SHOW CONTRIBUTOR MODAL ====
async function showContributorModal(contributor) {
  const modal = document.getElementById('contributorModal');
  if (!modal) return;
  
  // Show modal immediately with basic info
  modal.style.display = 'block';
  
  // Set basic info
  document.getElementById('modalAvatar').src = contributor.avatar_url;
  document.getElementById('modalName').textContent = contributor.login;
  document.getElementById('modalGithubLink').href = contributor.html_url;
  document.getElementById('modalCommits').textContent = contributor.contributions;
  
  // Set badges
  const badgesContainer = document.getElementById('modalBadges');
  badgesContainer.innerHTML = contributor.badges.map(b => 
    `<span class="badge ${b.class}">${b.label}</span>`
  ).join('') + `<span class="tier-badge ${contributor.tier.class}">${contributor.tier.emoji} ${contributor.tier.name}</span>`;
  
  // Fetch and display detailed stats
  const details = await fetchContributorDetails(contributor.login);
  
  // Animate counters
  animateCounter(document.getElementById('modalPRs'), details.pullRequests);
  animateCounter(document.getElementById('modalAdditions'), details.additions);
  animateCounter(document.getElementById('modalDeletions'), details.deletions);
  
  // Generate heatmap
  generateHeatmap(details.commitDates);
}

// ==== GENERATE CONTRIBUTION HEATMAP ====
function generateHeatmap(commitDates) {
  const heatmapContainer = document.getElementById('contributionHeatmap');
  if (!heatmapContainer) return;
  
  heatmapContainer.innerHTML = '';
  
  if (!commitDates || commitDates.length === 0) {
    heatmapContainer.innerHTML = '<p style="color: var(--text-light);">No commit data available</p>';
    return;
  }
  
  // Create 365 days of data
  const today = new Date();
  const oneYearAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 365);
  
  const commitsByDate = new Map();
  commitDates.forEach(date => {
    const dateKey = date.toISOString().split('T')[0];
    commitsByDate.set(dateKey, (commitsByDate.get(dateKey) || 0) + 1);
  });
  
  // Generate cells for last 365 days (or 52 cells for display)
  const cellCount = 52;
  for (let i = cellCount - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - (i * 7));
    const dateKey = date.toISOString().split('T')[0];
    
    const count = commitsByDate.get(dateKey) || 0;
    let level = 0;
    if (count > 0) level = 1;
    if (count > 2) level = 2;
    if (count > 5) level = 3;
    if (count > 10) level = 4;
    
    const cell = document.createElement('div');
    cell.className = `heatmap-cell heatmap-level-${level}`;
    cell.title = `${dateKey}: ${count} commits`;
    
    heatmapContainer.appendChild(cell);
  }
}

// ==== UPDATE STATS ====
function updateStats() {
  const totalContributorsEl = document.getElementById("totalContributors");
  const totalCommitsEl = document.getElementById("totalCommits");
  const totalPointsEl = document.getElementById("totalPoints");
  const activeContributorsEl = document.getElementById("activeContributors");
  
  const totalContributors = allContributors.length;
  const totalCommits = allContributors.reduce((sum, c) => sum + c.contributions, 0);
  const totalPoints = totalCommits * 10; // Points system
  
  // Active contributors (contributed in recent commits)
  const activeUsernames = new Set(
    recentCommits.filter(c => c.author).map(c => c.author.login)
  );
  const activeContributors = allContributors.filter(c => 
    activeUsernames.has(c.login)
  ).length;
  
  // Animate counters
  if (totalContributorsEl) animateCounter(totalContributorsEl, totalContributors);
  if (totalCommitsEl) animateCounter(totalCommitsEl, totalCommits);
  if (totalPointsEl) animateCounter(totalPointsEl, totalPoints);
  if (activeContributorsEl) animateCounter(activeContributorsEl, activeContributors);
}

// ==== PAGINATION ====
function nextPage() {
  const totalPages = Math.ceil(allContributors.length / contributorsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    displayContributors();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    displayContributors();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// ==== SEARCH ====
function searchContributors(term) {
  if (!term) {
    displayContributors();
    return;
  }
  
  const filtered = allContributors.filter((c) =>
    c.login.toLowerCase().includes(term.toLowerCase())
  );

  const list = document.getElementById("contributorsList");
  if (!list) return;
  list.innerHTML = "";

  for (const c of filtered) {
    const item = document.createElement("div");
    item.className = "contributor";
    item.style.cursor = "pointer";
    
    const badgesHtml = c.badges.map(b => 
      `<span class="badge ${b.class}">${b.label}</span>`
    ).join('');
    
    item.innerHTML = `
      <img src="${c.avatar_url}" alt="${c.login}" width="70" height="70">
      <a href="${c.html_url}" target="_blank" onclick="event.stopPropagation()">${c.login}</a>
      <span class="tier-badge ${c.tier.class}">${c.tier.emoji} ${c.tier.name}</span>
      <div class="contributor-stats">
        <strong>${c.contributions}</strong> commits
      </div>
      <div class="contributor-badges">
        ${badgesHtml}
      </div>
    `;
    
    item.addEventListener('click', () => showContributorModal(c));
    list.appendChild(item);
  }
}

// ==== SETUP EVENT LISTENERS ====
function setupEventListeners() {
  const nextBtn = document.getElementById("nextPage");
  const prevBtn = document.getElementById("prevPage");
  const searchInput = document.getElementById("searchInput");
  const sortBySelect = document.getElementById("sortBy");
  const filterLevelSelect = document.getElementById("filterLevel");
  const modal = document.getElementById("contributorModal");
  const modalClose = document.querySelector(".modal-close");

  if (nextBtn) nextBtn.addEventListener("click", nextPage);
  if (prevBtn) prevBtn.addEventListener("click", prevPage);
  
  if (searchInput) {
    searchInput.addEventListener("input", (e) => searchContributors(e.target.value));
  }
  
  if (sortBySelect) {
    sortBySelect.addEventListener("change", (e) => {
      currentSort = e.target.value;
      currentPage = 1;
      displayContributors();
    });
  }
  
  if (filterLevelSelect) {
    filterLevelSelect.addEventListener("change", (e) => {
      currentFilter = e.target.value;
      currentPage = 1;
      displayContributors();
    });
  }
  
  // Modal close handlers
  if (modalClose) {
    modalClose.addEventListener("click", () => {
      if (modal) modal.style.display = "none";
    });
  }
  
  if (modal) {
    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  }
}

// ==== INIT ====
fetchContributors();
setupEventListeners();
