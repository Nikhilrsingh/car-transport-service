 let editIndex = null;
      
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


      let userReviews = JSON.parse(localStorage.getItem("testimonials")) || [];
      let allTestimonials = [...defaultTestimonials, ...userReviews];
      let testimonials = [...allTestimonials];
      let swiper;

      /* =========================================
         MODAL LOGIC COMMENTED OUT FOR GOOGLE LINK
      ========================================= */
      /*
      const modal = document.getElementById('reviewModal');
      function openModal() { modal.classList.add('active'); document.body.style.overflow = 'hidden'; }
      function closeModal() { modal.classList.remove('active'); document.body.style.overflow = ''; }
      document.getElementById('openReviewModalBtn')?.addEventListener('click', ...);
      // ... other modal events ...
      */

      // Date formatter for display
      function formatDisplayDate(dateStr) {
        const d = new Date(dateStr);
        if (isNaN(d)) return dateStr.split(' ')[0]; // fallback
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear();
      }

      function renderTestimonials() {
        const wrapper = document.getElementById("swiperWrapper");
        wrapper.innerHTML = "";
        
        testimonials.forEach((t, i) => {
          const slide = document.createElement('div');
          slide.className = 'swiper-slide';
          
          slide.innerHTML = `
            <div class="modern-card" data-index="${i}">
              <div class="mc-header">
                <img src="${t.pic}" alt="${t.name}" class="mc-avatar">
                <div class="mc-info">
                  <h3 class="mc-name">${t.name}</h3>
                  <div class="mc-stars">
                    ${'<i class="fa-solid fa-star"></i>'.repeat(t.stars)}
                    ${'<i class="fa-regular fa-star"></i>'.repeat(5 - t.stars)}
                  </div>
                </div>
                <div class="mc-date">${formatDisplayDate(t.time)}</div>
              </div>

              <div class="mc-body" id="msg-${i}">
                "${t.message}"
                ${t.product ? `<img src="${t.product}" alt="Delivery Photo" class="mc-product">` : ""}
              </div>

              <div class="mc-comments-wrapper" id="comments-${i}">
                <div class="mc-comments-list">
                  ${t.comments.map(c => 
                    `<div class="mc-comment-item"><strong>${c.name}:</strong> ${c.text}</div>`
                  ).join("")}
                </div>
                <form class="mc-comment-form comment-form" data-index="${i}" onsubmit="return false">
                  <input type="text" placeholder="Write a reply..." required>
                  <button type="submit"><i class="fa-solid fa-paper-plane"></i></button>
                </form>
              </div>
            </div>
          `;
          wrapper.appendChild(slide);
        });

        initSwiper();

        document.querySelectorAll(".comment-form").forEach((form) => {
          form.onsubmit = function () {
            const idx = this.getAttribute("data-index");
            const val = this.querySelector("input").value.trim();
            if (val) {
              testimonials[idx].comments.push({ name: "User", text: val });
              renderTestimonials();
              updateStats();
            }
          };
        });
      }

      /* =========================================
         EDIT EVENT LISTENER COMMENTED OUT
      ========================================= */
      /*
      document.addEventListener("click", function(e) {
        if (e.target.closest(".edit-btn")) { ... }
      });
      */

      function filterReviews(rating) {
        if (rating === "all") {
          testimonials = [...allTestimonials];
        } else {
          testimonials = allTestimonials.filter(t => t.stars == rating);
        }
        renderTestimonials();
        updateStats();
      }

      document.querySelectorAll(".review-filter-btn").forEach(btn => {
        btn.addEventListener("click", function() {
          document.querySelectorAll(".review-filter-btn").forEach(b => b.classList.remove("active"));
          this.classList.add("active");
          const rating = this.dataset.rating;
          filterReviews(rating);
        });
      });

      function updateStats() {
        const total = allTestimonials.length;
        const statsContainer = document.getElementById("servicesReviewStats");

        let counts = {1:0,2:0,3:0,4:0,5:0};
        allTestimonials.forEach(t => counts[t.stars]++);

        let avg = total > 0 ? (allTestimonials.reduce((acc, t) => acc + t.stars, 0) / total).toFixed(1) : 0;

        statsContainer.innerHTML = `
          <div class="review-stats-box">
            <h2>${avg}</h2>
            <p>Based on ${total} reviews</p>
          </div>
        `;
      }

      function initSwiper() {
        if (swiper) { swiper.destroy(true, true); }
        swiper = new Swiper(".testimonialsSwiper", {
          slidesPerView: 1,
          slidesPerGroup: 1, 
          centeredSlides: true, 
          spaceBetween: 100, 
          grabCursor: true,
          loop: true,
          autoplay: { delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true },
          pagination: { el: ".swiper-pagination", clickable: true, dynamicBullets: true },
          keyboard: { enabled: true, onlyInViewport: true },
          speed: 600,
          effect: 'slide'
        });
      }

      renderTestimonials();
      updateStats();

      /* =========================================
         FORM SUBMIT & STAR HIGHLIGHT LOGIC COMMENTED OUT
      ========================================= */
      /*
      let currentStars = 0;
      document.querySelectorAll("#starRating .fa-star").forEach((star) => { ... });
      function highlightStars(n) { ... }
      document.getElementById("feedbackForm").onsubmit = function (e) { ... };
      */

      window.addEventListener("load", () => {
        const overlay = document.querySelector(".loading-overlay");
        if (overlay) overlay.remove();
      });