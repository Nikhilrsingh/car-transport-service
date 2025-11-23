// GitHub Repository Configuration
const REPO_OWNER = "Nikhilrsingh";
const REPO_NAME = "car-transport-service";
const API_BASE = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;

// State
let contributorsData = []; 
let currentPage = 1;
const itemsPerPage = 12; 

// Point System Weights (Strict PR Logic)
const POINTS = {
    L3: 11,
    L2: 5,
    L1: 2,
    DEFAULT: 1
};

document.addEventListener('DOMContentLoaded', () => {
    initData();
    fetchRecentActivity();
});

// 1. Master Initialization Function
async function initData() {
    try {
        // Show loading state
        const grid = document.getElementById('contributorsList');
        if(grid) grid.innerHTML = '<div id="spinner" style="display:flex"><div class="spinner-circle"></div></div>';

        // Fetch Repo Info, Contributors, and Pull Requests (last 100)
        const [repoRes, contributorsRes] = await Promise.all([
            fetch(API_BASE),
            fetch(`${API_BASE}/contributors?per_page=100`)
        ]);

        const repoData = await repoRes.json();
        const rawContributors = await contributorsRes.json();
        
        // Fetch Pull Requests (Recursive) to capture history
        const rawPulls = await fetchAllPulls();

        processData(repoData, rawContributors, rawPulls);

    } catch (error) {
        console.error('Error initializing data:', error);
        document.getElementById('contributorsList').innerHTML = '<p id="errorMessage">Failed to load data. Please try again later.</p>';
    }
}

// Helper: Fetch up to 300 PRs
async function fetchAllPulls() {
    let pulls = [];
    let page = 1;
    while (page <= 3) {
        try {
            const res = await fetch(`${API_BASE}/pulls?state=all&per_page=100&page=${page}`);
            const data = await res.json();
            if (!data.length) break;
            pulls = pulls.concat(data);
            page++;
        } catch (e) { break; }
    }
    return pulls;
}

// 2. Process & Merge Data
function processData(repoData, contributors, pulls) {
    const statsMap = {};
    let totalProjectPRs = 0;
    let totalProjectPoints = 0;
    let totalProjectCommits = 0;

    // A. Calculate Points from PRs
    pulls.forEach(pr => {
        if (!pr.merged_at) return; 

        const user = pr.user.login;
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

    // B. Merge with Contributor Profile Data
    contributorsData = contributors.map(c => {
        const login = c.login;
        const userStats = statsMap[login] || { prs: 0, points: 0 };
        
        // Strict Point Calculation (No Commits Added)
        const totalScore = userStats.points;
        totalProjectCommits += c.contributions;

        return {
            login: c.login,
            id: c.id,
            avatar_url: c.avatar_url,
            html_url: c.html_url,
            contributions: c.contributions,
            prs: userStats.prs,
            points: totalScore 
        };
    });

    // C. Filter & Sort
    // RULE: Remove Lead AND Remove Contributors with 0 PRs
    contributorsData = contributorsData
        .filter(c => 
            c.login.toLowerCase() !== REPO_OWNER.toLowerCase() && 
            c.prs > 0 // <--- NEW CONDITION: Must have at least 1 PR
        )
        .sort((a, b) => b.points - a.points); 

    // D. Update DOM Stats
    updateGlobalStats(
        contributorsData.length, 
        totalProjectPRs, 
        totalProjectPoints, 
        repoData.stargazers_count, 
        repoData.forks_count,
        totalProjectCommits
    );

    // E. Render Grid
    renderContributors(1);
}

function updateGlobalStats(count, prs, points, stars, forks, commits) {
    safeSetText('totalContributors', count);
    safeSetText('totalPRs', prs);
    safeSetText('totalPoints', points);
    safeSetText('totalStars', stars);
    safeSetText('totalForks', forks);
    
    const displayCommits = commits > 1000 ? "1000+" : commits;
    safeSetText('totalCommits', displayCommits);
}

function safeSetText(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
}

// 3. Get League/Badge Data
function getLeagueData(points) {
    if (points > 150) return { text: 'Gold 🏆', class: 'badge-gold', tier: 'tier-gold', label: 'Gold League' };
    if (points > 75) return { text: 'Silver 🥈', class: 'badge-silver', tier: 'tier-silver', label: 'Silver League' };
    if (points > 30) return { text: 'Bronze 🥉', class: 'badge-bronze', tier: 'tier-bronze', label: 'Bronze League' };
    return { text: 'Contributor 🚀', class: 'badge-contributor', tier: 'tier-contributor', label: 'Contributor' };
}

// 4. Render Grid
function renderContributors(page) {
    const grid = document.getElementById('contributorsList');
    if(!grid) return;
    grid.innerHTML = '';

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = contributorsData.slice(start, end);

    if (paginatedItems.length === 0) {
        grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;">No active contributors found.</p>';
        return;
    }

    paginatedItems.forEach((contributor, index) => {
        const globalRank = start + index + 1;
        const league = getLeagueData(contributor.points);

        const card = document.createElement('div');
        card.className = `contributor ${league.tier}`;
        
        // Click Event
        card.addEventListener('click', () => openContributorModal(contributor, league, globalRank));

        card.innerHTML = `
            <img src="${contributor.avatar_url}" alt="${contributor.login}">
            <span class="cont-name">${contributor.login}</span>
            <div class="contributor-badges">
                <span class="tier-badge ${league.class}">
                    ${league.text}
                </span>
            </div>
            <div class="contributor-stats">
                 PRs: ${contributor.prs} | Pts: ${contributor.points}
            </div>
        `;
        grid.appendChild(card);
    });

    updatePaginationUI();
}

function updatePaginationUI() {
    const maxPage = Math.ceil(contributorsData.length / itemsPerPage) || 1;
    safeSetText('currentPage', currentPage);
    safeSetText('totalPages', maxPage);
    
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    if(prevBtn) {
        prevBtn.onclick = () => {
            if (currentPage > 1) { currentPage--; renderContributors(currentPage); }
        };
        prevBtn.disabled = currentPage === 1;
    }
    if(nextBtn) {
        nextBtn.onclick = () => {
            if (currentPage < maxPage) { currentPage++; renderContributors(currentPage); }
        };
        nextBtn.disabled = currentPage === maxPage;
    }
}

// 5. Modal Logic
function openContributorModal(contributor, league, rank) {
    const modal = document.getElementById('contributorModal');
    if (!modal) return;

    document.getElementById('modalAvatar').src = contributor.avatar_url;
    document.getElementById('modalName').textContent = contributor.login;
    
    // Using safeSetText to populate existing IDs or fallbacks
    safeSetText('modalRank', `#${rank}`);
    safeSetText('modalPoints', contributor.points);
    safeSetText('modalLeague', league.label);
    safeSetText('modalCommits', contributor.contributions);
    safeSetText('modalPRs', contributor.prs);

    const prLink = `https://github.com/${REPO_OWNER}/${REPO_NAME}/pulls?q=is%3Apr+author%3A${contributor.login}`;
    const viewPrBtn = document.getElementById('viewPrBtn');
    if(viewPrBtn) viewPrBtn.href = prLink;
    
    const ghLink = document.getElementById('modalGithubLink');
    if(ghLink) ghLink.href = contributor.html_url;

    modal.classList.add('active');
}

// Close Modal
document.querySelector('.modal-close')?.addEventListener('click', () => {
    document.getElementById('contributorModal')?.classList.remove('active');
});
window.onclick = (e) => {
    const modal = document.getElementById('contributorModal');
    if (e.target === modal) modal.classList.remove('active');
};

// 6. Recent Activity
async function fetchRecentActivity() {
    try {
        const response = await fetch(`${API_BASE}/commits?per_page=10`);
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
    } catch (e) { console.error(e); }
}