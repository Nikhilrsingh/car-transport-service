const testimonials = [
    {
        name: "Rajesh Kumar",
        dest: "Delhi to Bangalore",
        "client image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=1000&q=80",
        "testimonial text": "I was extremely worried about shipping my BMW from Delhi to Bangalore, but Harihar Car Carriers made the process seamless. Their professional handling and timely delivery exceeded my expectations. Highly recommended!",
        rating: 5
    },
    {
        name: "Priya Sharma",
        dest: "Car Dealer, Mumbai",
        "client image": "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1000&q=80",
        "testimonial text": "As a car dealer, I regularly use transport services. Harihar Car Carriers stands out with their punctuality and care. My luxury cars always arrive in perfect condition. Trustworthy service!",
        rating: 5
    },
    {
        name: "Vikram Singh",
        dest: "Chennai to Pune",
        "client image": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1000&q=80",
        "testimonial text": "Transported my vintage car from Chennai to Pune. The team was very careful and provided regular updates throughout the journey. My classic car arrived without a scratch. Excellent service!",
        rating: 4.5
    },
    {
        name: "Aman Singh",
        dest: "Chennai to Pune",
        "client image": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=1000&q=80",
        "testimonial text": "Transported my vintage car from Chennai to Pune. The team was very careful and provided regular updates throughout the journey. My classic car arrived without a scratch. Excellent service!",
        rating: 4.5
    },
    {
        name: "Anjali Mehta",
        dest: "Relocation Service",
        "client image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80",
        "testimonial text": "Door-to-door service was amazing! They picked up my car from home and delivered it right to my new address. No hassle at all.",
        rating: 4.5
    },
    {
        name: "Amit Patel",
        dest: "Hyderabad to Kolkata",
        "client image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80",
        "testimonial text": "Best pricing in the market with premium service. My SUV was transported safely from Hyderabad to Kolkata. Will definitely use again.",
        rating: 4.5
    },
];


const sliderContainer = document.getElementById('sliderContainer');

testimonials.forEach(testimonial => {
    const testimonialCard = document.createElement('div');
    testimonialCard.classList.add('testimonial-card');

    // for stars rating
    const fullstars = Math.floor(testimonial.rating);
    const halfstars = testimonial.rating % 1 !== 0 ? 1 : 0;

    let starsHTML = "";
    for (let i = 0; i < fullstars; i++) {
        starsHTML += `<i class="fas fa-star"></i>`;
    }
    if (halfstars) {
        starsHTML += `<i class="fas fa-star-half-alt"></i>`;
    }

    testimonialCard.innerHTML = `
        <div class="rating">${starsHTML}</div>
        <div class="testimonial-text">"${testimonial["testimonial text"]}"</div>
        <div class="client-info">
            <div class="client-avatar">
                <img src="${testimonial["client image"]}" alt="${testimonial.name}">
            </div>
            <div class="client-details">
                <h4>${testimonial.name}</h4>
                <p>${testimonial.dest}</p>
            </div>
        </div>


    `;
    sliderContainer.appendChild(testimonialCard);

});


//Slider controls section
const testimonialSlider = document.querySelector('.testimonial-slider');

const slidercontrols = document.createElement('div');
slidercontrols.classList.add('slider-controls');
slidercontrols.innerHTML = `
    <button class="slider-btn prev-btn">
        <i class="fas fa-chevron-left"></i>
    </button>
    <div class="slider-dots">
        ${testimonials.map((_, index) => `<span class="dot ${index === 0 ? 'active' : ''}"></span>`).join('')}
    </div>
    <button class="slider-btn next-btn">
        <i class="fas fa-chevron-right"></i>
    </button>
    `;

testimonialSlider.appendChild(slidercontrols);




// Slider functionality
document.addEventListener("DOMContentLoaded", function () {
    const sliderContainer = document.getElementById("sliderContainer");
    const slides = document.querySelectorAll(".testimonial-card");
    const dots = document.querySelectorAll(".dot");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");

    let currentSlide = 0;
    const totalSlides = slides.length;

    // Update slider position
    function updateSlider() {
        sliderContainer.style.transform = `translateX(-${currentSlide * 100
            }%)`;

        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === currentSlide);
        });
    }

    // Next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    }

    // Previous slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    }

    // Event listeners
    nextBtn.addEventListener("click", nextSlide);
    prevBtn.addEventListener("click", prevSlide);

    // Dot click events
    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            currentSlide = index;
            updateSlider();
        });
    });

    // Auto slide every 5 seconds
    setInterval(nextSlide, 5000);

    // Pause auto-slide on hover
    const slider = document.querySelector(".testimonial-slider");

    slider.addEventListener("mouseenter", () => {
        clearInterval(autoSlide);
    });

    let autoSlide = setInterval(nextSlide, 5000);

});
