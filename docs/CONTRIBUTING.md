# Contributing to Car Transport Service

First off, thank you for considering contributing to Car Transport Service! 🎉

## 📋 Table of Contents
- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Style Guidelines](#style-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs 🐛
- Use the GitHub issue tracker
- Check if the bug has already been reported
- Use the bug report template
- Include screenshots and error messages
- Describe the steps to reproduce

### Suggesting Enhancements 💡
- Use the feature request template
- Explain why this enhancement would be useful
- Provide examples of how it would work

### Pull Requests 🔧
- Fix bugs
- Add new features
- Improve documentation
- Enhance UI/UX
- Optimize performance

## Getting Started

### Prerequisites
- Basic knowledge of HTML, CSS, and JavaScript
- Git installed on your machine
- Code editor (VS Code recommended)

### Setup Instructions

1. **Fork the repository**
   ```bash
   Click the "Fork" button in the top right corner
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/car-transport-service.git
   cd car-transport-service
   ```

3. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Project Structure
```
frontend/          # All frontend code
├── index.html     # Main entry point
├── pages/         # All HTML pages
├── css/           # Stylesheets
├── js/            # JavaScript files
├── assets/        # Images, icons, fonts
└── components/    # Reusable HTML components

backend/           # Backend code (planned)
docs/              # Documentation
scripts/           # Build/deployment scripts
```

### Making Changes

1. **Before you start**
   - Create an issue first
   - Wait for assignment from maintainers
   - Discuss your approach if needed

2. **While coding**
   - Follow the style guidelines
   - Test your changes thoroughly
   - Keep commits atomic and focused
   - Write meaningful commit messages

3. **Testing your changes**
   - Test on multiple browsers (Chrome, Firefox, Safari)
   - Test on mobile devices
   - Ensure no broken links
   - Validate HTML/CSS

## Style Guidelines

### HTML
- Use semantic HTML5 elements
- Proper indentation (2 spaces)
- Include alt text for images
- Use meaningful class names

### CSS
- Follow BEM naming convention when possible
- Use CSS variables for colors and spacing
- Mobile-first responsive design
- Comment complex styles

### JavaScript
- Use modern ES6+ syntax
- Meaningful variable and function names
- Add comments for complex logic
- Avoid global variables

### File Naming
- Use lowercase with hyphens: `booking-form.html`
- Be descriptive: `hero-animations.js` not `anim.js`

## Commit Guidelines

### Commit Message Format
```
<type>: <subject>

<body (optional)>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples
```bash
feat: add booking confirmation page
fix: resolve navbar overflow on mobile
docs: update README with setup instructions
style: improve button hover animations
```

## Pull Request Process

### Before Submitting

1. **Update your branch**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Test thoroughly**
   - All pages load correctly
   - No console errors
   - Links work properly
   - Responsive on all devices

3. **Self-review**
   - Review your own code
   - Remove console.logs
   - Check for typos
   - Ensure proper formatting

### Submitting PR

1. **Push your changes**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request**
   - Use the PR template
   - Link related issues
   - Add screenshots for UI changes
   - Describe what you changed and why

3. **PR Title Format**
   ```
   [Type] Brief description of changes
   ```
   Example: `[Feature] Add vehicle tracking page`

### After Submitting

- Respond to review comments promptly
- Make requested changes
- Keep PR updated with main branch
- Be patient and respectful

## Review Process

- Maintainers will review your PR
- May request changes or improvements
- CI checks must pass
- At least one approval required
- Maintainer will merge when ready

## Recognition

Contributors will be:
- Added to the Contributors section in README
- Credited in release notes
- Eligible for contributor badge

## Questions?

- Create an issue with the `question` label
- Join our discussions
- Contact maintainers

## Thank You! 🙏

Your contributions make this project better for everyone. We appreciate your time and effort!

---

Happy Contributing! 🚀
