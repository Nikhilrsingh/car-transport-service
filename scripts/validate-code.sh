#!/bin/bash

# 🛡️ Cargo Project Quality Guard
echo "🚀 Starting Quality Validation..."

# Initialize Report
REPORT="### 🛡️ Code Quality Report\n"
HAS_ERRORS=0

# Helper to add to report
add_to_report() {
    REPORT+="$1\n"
}

# 1. Structure Check
echo "📂 Checking file structure..."
if [ -d "./frontend" ]; then
    add_to_report "✅ **Structure**: Frontend directory found."
else
    add_to_report "❌ **Structure**: Frontend directory missing!"
    HAS_ERRORS=1
fi

# 2. Critical Files Check
CRITICAL_FILES=("frontend/index.html" "frontend/css/styles.css" "frontend/js/script.js")
for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists."
    else
        add_to_report "❌ **Missing File**: $file is missing!"
        HAS_ERRORS=1
    fi
done

# 3. Basic SEO & Accessibility Check (Simple Greps)
echo "🌐 Checking SEO & Accessibility..."
if grep -q "<title>" frontend/index.html; then
    add_to_report "✅ **SEO**: Page title tag found."
else
    add_to_report "⚠️ **SEO**: Missing <title> tag in index.html"
fi

if grep -q "<meta name=\"description\"" frontend/index.html; then
    add_to_report "✅ **SEO**: Meta description found."
else
    add_to_report "⚠️ **SEO**: Missing meta description."
fi

# Check for missing Alt tags in images
MISSING_ALT=$(grep -r "<img" frontend/pages/ --include="*.html" | grep -v "alt=" | wc -l)
if [ "$MISSING_ALT" -eq 0 ]; then
    add_to_report "✅ **A11y**: All images in pages/ have alt tags (or none found)."
else
    add_to_report "⚠️ **A11y**: Found $MISSING_ALT images missing alt tags in pages/ directory."
fi

# 4. Code Cleanliness (Check for leftover console.logs)
echo "🧹 Checking code cleanliness..."
LOGS_FOUND=$(grep -r "console.log" frontend/js/ --include="*.js" | wc -l)
if [ "$LOGS_FOUND" -gt 5 ]; then
    add_to_report "⚠️ **Cleanliness**: Found $LOGS_FOUND console.log statements. Consider cleaning up."
else
    add_to_report "✅ **Cleanliness**: Minimal console logs found."
fi

# Finalizing Report for GitHub Actions
if [ -n "$GITHUB_STEP_SUMMARY" ]; then
    echo -e "$REPORT" >> "$GITHUB_STEP_SUMMARY"
fi

# Final Status
if [ "$HAS_ERRORS" -eq 1 ]; then
    echo "❌ Validation failed. Check the report for details."
    exit 1
fi

echo "✨ All critical checks passed!"
exit 0
