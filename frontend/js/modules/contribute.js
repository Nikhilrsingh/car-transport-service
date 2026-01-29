// GitHub Repository Configuration
const REPO_OWNER = "Nikhilrsingh";
const REPO_NAME = "car-transport-service";
const API_BASE = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;

// Project Lead to exclude from contributors list
const PROJECT_LEAD = "nikhilrsingh"; // GitHub username in lowercase

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

document.addEventListener('DOMContentLoaded', () => {
    initData();
    fetchRecentActivity();
    setupEventListeners();
});

// 1. Data Fetching & Initialization
async function initData() {
    const grid = document.getElementById('contributorsList');
    const errorMessage = document.getElementById('errorMessage');
    
    try {
        // Show loading spinner
        document.getElementById('spinner').style.display = 'flex';
        if(grid) grid.innerHTML = '';
        if(errorMessage) errorMessage.innerText = '';

        // Parallel Fetch
        const [repoRes, contributorsRes] = await Promise.all([
            fetch(API_BASE),
            fetch(`${API_BASE}/contributors?per_page=100`)
        ]);

        if (!repoRes.ok || !contributorsRes.ok) throw new Error("API Limit Exceeded or Network Error");

        const repoData = await repoRes.json();
        const rawContributors = await contributorsRes.json();

        // Fetch Pull Requests to calculate points
        const rawPulls = await fetchAllPulls();

        processData(repoData, rawContributors, rawPulls);

    } catch (error) {
        console.error('Error initializing data:', error);
        document.getElementById('spinner').style.display = 'none';
        if(grid) grid.innerHTML = '';
        if(errorMessage) errorMessage.innerText = 'Failed to load data. GitHub API limit may be exceeded. Please try again later.';
    }
}

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

// 2. Data Processing
function processData(repoData, contributors, pulls) {
    const statsMap = {};
    let totalProjectPRs = 0;
    let totalProjectPoints = 0;
    let totalProjectCommits = 0;

    // A. Calculate Points from PRs
    pulls.forEach(pr => {
        if (!pr.merged_at) return; 

        const user = pr.user.login.toLowerCase();
        if (!statsMap[user]) statsMap[user] = { prs: 0, points: 0 };

        statsMap[user].prs++;
        totalProjectPRs++;

        let prPoints = 0;
        let hasLevel = false;

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

    // B. Filter out project lead and merge with profile data
    allContributors = contributors
        .filter(c => c.login.toLowerCase() !== PROJECT_LEAD) // EXCLUDE PROJECT LEAD
        .map(c => {
            const login = c.login.toLowerCase();
            const userStats = statsMap[login] || { prs: 0, points: 0 };
            
            totalProjectCommits += c.contributions;

            // If no PR points, give base points for commits
            let finalPoints = userStats.points;
            if (finalPoints === 0) {
                finalPoints = c.contributions * POINTS.COMMIT; 
            }

            return {
                login: c.login,
                id: c.id,
                avatar_url: c.avatar_url,
                html_url: c.html_url,
                contributions: c.contributions,
                prs: userStats.prs,
                points: finalPoints
            };
        });

    // C. Initial Sort
    allContributors.sort((a, b) => b.points - a.points);

    // D. Update Stats (exclude project lead from count)
    updateGlobalStats(
        contributors.length - 1, // Subtract 1 to exclude project lead
        totalProjectPRs,
        totalProjectPoints,
        repoData.stargazers_count,
        repoData.forks_count,
        totalProjectCommits
    );

    // E. Initialize Filtered Data & Render
    filteredContributors = [...allContributors];
    document.getElementById('spinner').style.display = 'none';
    renderContributors(1);
}

function updateGlobalStats(count, prs, points, stars, forks, commits) {
    safeSetText('totalContributors', count);
    safeSetText('totalCommits', commits);
    safeSetText('totalPRs', prs);
    safeSetText('totalPoints', points);
    safeSetText('totalStars', stars);
    safeSetText('totalForks', forks);
}

// 3. Event Listeners
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const sortBy = document.getElementById('sortBy');
    const filterLevel = document.getElementById('filterLevel');
    const refreshBtn = document.getElementById('refreshData');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => applyFilters(e.target.value, sortBy.value, filterLevel.value));
    }
    if (sortBy) {
        sortBy.addEventListener('change', (e) => applyFilters(searchInput.value, e.target.value, filterLevel.value));
    }
    if (filterLevel) {
        filterLevel.addEventListener('change', (e) => applyFilters(searchInput.value, sortBy.value, e.target.value));
    }
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            allContributors = [];
            initData();
        });
    }
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) { currentPage--; renderContributors(currentPage); }
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const maxPage = Math.ceil(filteredContributors.length / itemsPerPage);
            if (currentPage < maxPage) { currentPage++; renderContributors(currentPage); }
        });
    }
}

// 4. Filtering
function applyFilters(searchTerm, sortType, levelType) {
    let result = [...allContributors];

    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        result = result.filter(c => c.login.toLowerCase().includes(term));
    }

    if (levelType !== 'all') {
        result = result.filter(c => {
            const league = getLeagueData(c.points);
            if (levelType === 'top10') return true; 
            if (levelType === 'gold') return league.tier === 'tier-gold';
            if (levelType === 'silver') return league.tier === 'tier-silver';
            if (levelType === 'bronze') return league.tier === 'tier-bronze';
            if (levelType === 'new') return c.contributions < 5;
            return true;
        });
    }

    if (sortType === 'contributions') {
        result.sort((a, b) => b.points - a.points);
    } else if (sortType === 'alphabetical') {
        result.sort((a, b) => a.login.localeCompare(b.login));
    } else if (sortType === 'recent') {
        result.sort((a, b) => b.contributions - a.contributions);
    }

    if (levelType === 'top10') {
        result.sort((a, b) => b.points - a.points);
        result = result.slice(0, 10);
    }

    filteredContributors = result;
    currentPage = 1;
    renderContributors(1);
}

// NEW FUNCTION: Get global rank from full leaderboard
function getGlobalRank(contributor) {
    // Find the contributor's position in the FULL allContributors array
    // This ensures rank stays consistent regardless of filters
    const sortedByPoints = [...allContributors].sort((a, b) => b.points - a.points);
    return sortedByPoints.findIndex(c => c.id === contributor.id) + 1;
}

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
        const rank = getGlobalRank(c); 
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
                 <i class="fas fa-code-branch" style="color:#4a90e2"></i> ${c.prs} PRs
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
    
    const prev = document.getElementById('prevPage');
    const next = document.getElementById('nextPage');
    if(prev) {
        prev.disabled = currentPage === 1;
        prev.style.opacity = currentPage === 1 ? '0.5' : '1';
    }
    if(next) {
        next.disabled = currentPage === maxPage;
        next.style.opacity = currentPage === maxPage ? '0.5' : '1';
    }
}

// 6. Modal & Utilities
function getLeagueData(points) {
    if (points > 150) return { text: 'Gold 🏆', class: 'badge-gold', tier: 'tier-gold', label: 'Gold League' };
    if (points > 75) return { text: 'Silver 🥈', class: 'badge-silver', tier: 'tier-silver', label: 'Silver League' };
    if (points > 30) return { text: 'Bronze 🥉', class: 'badge-bronze', tier: 'tier-bronze', label: 'Bronze League' };
    return { text: 'Contributor', class: 'badge-contributor', tier: 'tier-contributor', label: 'Contributor' };
}

function openContributorModal(c, league, rank) {
    const modal = document.getElementById('contributorModal');
    if (!modal) return;

    document.getElementById('modalAvatar').src = c.avatar_url;
    document.getElementById('modalName').textContent = c.login;
    document.getElementById('modalGithubLink').href = c.html_url;
    
    safeSetText('modalRank', `#${rank}`);
    safeSetText('modalPoints', c.points);
    safeSetText('modalLeague', league.label);
    safeSetText('modalCommits', c.contributions);
    safeSetText('modalPRs', c.prs);

    const prLink = document.getElementById('viewPrBtn');
    if(prLink) prLink.href = `https://github.com/${REPO_OWNER}/${REPO_NAME}/pulls?q=is%3Apr+author%3A${c.login}`;

    modal.classList.add('active');
}

document.querySelector('.modal-close')?.addEventListener('click', () => {
    document.getElementById('contributorModal')?.classList.remove('active');
});
window.onclick = (e) => {
    const modal = document.getElementById('contributorModal');
    if (e.target === modal) modal.classList.remove('active');
};

function safeSetText(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
}

// 7. Recent Activity
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
