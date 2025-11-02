    // Enhanced Hero Section Functionality
    document.addEventListener('DOMContentLoaded', function () {
      // Animated counters for stats
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
    }});

      // Start counters when hero section is in view
      const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            statNumbers.forEach(stat => {
              const target = parseInt(stat.getAttribute('data-target'));
              animateValue(stat, 0, target, 2000);
            });
            heroObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      heroObserver.observe(document.querySelector('.hero'));

      // Quick quote form functionality
      const quickQuoteForm = document.getElementById('quickQuoteForm');
      const quoteResult = document.getElementById('quoteResult');

      if (quickQuoteForm) {
        quickQuoteForm.addEventListener('submit', function (e) {
          e.preventDefault();

          const fromCity = document.getElementById('fromCity').value;
          const toCity = document.getElementById('toCity').value;
          const vehicleType = document.getElementById('vehicleType').value;

          if (fromCity && toCity && vehicleType) {
            // Simulate price calculation
            const basePrice = 5000;
            const distanceMultiplier = 1.2;
            const vehicleMultipliers = {
              hatchback: 1.0,
              sedan: 1.2,
              suv: 1.5,
              luxury: 2.0
            };

            const calculatedPrice = Math.floor(basePrice * distanceMultiplier * (vehicleMultipliers[vehicleType] || 1));
            const formattedPrice = calculatedPrice.toLocaleString('en-IN');

            document.querySelector('.amount').textContent = `₹${formattedPrice}`;
            quoteResult.style.display = 'block';

            // Smooth scroll to result
            quoteResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        });
      }

      // Parallax effect for background
      window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const video = document.querySelector('.hero-video');

        if (video) {
          video.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
      });

      // Smooth scroll for CTA buttons
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        });
      });

      // Video fallback for mobile
      const video = document.querySelector('.hero-video');
      if (video) {
        video.addEventListener('error', function () {
          this.style.display = 'none';
          document.querySelector('.hero-fallback').style.display = 'block';
        });
      }
