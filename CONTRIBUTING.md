# Contributing to Car Transport Service

Thank you for considering contributing!

## How to Contribute
- Star the repo ⭐
- Fork the repository
- Create a new branch `feature-branch-name`
- Commit your changes with clear messages
- Submit a Pull Request

## Code Guidelines
- Follow clean code principles
- Add comments where needed
- Keep commit messages meaningful

# ==========================================================
# CONTRIBUTION WORKFLOW GUIDE
# ==========================================================

## ------------------- SETUP -------------------

### 1. Clone your fork (only once per project):
```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
```

### 2. Add upstream (original repo, only once per project):
```bash
git remote add upstream https://github.com/<original-owner>/<repo-name>.git
```

---

## ------------------- UPDATE REPO -------------------

> ⚠️ Always run these commands **before starting any new work** to ensure your fork is up to date.

For `main` branch:
```bash
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

---

## ------------------- START NEW ISSUE / FEATURE -------------------

> Always create a new branch for each issue or feature.

```bash
git checkout -b fix-issue-123
```
*(Replace `fix-issue-123` with your issue/feature name.)*

---

## ------------------- WORKFLOW -------------------

After making code changes:

```bash
git add .
git commit -m "Fix: clear and descriptive message"
git push origin fix-issue-123
```

Then, open a **Pull Request (PR)** on GitHub to the original repository’s main branch.

---

## ------------------- CLEANUP AFTER MERGE -------------------

After your PR is merged:

### 1. Update your main branch again
```bash
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

### 2. Delete merged local branches (except main)
```bash
git branch --merged main | grep -v "main" | xargs git branch -d
```

### 3. Delete merged remote branches (except main)
```bash
git fetch --prune
git branch -r --merged main | grep origin | grep -v "main" | sed 's/origin\///' | xargs -I {} git push origin --delete {}
```

---

## ✅ Done!
Your local and remote repos are now clean and synced 🎉

---

### 💡 Notes:
- Always use **clear and descriptive commit messages**.
- Never push directly to the `main` branch.
- Use one branch per issue or feature.
- Ask for help if setup errors occur.

---

### ⚙️ Compatibility
✅ Works perfectly for:
- Windows, macOS, Linux  
- Repos using `main` 
- All GitHub-based workflows  
