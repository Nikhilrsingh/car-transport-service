// ==== CONFIG ====
const REPO_OWNER = "Nikhilrsingh"; // change to your repo owner
const REPO_NAME = "car-transport-service"; // change to your repo name
const GITHUB_TOKEN = ""; // optional  

// ==== GLOBAL STATE ====
let allContributors = [];
let currentPage = 1;
const contributorsPerPage = 10;

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
    console.log("📡 Fetching contributors...");
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contributors?per_page=100`;
    const contributors = await fetchWithAuth(url);

    if (!Array.isArray(contributors)) {
      throw new Error("Invalid contributors response");
    }

    allContributors = contributors
    .filter((c) => c.login.toLowerCase() !== "nikhilrsingh") // Exclude project lead
    .map((c) => ({
      login: c.login,
      avatar_url: c.avatar_url,
      html_url: c.html_url,
      contributions: c.contributions,
    }));
    

    console.log(`✅ Loaded ${allContributors.length} contributors`);
    updateStats();
    displayContributors();
  } catch (err) {
    console.error("❌ Failed to load contributors:", err);
    safeSetText(
      "errorMessage",
      "Failed to load contributors. Check console for details."
    );
  }finally{
    hideSpinner();
  }
}

// ==== DISPLAY CONTRIBUTORS ====
function displayContributors() {
  const list = document.getElementById("contributorsList");
  if (!list) {
    console.warn("⚠️ Missing element with id='contributorsList'");
    return;
  }

  list.innerHTML = "";

  const start = (currentPage - 1) * contributorsPerPage;
  const end = start + contributorsPerPage;
  const pageContributors = allContributors.slice(start, end);

  for (const c of pageContributors) {
    const item = document.createElement("div");
    item.className = "contributor";
    item.innerHTML = `
      <img src="${c.avatar_url}" alt="${c.login}" width="50" height="50">
      <a href="${c.html_url}" target="_blank">${c.login}</a>
      <span>Commits: ${c.contributions}</span>
    `;
    list.appendChild(item);
  }

  safeSetText("currentPage", currentPage);
  safeSetText(
    "totalPages",
    Math.ceil(allContributors.length / contributorsPerPage)
  );
}

// ==== UPDATE STATS ====
function updateStats() {
  safeSetText("totalContributors", allContributors.length);
  const totalCommits = allContributors.reduce(
    (sum, c) => sum + c.contributions,
    0
  );
  safeSetText("totalCommits", totalCommits);
}

// ==== PAGINATION ====
function nextPage() {
  if (currentPage < Math.ceil(allContributors.length / contributorsPerPage)) {
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
  const filtered = allContributors.filter((c) =>
    c.login.toLowerCase().includes(term.toLowerCase())
  );

  const list = document.getElementById("contributorsList");
  if (!list) return;
  list.innerHTML = "";

  for (const c of filtered) {
    const item = document.createElement("div");
    item.className = "contributor";
    item.innerHTML = `
      <img src="${c.avatar_url}" alt="${c.login}" width="50" height="50">
      <a href="${c.html_url}" target="_blank">${c.login}</a>
      <span>Commits: ${c.contributions}</span>
    `;
    list.appendChild(item);
  }
}

// ==== SETUP EVENT LISTENERS ====
function setupEventListeners() {
  const nextBtn = document.getElementById("nextPage");
  const prevBtn = document.getElementById("prevPage");
  const searchInput = document.getElementById("searchInput");

  if (nextBtn) nextBtn.addEventListener("click", nextPage);
  if (prevBtn) prevBtn.addEventListener("click", prevPage);
  if (searchInput)
    searchInput.addEventListener("input", (e) =>
      searchContributors(e.target.value)
    );
}

// ==== INIT ====
fetchContributors();
setupEventListeners();
