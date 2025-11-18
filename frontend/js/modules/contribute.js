// ==== CONFIG ====
const REPO_OWNER = "Nikhilrsingh"; // change to your repo owner
const REPO_NAME = "car-transport-service"; // change to your repo name
const GITHUB_TOKEN = ""; // optional  
const CACHE_TTL_MS = 10 * 60 * 1000;
function cacheKey(k){return `cts_${REPO_OWNER}_${REPO_NAME}_${k}`;}
function cacheGet(k){try{const raw=localStorage.getItem(cacheKey(k));if(!raw) return null;const obj=JSON.parse(raw);if(Date.now()-obj.ts>obj.ttl) return null;return obj.data;}catch{return null;}}
function cacheSet(k,data,ttl=CACHE_TTL_MS){try{localStorage.setItem(cacheKey(k),JSON.stringify({ts:Date.now(),ttl,data}));}catch{}}
function cacheClear(){['contributors','commits'].forEach(k=>localStorage.removeItem(cacheKey(k)));}

// ==== GLOBAL STATE ====
let allContributors = [];
let visibleContributors = [];
let currentPage = 1;
const contributorsPerPage = 10;
const LEVELS = { gold: 50, silver: 20, bronze: 10, contributor: 1 };

// ==== UTIL ====
function safeSetText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
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

// Optional: integrate with your fetchContributors()
// Call this before fetch starts
window.showSpinner = () => {
  spinner.style.display = "flex";
  list.style.display = "none";
};

// Call this after data loads
window.hideSpinner = () => {
  spinner.style.display = "none";
  list.style.display = "grid";
};

// ==== FETCH CONTRIBUTORS ====
async function fetchContributors() {
  try {
    showSpinner();
    const cachedList = cacheGet('contributors');
    if (cachedList && Array.isArray(cachedList)) {
      allContributors = cachedList;
      visibleContributors = [...allContributors];
      updateStats();
      displayContributors();
      loadRecentActivity();
      return;
    }
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contributors?per_page=100`;
    const contributors = await fetchWithAuth(url);
    if (!Array.isArray(contributors)) throw new Error("Invalid contributors response");
    const exclude = "nikhilrsingh";
    allContributors = contributors
      .filter(c => c.login.toLowerCase() !== exclude)
      .map(c => ({ login: c.login, avatar_url: c.avatar_url, html_url: c.html_url, contributions: c.contributions }));
    let stats = await fetchWithAuth(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/stats/contributors`);
    const statsMap = {};
    if (Array.isArray(stats)) {
      stats.forEach(s => {
        const login = s.author?.login;
        if (login) {
          const adds = s.weeks.reduce((a,w)=>a+(w.a||0),0);
          const dels = s.weeks.reduce((a,w)=>a+(w.d||0),0);
          const recent = s.weeks.slice(-12).reduce((a,w)=>a+(w.c||0),0);
          statsMap[login] = { additions:adds, deletions:dels, recentCommits:recent, weeks:s.weeks };
        }
      });
      allContributors = allContributors.map(c => ({...c, ...(statsMap[c.login]||{additions:0,deletions:0,recentCommits:0,weeks:[]})}));
    }
    visibleContributors = [...allContributors];
    cacheSet('contributors', allContributors);
    updateStats();
    displayContributors();
    loadRecentActivity();
  } catch (err) {
    const fallback = cacheGet('contributors');
    if (fallback) {
      allContributors = fallback;
      visibleContributors = [...allContributors];
      updateStats();
      displayContributors();
      loadRecentActivity();
    } else {
      safeSetText("errorMessage","Failed to load contributors. Check console for details.");
    }
  } finally {
    hideSpinner();
  }
}

// ==== DISPLAY CONTRIBUTORS ====
function displayContributors() {
  const list = document.getElementById("contributorsList");
  if (!list) return;
  list.innerHTML = "";
  const start = (currentPage - 1) * contributorsPerPage;
  const end = start + contributorsPerPage;
  const pageContributors = visibleContributors.slice(start, end);
  for (const c of pageContributors) {
    const item = document.createElement("div");
    item.className = "contributor";
    item.innerHTML = `<img src="${c.avatar_url}" alt="${c.login}" width="50" height="50"><a href="${c.html_url}" target="_blank">${c.login}</a><span>Commits: ${c.contributions}</span>`;
    item.addEventListener("click", () => openContributorModal(c));
    list.appendChild(item);
  }
  safeSetText("currentPage", currentPage);
  safeSetText("totalPages", Math.max(1, Math.ceil(visibleContributors.length / contributorsPerPage)));
}

// ==== UPDATE STATS ====
function updateStats() {
  safeSetText("totalContributors", allContributors.length);
  const totalCommits = allContributors.reduce((s,c)=>s+c.contributions,0);
  safeSetText("totalCommits", totalCommits);
  const totalPoints = allContributors.reduce((s,c)=>s + c.contributions + Math.round(((c.additions||0)-(c.deletions||0))/100),0);
  safeSetText("totalPoints", totalPoints);
  const active = allContributors.filter(c => (c.recentCommits||0)>0).length;
  safeSetText("activeContributors", active);
}
function applyFilters() {
  const term = (document.getElementById("searchInput")?.value || "").toLowerCase();
  const sortBy = document.getElementById("sortBy")?.value || "contributions";
  const level = document.getElementById("filterLevel")?.value || "all";
  let filtered = allContributors.filter(c => c.login.toLowerCase().includes(term));
  if (level === "top10") {
    filtered = filtered.sort((a,b)=>b.contributions-a.contributions).slice(0,10);
  } else if (level === "gold") {
    filtered = filtered.filter(c => c.contributions >= LEVELS.gold);
  } else if (level === "silver") {
    filtered = filtered.filter(c => c.contributions >= LEVELS.silver && c.contributions < LEVELS.gold);
  } else if (level === "bronze") {
    filtered = filtered.filter(c => c.contributions >= LEVELS.bronze && c.contributions < LEVELS.silver);
  } else if (level === "contributor") {
    filtered = filtered.filter(c => c.contributions >= LEVELS.contributor && c.contributions < LEVELS.bronze);
  } else if (level === "new") {
    filtered = filtered.filter(c => c.contributions <= 1);
  }
  if (sortBy === "alphabetical") {
    filtered.sort((a,b)=>a.login.localeCompare(b.login));
  } else if (sortBy === "recent") {
    filtered.sort((a,b)=> (b.recentCommits||0)-(a.recentCommits||0));
  } else {
    filtered.sort((a,b)=>b.contributions-a.contributions);
  }
  visibleContributors = filtered;
  currentPage = 1;
  displayContributors();
}

// ==== PAGINATION ====
function nextPage() {
  if (currentPage < Math.ceil(visibleContributors.length / contributorsPerPage)) {
    currentPage++;
    displayContributors();
  }
}
function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    displayContributors();
  }
}

// ==== SEARCH ====
function searchContributors(term) {
  applyFilters();
}

// ==== SETUP EVENT LISTENERS ====
function setupEventListeners() {
  const nextBtn = document.getElementById("nextPage");
  const prevBtn = document.getElementById("prevPage");
  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortBy");
  const levelSelect = document.getElementById("filterLevel");
  const closeBtn = document.querySelector(".modal-close");
  const refreshBtn = document.getElementById("refreshData");
  if (nextBtn) nextBtn.addEventListener("click", nextPage);
  if (prevBtn) prevBtn.addEventListener("click", prevPage);
  if (searchInput) searchInput.addEventListener("input", applyFilters);
  if (sortSelect) sortSelect.addEventListener("change", applyFilters);
  if (levelSelect) levelSelect.addEventListener("change", applyFilters);
  if (closeBtn) closeBtn.addEventListener("click", () => {
    document.getElementById("contributorModal")?.classList.remove("active");
  });
  document.addEventListener("click", e => {
    if (e.target.id === "contributorModal") e.target.classList.remove("active");
  });
  if (refreshBtn) refreshBtn.addEventListener("click", () => { cacheClear(); currentPage = 1; fetchContributors().then(()=>applyFilters()); });
}
function openContributorModal(c) {
  document.getElementById("modalAvatar").src = c.avatar_url;
  document.getElementById("modalName").textContent = c.login;
  const link = document.getElementById("modalGithubLink");
  if (link) link.href = c.html_url;
  const badges = document.getElementById("modalBadges");
  if (badges) {
    badges.innerHTML = "";
    if (c.contributions >= LEVELS.gold) badges.innerHTML += "🥇 Gold";
    else if (c.contributions >= LEVELS.silver) badges.innerHTML += "🥈 Silver";
    else if (c.contributions >= LEVELS.bronze) badges.innerHTML += "🥉 Bronze";
    else if (c.contributions >= 1) badges.innerHTML += "⭐ Contributor";
  }
  safeSetText("modalCommits", c.contributions);
  safeSetText("modalAdditions", (c.additions||0));
  safeSetText("modalDeletions", (c.deletions||0));
  fetchWithAuth(`https://api.github.com/search/issues?q=repo:${REPO_OWNER}/${REPO_NAME}+is:pr+author:${c.login}`)
    .then(res => {
      const count = typeof res.total_count === "number" ? res.total_count : 0;
      safeSetText("modalPRs", count);
    }).catch(()=> safeSetText("modalPRs","0"));
  const heatmap = document.getElementById("contributionHeatmap");
  if (heatmap) {
    const cells = [];
    const totalWeeks = 52;
    for (let i=0;i<totalWeeks;i++) {
      const intensity = i < (c.recentCommits||0) ? "rgba(255,99,71,0.8)" : "rgba(255,255,255,0.2)";
      cells.push(`<span style="display:inline-block;width:8px;height:8px;margin:1px;background:${intensity}"></span>`);
    }
    heatmap.innerHTML = cells.join("");
  }
  document.getElementById("contributorModal")?.classList.add("active");
}
function loadRecentActivity() {
  const cached = cacheGet('commits');
  const container = document.getElementById("timelineContent");
  if (cached && container) {
    container.innerHTML = cached;
    return;
  }
  fetchWithAuth(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits?per_page=20`)
    .then(commits => {
      if (!container || !Array.isArray(commits)) return;
      const html = commits.map(c => {
        const msg = c.commit?.message || "";
        const author = c.author?.login || c.commit?.author?.name || "unknown";
        const date = c.commit?.author?.date ? new Date(c.commit.author.date).toLocaleString() : "";
        return `<div class=\"timeline-item\"><strong>${author}</strong> — ${msg} <span style=\"opacity:.7\">(${date})</span></div>`;
      }).join("");
      container.innerHTML = html;
      cacheSet('commits', html);
    }).catch(()=>{
      if (container && cached) container.innerHTML = cached;
    });
}

// ==== INIT ====
fetchContributors().then(()=>applyFilters());
setupEventListeners();
