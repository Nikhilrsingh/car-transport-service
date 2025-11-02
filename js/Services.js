
      // Services Section Functionality
      document.addEventListener('DOMContentLoaded', function () {
        // Service button clicks
        const serviceButtons = document.querySelectorAll('.service-btn');
        serviceButtons.forEach(button => {
          button.addEventListener('click', function () {
            const service = this.getAttribute('data-service');
            const serviceName = this.closest('.service-card').querySelector('h3').textContent;

            // Show service modal or redirect
            alert(`Thank you for your interest in our ${serviceName} service! Our team will contact you shortly.`);

            // You can replace this with actual modal or redirect logic
            // window.location.href = `contact.html?service=${service}`;
          });
        });

        // Animated counter for stats
        const statNumbers = document.querySelectorAll('.stat-number');

        const animateValue = (element, start, end, duration) => {
          let startTimestamp = null;
          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value + (element.getAttribute('data-target') === '98' ? '%' : '+');
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
        };

        // Intersection Observer for stats animation
        const statsObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                animateValue(stat, 0, target, 2000);
              });
              statsObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.5 });

        statsObserver.observe(document.querySelector('.service-stats'));

        // Hover effects for service cards
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
          card.addEventListener('mouseenter', function () {
            this.style.zIndex = '10';
          });

          card.addEventListener('mouseleave', function () {
            this.style.zIndex = '1';
          });
        });
      });