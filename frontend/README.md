# Frontend

> Car Transport Service - Frontend Application

## 🌐 Live Website

The frontend is a static website built with HTML, CSS, and JavaScript.

## 🌟 Open Source Participation

| Program | Program Name | Start Date | End Date |
|--------|--------------|------------|----------|
| ![SWOC](frontend/assets/images/swoc.png) | **Social Winter of Code (SWOC)** | 1 January 2026 | 1 March 2026 |


## 🚀 Quick Start

### Option 1: Open Directly
Simply open `index.html` in your web browser:
- Navigate to the `frontend` folder
- Double-click `index.html`
- Or right-click → "Open with" → Choose your browser

### Option 2: Use Live Server (Recommended)

#### Using VS Code
1. Install "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"
4. Website opens at `http://localhost:5500`

#### Using Python
```bash
# Navigate to frontend directory
cd frontend

# Python 3
python -m http.server 8000

# Open browser to http://localhost:8000
```

#### Using Node.js
```bash
# Install http-server globally
npm install -g http-server

# Navigate to frontend directory
cd frontend

# Run server
http-server -p 8000

# Open browser to http://localhost:8000
```

## 📁 Structure

```
frontend/
├── index.html          # Main landing page
├── services.html       # Services listing
├── login.html          # Authentication page
├── pages/              # Additional pages
├── assets/             # Static assets
├── components/         # Reusable components
├── css/                # Stylesheets
└── js/                 # JavaScript files
```

## 🎨 Features

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark/Light theme toggle
- ✅ Interactive booking form
- ✅ Real-time price calculator
- ✅ Vehicle tracking interface
- ✅ Contact forms with validation
- ✅ Image gallery
- ✅ Customer testimonials
- ✅ Region-wise service map
- ✅ FAQ section

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling, Flexbox, Grid
- **JavaScript (ES6+)** - Interactive functionality
- **Font Awesome** - Icons
- **Leaflet.js** - Interactive maps
- **Lottie** - Animations

## 📱 Pages Available

### Main Pages
- `/index.html` - Home page
- `/services.html` - Services overview
- `/login.html` - Login/Signup

### Sub Pages (in `/pages/`)
- `about.html` - About us
- `booking.html` - Vehicle booking form
- `contact.html` - Contact information
- `pricing.html` - Pricing plans
- `pricing-calculator.html` - Price calculator
- `tracking.html` - Track shipment
- `gallery.html` - Image gallery
- `how-it-works.html` - Process explanation
- `faq.html` - Frequently asked questions
- `careers.html` - Job opportunities
- `contributors.html` - Project contributors
- `emergency-support.html` - Emergency contact
- `our-network.html` - Service network
- `press-media.html` - Media coverage
- `privacy-policy.html` - Privacy policy
- `Terms of Services.html` - Terms and conditions
- `enquiry.html` - General enquiry
- `city.html` - City-specific services
- `blog.html` - Blog listing
- `blog-post.html` - Individual blog post

## 🎨 Customization

### Colors
Colors are defined in CSS custom properties. Edit `css/light-mode.css` and `css/dark-mode.css`:

```css
:root {
  --primary-color: #ff6b35;
  --secondary-color: #004e89;
  /* Add more variables */
}
```

### Adding New Pages
1. Create new HTML file in `pages/` directory
2. Copy structure from existing page
3. Update navigation in `components/navbar.html`
4. Follow design guidelines in [DESIGN_GUIDELINES.md](../docs/DESIGN_GUIDELINES.md)

## 🔧 Development

### Code Style
- Use 2 spaces for indentation
- Semantic HTML5 elements
- BEM methodology for CSS classes
- ES6+ JavaScript features
- Comment complex code sections

### File Organization
- CSS: One file per component in `css/components/`
- JS: Modular approach in `js/modules/`
- Images: Optimize before adding to `assets/images/`

### Best Practices
- Mobile-first responsive design
- Accessibility (ARIA labels, semantic HTML)
- Performance optimization (lazy loading, minification)
- Cross-browser compatibility

## 🐛 Known Issues

None currently. Report issues on [GitHub Issues](https://github.com/amanizulfi/car-transport-service/issues).

## 📝 Future Enhancements

- [ ] Progressive Web App (PWA)
- [ ] Multi-language support
- [ ] Advanced animations
- [ ] Service worker for offline support
- [ ] WebP image format support
- [ ] Skeleton loading states

See [ROADMAP.md](../docs/ROADMAP.md) for complete roadmap.

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](../docs/CONTRIBUTING.md) for guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

**Need Help?** Open an issue or contact the maintainers.
