/**
 * About Page Enhanced Animations and Interactions
 * Handles flip cards, stats counter, timeline animations, and scroll reveals
 */

class AboutPageAnimations {
  constructor() {
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.setupFlipCards();
    this.setupStatsCounter();
    this.setupTimelineAnimations();
    this.setupValueCards();
    this.setupInfographics();
  }

  /**
   * Setup Intersection Observer for scroll-based animations
   */
  setupIntersectionObserver() {
    const options = {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed', 'animate');

          // Handle specific animations
          if (entry.target.classList.contains('stat-circle-item')) {
            this.animateStatCircle(entry.target);
          }

          if (entry.target.classList.contains('infographic-item')) {
            this.animateInfographic(entry.target);
          }

          if (entry.target.classList.contains('timeline-item')) {
            this.animateTimelineItem(entry.target);
          }
        }
      });
    }, options);

    // Observe all elements with reveal animation
    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
      this.observer.observe(el);
    });

    document.querySelectorAll('.stat-circle-item').forEach(el => {
      this.observer.observe(el);
    });

    document.querySelectorAll('.timeline-item').forEach(el => {
      this.observer.observe(el);
    });

    document.querySelectorAll('.infographic-item').forEach(el => {
      this.observer.observe(el);
    });
  }

  /**
   * Setup flip card animations for team members
   */
  setupFlipCards() {
    const flipCards = document.querySelectorAll('.about-team-flip-card');

    flipCards.forEach((card, index) => {
      // Animate skill bars on card hover or when in viewport
      card.addEventListener('mouseenter', () => {
        this.animateSkillBars(card);
      });

      // Trigger animation when card enters viewport
      const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate');
              this.animateSkillBars(entry.target);
            }, index * 150); // Stagger animation
            cardObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      cardObserver.observe(card);
    });
  }

  /**
   * Animate skill bars for a team member card
   */
  animateSkillBars(card) {
    if (card.classList.contains('skills-animated')) return;

    const skillBars = card.querySelectorAll('.about-skill-progress-bar');
    skillBars.forEach((bar, index) => {
      setTimeout(() => {
        bar.style.width = bar.getAttribute('data-skill-level') + '%';
      }, index * 100);
    });

    card.classList.add('skills-animated');
  }

  /**
   * Setup animated stats counter with SVG circular progress
   */
  setupStatsCounter() {
    const statItems = document.querySelectorAll('.stat-circle-item');

    statItems.forEach(item => {
      const targetElement = item.querySelector('.stat-number');
      const target = parseInt(targetElement.getAttribute('data-target'));
      const suffix = targetElement.getAttribute('data-suffix') || '';
      const prefix = targetElement.getAttribute('data-prefix') || '';

      // Calculate circle progress
      const maxValue = parseInt(targetElement.getAttribute('data-max')) || 100;
      const percentage = (target / maxValue) * 100;
      const circumference = 565.48;
      const offset = circumference - (percentage / 100) * circumference;

      item.style.setProperty('--progress-offset', offset);
    });
  }

  /**
   * Animate individual stat circle
   */
  animateStatCircle(item) {
    const targetElement = item.querySelector('.stat-number');
    const target = parseInt(targetElement.getAttribute('data-target'));
    const suffix = targetElement.getAttribute('data-suffix') || '';
    const prefix = targetElement.getAttribute('data-prefix') || '';
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepValue = target / steps;
    const stepDuration = duration / steps;

    let current = 0;
    const counter = setInterval(() => {
      current += stepValue;
      if (current >= target) {
        current = target;
        clearInterval(counter);
      }
      targetElement.textContent = prefix + Math.round(current) + suffix;
    }, stepDuration);
  }

  /**
   * Setup timeline animations
   */
  setupTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');

    timelineItems.forEach((item, index) => {
      item.style.transitionDelay = `${index * 0.2}s`;
    });
  }

  /**
   * Animate timeline item
   */
  animateTimelineItem(item) {
    // Add ripple effect
    const year = item.querySelector('.timeline-year');
    if (year) {
      year.style.animation = 'pulse 1s ease-out';
    }
  }

  /**
   * Setup value cards with icon morphing and tooltips
   */
  setupValueCards() {
    const valueCards = document.querySelectorAll('.value-card');

    valueCards.forEach(card => {
      const icon = card.querySelector('.value-icon-morph');

      if (icon) {
        // Add hover effect with rotation variations
        card.addEventListener('mouseenter', () => {
          const randomRotation = Math.random() * 360;
          icon.style.transform = `rotate(${randomRotation}deg)`;
        });

        card.addEventListener('mouseleave', () => {
          icon.style.transform = 'rotate(0deg)';
        });
      }
    });
  }

  /**
   * Setup and animate infographics
   */
  setupInfographics() {
    const infographicItems = document.querySelectorAll('.infographic-item');

    infographicItems.forEach(item => {
      const bar = item.querySelector('.infographic-bar-fill');
      if (bar) {
        const percentage = bar.getAttribute('data-percentage');
        item.style.setProperty('--bar-width', percentage + '%');
      }
    });
  }

  /**
   * Animate infographic bar
   */
  animateInfographic(item) {
    const bar = item.querySelector('.infographic-bar-fill');
    if (bar) {
      const percentage = bar.getAttribute('data-percentage');

      // Animate percentage counter
      const counter = bar.querySelector('.percentage-value');
      if (counter) {
        let current = 0;
        const target = parseInt(percentage);
        const duration = 2000;
        const steps = 50;
        const stepValue = target / steps;
        const stepDuration = duration / steps;

        const interval = setInterval(() => {
          current += stepValue;
          if (current >= target) {
            current = target;
            clearInterval(interval);
          }
          counter.textContent = Math.round(current) + '%';
        }, stepDuration);
      }
    }
  }
}

// Additional utility animations
const AboutAnimationUtils = {
  /**
   * Create pulse animation keyframes dynamically
   */
  addPulseAnimation() {
    if (!document.getElementById('pulse-keyframes')) {
      const style = document.createElement('style');
      style.id = 'pulse-keyframes';
      style.textContent = `
        @keyframes pulse {
          0% {
            box-shadow: 0 5px 20px rgba(255, 99, 71, 0.5);
          }
          50% {
            box-shadow: 0 10px 40px rgba(255, 99, 71, 0.8);
            transform: translate(-50%, -50%) scale(1.1);
          }
          100% {
            box-shadow: 0 5px 20px rgba(255, 99, 71, 0.5);
            transform: translate(-50%, -50%) scale(1);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  },

  /**
   * Add parallax effect to hero section
   */
  /*
    setupParallax() {
      const hero = document.querySelector('.hero');
      if (!hero) return;
  
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        hero.style.transform = `translateY(${parallax}px)`;
      });
    },
  */

  /**
   * Add confetti effect on milestone hover
   */
  addConfettiEffect(element) {
    const colors = ['#ff6347', '#ff4500', '#fff', '#ffa500'];
    const confettiCount = 20;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'absolute';
      confetti.style.width = '10px';
      confetti.style.height = '10px';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.top = '-20px';
      confetti.style.borderRadius = '50%';
      confetti.style.pointerEvents = 'none';
      confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;

      element.appendChild(confetti);

      setTimeout(() => confetti.remove(), 5000);
    }
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const aboutPage = new AboutPageAnimations();
  AboutAnimationUtils.addPulseAnimation();

  // Add confetti on milestone markers hover
  const milestoneMarkers = document.querySelectorAll('.milestone-marker');
  milestoneMarkers.forEach(marker => {
    marker.addEventListener('mouseenter', function () {
      AboutAnimationUtils.addConfettiEffect(this.parentElement);
    });
  });
});

// Sync performance metric percentage text with progress bar value
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".infographic-item").forEach(item => {
    const bar = item.querySelector(".infographic-bar-fill");
    const label = item.querySelector(".infographic-label .percentage-value");

    let percentage = bar.dataset.percentage || 0;
    percentage = Math.min(100, Math.max(0, percentage));

    bar.style.setProperty("--bar-width", percentage + "%");
    label.textContent = percentage + "%";
  });
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AboutPageAnimations, AboutAnimationUtils };
}
