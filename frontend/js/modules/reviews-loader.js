document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("reviews-widget-container");
  if (!container) return; // Stop if container doesn't exist

  // 1. THE DATA (Embedded here so it never fails to load)
  const defaultTestimonials = [
        {
          // REVIEW 1
          pic: "https://lh3.googleusercontent.com/a-/ALV-UjWGX9pF307zMfmfJRRx1qY1i9AiZXHL4TaguJ080DNA7ivgZDcPsQ=w144-h144-p-rp-mo-br100", // Right-click their Google profile pic and 'Copy image address'
          product: "", // Leave blank, or paste an image address if they uploaded a photo of their car
          name: "VISHWAJEET SONUNE",
          stars: 5, // Change to 4 if they left a 4-star review
          message: "Rajesh ji assisted in transporting my car from Nagpur to Pune, and the service was both reliable and satisfactory. He was consistently helpful and always reachable over the phone. He ensured the car arrived safely without any damage. I’m truly grateful for his support and the quality of service provided.",
          time: "10 Nov 2023", // Paste the date they left the review
          comments: [
            { name: "Harihar Car Carriers (owner)", text: "Thankyou for your valuable feedback" }, // Optional owner reply
          ],
        },
        {
          // REVIEW 2
          pic: "https://lh3.googleusercontent.com/a-/ALV-UjVCUy400LvpBFYJ_4AnWejGQTdfeGjqauvK2viS_VTxHcYGvxPw=w144-h144-p-rp-mo-br100", 
          product: "", 
          name: "smita nande",
          stars: 5,
          message: "Mr Singh is really very helpful. They people helped me to bring my car to Ahmedabad.Earlier I was concerned for any damage but they assured me, they will take charge if anything happens in transit. Also they picked and dropped my car in 40 km radius. Thank you",
          time: "15 Dec 2023",
          comments: [
            { name: "Harihar Car Carriers (owner)", text: "Thankyou for your valuable feedback" }, // Optional owner reply
          ],
        },
        {
          // REVIEW 3
          pic: "https://lh3.googleusercontent.com/a-/ALV-UjXxTtIEgOyxfLg_2lAXykXps5-wOD1f7rJtE39acIWIEgbCwaxJ=w144-h144-p-rp-mo-ba3-br100", 
          product: "", 
          name: "Tushar Gupta",
          stars: 5,
          message: "Thank you so much for your great service\nWith your great care and door to door service I am much impressed with your work\nWith proper handling and in professional manner ☺️",
          time: "02 Jan 2024",
          comments: [
            { name: "Harihar Car Carriers (owner)", text: "Thankyou for your valuable feedback" }, // Optional owner reply
          ],
        },
        {
          // REVIEW 4
          pic: "https://lh3.googleusercontent.com/a-/ALV-UjX9c9q65bLWLI5J-EJq2p9eRIHZc2ZY9bBaJaZ-fYfDmpVnm7UZBg=w144-h144-p-rp-mo-ba4-br100", 
          product: "", 
          name: "Rajkumar Tanwar",
          stars: 5,
          message: "My car move from Nagpur to Bangalore, I got very good service, and I am satisfied, from this service this is the best moving company in all over india. They load cars very safely and my lugage was was kept very safely there was no damage. i am happy and i am proudly say that people will be happy from there work. Very prompt service and nice experience",
          time: "15 Dec 2023",
          comments: [
            { name: "Harihar Car Carriers (owner)", text: "Thankyou for your valuable feedback" }, // Optional owner reply
          ],
        },
        {
          // REVIEW 5
          pic: "https://lh3.googleusercontent.com/a-/ALV-UjUQ40rl9iBw4tUJVtRHbQgQ37hexyBt4wWKcD2k_duXARnmYfOMTQ=w144-h144-p-rp-mo-ba4-br100", 
          product: "", 
          name: "Pranjal Prem (Pearl)",
          stars: 5,
          message: "Extremely professional service.\nThe car was picked up the next day, and it was delivered within the scheduled time.They didn't even ask for payment until a day before the delivery. The car was delivered in proper condition. They gave a checklist during the pickup, which contains all the equipment and accessories present in the car, which is to be matched during the delivery . THANK YOU SO MUCH .",
          time: "02 Jan 2024",
          comments: [
            { name: "Harihar Car Carriers (owner)", text: "Thankyou for your valuable feedback" }, // Optional owner reply
          ],
        }
      ];

  // 2. INJECT THE HTML (With Google Review Link updated)
  container.innerHTML = `
    <section id="reviews" class="customer-reviews-section">
      <div class="container">
        <div class="featured-reviews-header fade-in">
          <div class="header-text-group">
            <h2 style="margin:0;">Verified Reviews</h2>
            <p style="color: #64748b; margin-top: 4px;">See what our customers say about our service</p>
          </div>
          
          <div class="header-action-group">
            <a href="https://www.google.com/search?kgmid=/g/11jkyzsdlk#lrd=0x3bd4ebc5c00444b7:0x108aba1b13bceede,1,,,," target="_blank" class="secondary-action-btn">
               <i class="fa-brands fa-google"></i> Read all on Google
            </a>
            <a href="https://www.google.com/search?q=Harihar+Car+Carriers+Nagpur#lrd=0x3bd4ebc5c00444b7:0x108aba1b13bceede,3" target="_blank" class="primary-action-btn" style="text-decoration: none;">
              <i class="fa-solid fa-pen-to-square"></i> Write a Review
            </a>
          </div>
        </div>

        <div class="reviews-controls">
          <div id="servicesReviewStats"></div>
          <div class="review-filters">
            <button class="review-filter-btn active" data-rating="all">All Reviews</button>
            <button class="review-filter-btn" data-rating="5">5 ★</button>
            <button class="review-filter-btn" data-rating="4">4 ★</button>
            <button class="review-filter-btn" data-rating="3">3 ★</button>
            <button class="review-filter-btn" data-rating="2">2 ★</button>
            <button class="review-filter-btn" data-rating="1">1 ★</button>
          </div>
        </div>
      </div>
    </section>

    <section class="testimonials-carousel-section">
      <div class="swiper testimonialsSwiper">
        <div class="swiper-wrapper" id="swiperWrapper"></div>
        <div class="swiper-pagination" style="bottom: -5px;"></div>
      </div>
    </section>
  `;

  // 3. THE LOGIC
  let userReviews = JSON.parse(localStorage.getItem("testimonials")) || [];
  let allTestimonials = [...defaultTestimonials, ...userReviews];
  let testimonials = [...allTestimonials];
  let swiper;

  function formatDisplayDate(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr.split(' ')[0]; 
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear();
  }

  function renderTestimonials() {
    const wrapper = document.getElementById("swiperWrapper");
    if (!wrapper) return;
    wrapper.innerHTML = "";
    
    testimonials.forEach((t) => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      slide.innerHTML = `
        <div class="modern-card">
          <div class="mc-header">
            <img src="${t.pic}" class="mc-avatar">
            <div class="mc-info">
              <h3 class="mc-name">${t.name}</h3>
              <div class="mc-stars">
                ${'<i class="fa-solid fa-star"></i>'.repeat(t.stars)}
                ${'<i class="fa-regular fa-star"></i>'.repeat(5 - t.stars)}
              </div>
            </div>
            <div class="mc-date">${formatDisplayDate(t.time)}</div>
          </div>
          <div class="mc-body">
            "${t.message}"
            ${t.product ? `<img src="${t.product}" class="mc-product">` : ""}
          </div>
          ${t.comments && t.comments.length > 0 ? `
            <div class="mc-comments-wrapper">
              <div class="mc-comments-list">
                ${t.comments.map(c => `<div class="mc-comment-item"><strong>${c.name}:</strong> ${c.text}</div>`).join("")}
              </div>
            </div>` : ''}
        </div>
      `;
      wrapper.appendChild(slide);
    });
    initSwiper();
  }

  function updateStats() {
    const statsContainer = document.getElementById("servicesReviewStats");
    if (!statsContainer) return;
    let avg = allTestimonials.length > 0 ? (allTestimonials.reduce((acc, t) => acc + t.stars, 0) / allTestimonials.length).toFixed(1) : 0;
    
    statsContainer.innerHTML = `
      <div class="review-stats-box">
        <h2 style="font-size: 3.5rem; margin: 0; color: #1e293b; line-height: 1;">${avg}</h2>
        <p style="color: #64748b; margin: 0; font-size: 0.9rem;">Based on ${allTestimonials.length} reviews</p>
      </div>
    `;
  }

  function initSwiper() {
    if (swiper) { swiper.destroy(true, true); }
    setTimeout(() => {
      swiper = new Swiper(".testimonialsSwiper", {
        slidesPerView: 1, slidesPerGroup: 1, centeredSlides: true, spaceBetween: 100, grabCursor: true, loop: true,
        autoplay: { delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true },
        pagination: { el: ".swiper-pagination", clickable: true, dynamicBullets: true },
        keyboard: { enabled: true, onlyInViewport: true }, speed: 600, effect: 'slide'
      });
    }, 100);
  }

  // Filter Buttons
  document.querySelectorAll(".review-filter-btn").forEach(btn => {
    btn.addEventListener("click", function() {
      document.querySelectorAll(".review-filter-btn").forEach(b => b.classList.remove("active"));
      this.classList.add("active");
      const rating = this.dataset.rating;
      testimonials = rating === "all" ? [...allTestimonials] : allTestimonials.filter(t => t.stars == rating);
      renderTestimonials();
    });
  });

  // Start everything
  renderTestimonials();
  updateStats();
});
