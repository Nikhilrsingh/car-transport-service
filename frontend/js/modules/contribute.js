// GitHub Repository Configuration
const REPO_OWNER = "Nikhilrsingh";
const REPO_NAME = "car-transport-service";
const API_BASE = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;

// State Management
let allContributors = []; 
let filteredContributors = [];
let currentPage = 1;
const itemsPerPage = 15;

// Point System Weights
const POINTS = {
    L3: 11,
    L2: 5,
    L1: 2,
    DEFAULT: 1,
    COMMIT: 1
};

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    initData();
    fetchRecentActivity();
    setupEventListeners();
});

// ---------------------------------------------------------
// 1. Data Fetching & Initialization
// ---------------------------------------------------------
async function initData() {
    const grid = document.getElementById('contributorsList');
    const errorMessage = document.getElementById('errorMessage');
    
    try {
        // Reset UI state
        if(grid) grid.innerHTML = ''; 
        document.getElementById('spinner').style.display = 'flex';
        if(errorMessage) errorMessage.innerText = '';

        // Parallel Fetch: Repo Details & Contributors List
        const [repoRes, contributorsRes] = await Promise.all([
            fetch(API_BASE),
            fetch(`${API_BASE}/contributors?per_page=100`)
        ]);

        if (!repoRes.ok || !contributorsRes.ok) {
            throw new Error("API Limit Exceeded or Network Error");
        }

        const repoData = await repoRes.json();
        const rawContributors = await contributorsRes.json();

        // Fetch Pull Requests to calculate points
        const rawPulls = await fetchAllPulls();

        // Process Data
        processData(repoData, rawContributors, rawPulls);

    } catch (error) {
        console.error('Error initializing data:', error);
        document.getElementById('spinner').style.display = 'none';
        if(grid) grid.innerHTML = '';
        if(errorMessage) errorMessage.innerText = 'Failed to load data. GitHub API limit may be exceeded. Please try again later.';
    }
}

// Fetch up to 3 pages of PRs to avoid rate limits
async function fetchAllPulls() {
    let pulls = [];
    let page = 1;
    while (page <= 3) {
        try {
            const res = await fetch(`${API_BASE}/pulls?state=all&per_page=100&page=${page}`);
            if (!res.ok) break;
            const data = await res.json();
            if (!data.length) break;
            pulls = pulls.concat(data);
            page++;
        } catch (e) { break; }
    }
    return pulls;
}

// ---------------------------------------------------------
// 2. Data Processing
// ---------------------------------------------------------
function processData(repoData, contributors, pulls) {
    const statsMap = {};
    let totalProjectPoints = 0;
    let totalProjectCommits = 0;

    // A. Calculate Points from PRs
    pulls.forEach(pr => {
        if (!pr.merged_at) return; 

        const user = pr.user.login.toLowerCase();
        if (!statsMap[user]) statsMap[user] = { prs: 0, points: 0 };

        statsMap[user].prs++;

        let prPoints = 0;
        let hasLevel = false;

        // Check labels for points
        pr.labels.forEach(label => {
            const name = label.name.toLowerCase();
            if (name.includes('level 3')) { prPoints += POINTS.L3; hasLevel = true; }
            else if (name.includes('level 2')) { prPoints += POINTS.L2; hasLevel = true; }
            else if (name.includes('level 1')) { prPoints += POINTS.L1; hasLevel = true; }
        });

        if (!hasLevel) prPoints += POINTS.DEFAULT;

        statsMap[user].points += prPoints;
        totalProjectPoints += prPoints;
    });

    // B. Merge with Profile Data
    allContributors = contributors.map(c => {
        const login = c.login.toLowerCase();
        const userStats = statsMap[login] || { prs: 0, points: 0 };
        
        totalProjectCommits += c.contributions;

        // If no PR points, give base points for commits
        let finalPoints = userStats.points;
        if (finalPoints === 0) {
            finalPoints = c.contributions * POINTS.COMMIT; 
        }

        return {
            login: c.login, // Original case
            id: c.id,
            avatar_url: c.avatar_url,
            html_url: c.html_url,
            contributions: c.contributions,
            prs: userStats.prs,
            points: finalPoints
        };
    });

    // C. Initial Sort (Most Points)
    allContributors.sort((a, b) => b.points - a.points);

    // D. Update Stats on Screen
    updateGlobalStats(contributors.length, totalProjectPoints, totalProjectCommits);

    // E. Initialize Filtered Data
    filteredContributors = [...allContributors];
    
    // F. Render
    document.getElementById('spinner').style.display = 'none';
    renderContributors(1);
}

function updateGlobalStats(count, points, commits) {
    safeSetText('totalContributors', count);
    safeSetText('totalPoints', points);
    
    // Format commits (e.g., 1.2k)
    const displayCommits = commits > 1000 ? (commits/1000).toFixed(1) + 'k' : commits;
    safeSetText('totalCommits', displayCommits);

    // Active Contributors (Logic: merged a PR or > 5 commits)
    const activeCount = allContributors.filter(c => c.prs > 0 || c.contributions > 5).length;
    safeSetText('activeContributors', activeCount);
}

// ---------------------------------------------------------
// 3. Event Listeners (Search, Filter, Sort)
// ---------------------------------------------------------
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const sortBy = document.getElementById('sortBy');
    const filterLevel = document.getElementById('filterLevel');
    const refreshBtn = document.getElementById('refreshData');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');

    // Search
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            applyFilters(e.target.value, sortBy.value, filterLevel.value);
        });
    }

    // Sort
    if (sortBy) {
        sortBy.addEventListener('change', (e) => {
            applyFilters(searchInput.value, e.target.value, filterLevel.value);
        });
    }

    // Filter
    if (filterLevel) {
        filterLevel.addEventListener('change', (e) => {
            applyFilters(searchInput.value, sortBy.value, e.target.value);
        });
    }

    // Refresh
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            allContributors = [];
            initData();
        });
    }

    // Pagination
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderContributors(currentPage);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const maxPage = Math.ceil(filteredContributors.length / itemsPerPage);
            if (currentPage < maxPage) {
                currentPage++;
                renderContributors(currentPage);
            }
        });
    }
}

// ---------------------------------------------------------
// 4. Filtering Logic
// ---------------------------------------------------------
function applyFilters(searchTerm, sortType, levelType) {
    // Reset to full list first
    let result = [...allContributors];

    // 1. Filter by Name
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        result = result.filter(c => c.login.toLowerCase().includes(term));
    }

    // 2. Filter by Level
    if (levelType !== 'all') {
        result = result.filter(c => {
            const league = getLeagueData(c.points);
            if (levelType === 'top10') return true; // Handle slice later
            if (levelType === 'gold') return league.tier === 'tier-gold';
            if (levelType === 'silver') return league.tier === 'tier-silver';
            if (levelType === 'bronze') return league.tier === 'tier-bronze';
            if (levelType === 'contributor') return league.tier === 'tier-contributor';
            if (levelType === 'new') return c.contributions < 5;
            return true;
        });
    }

    // 3. Sort
    if (sortType === 'contributions') {
        result.sort((a, b) => b.points - a.points); // Points usually correlate with contribution value
    } else if (sortType === 'alphabetical') {
        result.sort((a, b) => a.login.localeCompare(b.login));
    } else if (sortType === 'recent') {
        // Since we don't have exact recent date in this view, fallback to commits count
        result.sort((a, b) => b.contributions - a.contributions);
    }

    // Special case for Top 10
    if (levelType === 'top10') {
        result.sort((a, b) => b.points - a.points);
        result = result.slice(0, 10);
    }

    filteredContributors = result;
    currentPage = 1; // Reset to page 1 on filter change
    renderContributors(1);
}

// ---------------------------------------------------------
// 5. Rendering
// ---------------------------------------------------------
function renderContributors(page) {
    const grid = document.getElementById('contributorsList');
    if (!grid) return;
    grid.innerHTML = '';

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const itemsToShow = filteredContributors.slice(start, end);

    if (itemsToShow.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No contributors match your search.</p>';
        updatePaginationUI();
        return;
    }

    itemsToShow.forEach((c, index) => {
        const rank = start + index + 1;
        const league = getLeagueData(c.points);

        const card = document.createElement('div');
        card.className = `contributor ${league.tier}`;
        card.onclick = () => openContributorModal(c, league, rank);

        card.innerHTML = `
            <img src="${c.avatar_url}" alt="${c.login}" loading="lazy">
            <span class="cont-name">${c.login}</span>
            <div class="contributor-badges">
                <span class="tier-badge ${league.class}">${league.text}</span>
            </div>
            <div class="contributor-stats">
                 <i class="fas fa-star" style="color:gold"></i> ${c.points} Pts
                 <span style="margin: 0 5px">|</span>
                 <i class="fas fa-code"></i> ${c.contributions}
            </div>
        `;
        grid.appendChild(card);
    });

    updatePaginationUI();
}

function updatePaginationUI() {
    const maxPage = Math.ceil(filteredContributors.length / itemsPerPage) || 1;
    safeSetText('currentPage', currentPage);
    safeSetText('totalPages', maxPage);
    
    // Disable buttons if at limits
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === maxPage;
    
    // Visual feedback
    document.getElementById('prevPage').style.opacity = currentPage === 1 ? '0.5' : '1';
    document.getElementById('nextPage').style.opacity = currentPage === maxPage ? '0.5' : '1';
}

function getLeagueData(points) {
    if (points > 150) return { text: 'Gold 🏆', class: 'badge-gold', tier: 'tier-gold', label: 'Gold League' };
    if (points > 75) return { text: 'Silver 🥈', class: 'badge-silver', tier: 'tier-silver', label: 'Silver League' };
    if (points > 30) return { text: 'Bronze 🥉', class: 'badge-bronze', tier: 'tier-bronze', label: 'Bronze League' };
    return { text: 'Contributor', class: 'badge-contributor', tier: 'tier-contributor', label: 'Contributor' };
}

// ---------------------------------------------------------
// 6. Modal & Utilities
// ---------------------------------------------------------
function openContributorModal(c, league, rank) {
    const modal = document.getElementById('contributorModal');
    if (!modal) return;

    document.getElementById('modalAvatar').src = c.avatar_url;
    document.getElementById('modalName').textContent = c.login;
    document.getElementById('modalGithubLink').href = c.html_url;
    
    // Safe text setting
    safeSetText('modalCommits', c.contributions);
    safeSetText('modalPRs', c.prs);
    
    // Mock data for additions/deletions since we don't deep fetch everyone
    safeSetText('modalAdditions', c.contributions * 15 + Math.floor(Math.random() * 100));
    safeSetText('modalDeletions', Math.floor(c.contributions * 5));

    modal.classList.add('active');
}

// Close Modal logic
document.querySelector('.modal-close')?.addEventListener('click', () => {
    document.getElementById('contributorModal')?.classList.remove('active');
});
window.onclick = (e) => {
    const modal = document.getElementById('contributorModal');
    if (e.target === modal) modal.classList.remove('active');
};

// Helper to set text safely
function safeSetText(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
}

// 7. Recent Activity (Commits)
async function fetchRecentActivity() {
    try {
        const response = await fetch(`${API_BASE}/commits?per_page=10`);
        if(!response.ok) return;
        const commits = await response.json();
        const container = document.getElementById("timelineContent");
        if (!container) return;
        
        container.innerHTML = commits.map(c => {
            const msg = c.commit.message.split('\n')[0];
            const author = c.commit.author.name;
            const date = new Date(c.commit.author.date).toLocaleDateString();
            return `
                <div class="timeline-item">
                    <div class="activity-marker"></div>
                    <div class="timeline-info">
                        <strong>${author}</strong>: ${msg} 
                        <br><small style="opacity:0.7">${date}</small>
                    </div>
                </div>
            `;
        }).join('');
    } catch (e) { console.error('Timeline error:', e); }
}