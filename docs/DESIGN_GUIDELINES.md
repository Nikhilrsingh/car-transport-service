# Design Guidelines

> Visual design standards and UI/UX guidelines for Car Transport Service

## 🎨 Brand Identity

### Brand Name
**Harihar Car Carriers**

### Brand Values
- Trust & Reliability
- Safety & Security
- Speed & Efficiency
- Transparency
- Customer-Centric

---

## 🎨 Color Palette

### Primary Colors
```css
--primary-color: #ff6b35;      /* Primary Orange */
--primary-dark: #e85a2a;       /* Darker Orange */
--primary-light: #ff8c61;      /* Lighter Orange */
```

### Secondary Colors
```css
--secondary-color: #004e89;    /* Deep Blue */
--accent-color: #f7b731;       /* Gold/Yellow */
```

### Neutral Colors
```css
--dark-bg: #1a1a1a;           /* Dark Background */
--light-bg: #ffffff;          /* Light Background */
--gray-100: #f8f9fa;
--gray-200: #e9ecef;
--gray-300: #dee2e6;
--gray-700: #495057;
--gray-900: #212529;
```

### Semantic Colors
```css
--success: #28a745;           /* Green */
--warning: #ffc107;           /* Yellow */
--danger: #dc3545;            /* Red */
--info: #17a2b8;              /* Cyan */
```

### Usage Guidelines
- **Primary Orange**: CTA buttons, links, highlights
- **Deep Blue**: Headings, trust elements, navigation
- **Gold**: Premium features, badges, ratings
- **Dark/Light**: Backgrounds based on theme
- **Semantic**: Status indicators, alerts, notifications

---

## 📝 Typography

### Font Family
```css
font-family: 'Poppins', sans-serif;
```

### Font Weights
- Regular: 400 (body text)
- Medium: 500 (subheadings)
- Semi-Bold: 600 (emphasis)
- Bold: 700 (headings)

### Font Sizes
```css
/* Headings */
--h1: 3.5rem;    /* 56px */
--h2: 2.5rem;    /* 40px */
--h3: 2rem;      /* 32px */
--h4: 1.5rem;    /* 24px */
--h5: 1.25rem;   /* 20px */
--h6: 1rem;      /* 16px */

/* Body */
--body-large: 1.125rem;   /* 18px */
--body: 1rem;             /* 16px */
--body-small: 0.875rem;   /* 14px */
--caption: 0.75rem;       /* 12px */
```

### Line Height
```css
--line-height-tight: 1.2;
--line-height-normal: 1.5;
--line-height-relaxed: 1.8;
```

### Best Practices
- Use hierarchy: h1 > h2 > h3
- Maximum 2-3 font weights per page
- Maintain consistent spacing
- Ensure readability (minimum 16px for body)

---

## 🎯 Spacing System

### Spacing Scale (8px base)
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.5rem;    /* 24px */
--space-6: 2rem;      /* 32px */
--space-8: 3rem;      /* 48px */
--space-10: 4rem;     /* 64px */
--space-12: 6rem;     /* 96px */
```

### Container Widths
```css
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1400px;
```

---

## 🔘 Buttons

### Primary Button
```css
background: var(--primary-color);
color: white;
padding: 12px 32px;
border-radius: 8px;
font-weight: 600;
transition: all 0.3s ease;
```

### Secondary Button
```css
background: transparent;
color: var(--primary-color);
border: 2px solid var(--primary-color);
padding: 12px 32px;
border-radius: 8px;
```

### Button States
- **Hover**: Slightly darker, scale 1.05
- **Active**: Scale 0.95
- **Disabled**: Opacity 0.5, no hover
- **Loading**: Show spinner, disable interaction

### Button Sizes
- Large: 16px padding, 18px font
- Medium: 12px padding, 16px font (default)
- Small: 8px padding, 14px font

---

## 📦 Cards & Components

### Card Style
```css
background: white;
border-radius: 12px;
box-shadow: 0 4px 6px rgba(0,0,0,0.1);
padding: 24px;
transition: transform 0.3s, box-shadow 0.3s;
```

### Card Hover
```css
transform: translateY(-4px);
box-shadow: 0 8px 16px rgba(0,0,0,0.15);
```

### Border Radius
- Small: 4px (inputs, tags)
- Medium: 8px (buttons, badges)
- Large: 12px (cards, modals)
- Extra Large: 16px (hero sections)

---

## 🎭 Animations & Transitions

### Duration
```css
--transition-fast: 150ms;
--transition-normal: 300ms;
--transition-slow: 500ms;
```

### Easing
```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### Common Animations
- Fade In: opacity 0 → 1
- Slide Up: translateY(20px) → 0
- Scale: scale(0.95) → scale(1)
- Bounce: Use sparingly for success states

---

## 📱 Responsive Design

### Breakpoints
```css
--mobile: 320px;
--tablet: 768px;
--desktop: 1024px;
--wide: 1280px;
--ultra-wide: 1920px;
```

### Mobile-First Approach
- Design for mobile first
- Progressive enhancement for larger screens
- Touch-friendly targets (min 44px)
- Readable font sizes (min 16px)

### Grid System
- 12-column grid
- Flexible gutters (16px mobile, 24px desktop)
- Max content width: 1400px

---

## ♿ Accessibility

### Color Contrast
- AA Standard: 4.5:1 for normal text
- AAA Standard: 7:1 for normal text
- Large text: 3:1 minimum

### Focus States
```css
outline: 2px solid var(--primary-color);
outline-offset: 2px;
```

### Best Practices
- Semantic HTML
- Alt text for images
- ARIA labels where needed
- Keyboard navigation support
- Screen reader friendly

---

## 🖼️ Images & Icons

### Image Guidelines
- Use WebP format with fallbacks
- Optimize for web (compress)
- Lazy load below fold
- Aspect ratios: 16:9, 4:3, 1:1
- Alt text required

### Icons
- Font Awesome 6.4.0
- Consistent sizing (16px, 20px, 24px)
- Use semantic meanings
- Accessible labels

---

## 📋 Forms

### Input Fields
```css
border: 1px solid #dee2e6;
border-radius: 8px;
padding: 12px 16px;
font-size: 16px;
transition: border-color 0.3s;
```

### Input States
- **Focus**: border-color: primary
- **Error**: border-color: danger
- **Success**: border-color: success
- **Disabled**: opacity: 0.6

### Labels
- Always visible (no placeholder-only)
- Above or floating style
- Clear and concise

---

## 🎨 Dark Mode

### Color Adjustments
```css
/* Dark Mode */
--bg-primary: #1a1a1a;
--bg-secondary: #2b2b2b;
--text-primary: #ffffff;
--text-secondary: #b0b0b0;
```

### Implementation
- Use CSS custom properties
- Smooth theme transition
- Remember user preference
- Test all components in both modes

---

## ✨ Best Practices

### General
- Consistency is key
- Less is more (minimalism)
- White space is your friend
- Visual hierarchy matters
- Mobile-first always

### Performance
- Optimize images
- Minimize animations
- Lazy load content
- Use CSS over JavaScript when possible

### Usability
- Clear CTAs
- Intuitive navigation
- Fast loading
- Error prevention
- Helpful feedback

---

## 📚 Resources

### Tools
- [Adobe Color](https://color.adobe.com/) - Color palettes
- [Coolors](https://coolors.co/) - Color schemes
- [Font Pair](https://fontpair.co/) - Font combinations
- [WebAIM](https://webaim.org/resources/contrastchecker/) - Contrast checker

### Inspiration
- [Dribbble](https://dribbble.com/)
- [Behance](https://www.behance.net/)
- [Awwwards](https://www.awwwards.com/)

---

**Last Updated:** November 15, 2025  
**Version:** 1.0
