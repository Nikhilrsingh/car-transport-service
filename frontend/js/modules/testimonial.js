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

// BUILD SLIDES + DOTS
const sliderContainer = document.getElementById('sliderContainer');
const testimonialSlider = document.querySelector('.testimonial-slider');

if (sliderContainer && testimonialSlider) {
    // Create cards
    testimonials.forEach(testimonial => {
        const testimonialCard = document.createElement('div');
        testimonialCard.classList.add('testimonial-card');

        // stars rating
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

    // Slider controls (dots)
    const slidercontrols = document.createElement('div');
    slidercontrols.classList.add('slider-controls');
    slidercontrols.innerHTML = `
        <div class="slider-dots">
            ${testimonials
                .map((_, index) => `<span class="dot ${index === 0 ? 'active' : ''}"></span>`)
                .join('')}
        </div>
    `;
    testimonialSlider.appendChild(slidercontrols);
}

// SLIDER FUNCTIONALITY + DRAG/SWIPE
document.addEventListener("DOMContentLoaded", function () {
    const sliderContainer = document.getElementById("sliderContainer");
    const slides = document.querySelectorAll(".testimonial-card");
    const dots = document.querySelectorAll(".dot");
    const slider = document.querySelector(".testimonial-slider");

    if (!sliderContainer || slides.length === 0) return;

    // Core state
    let currentSlide = 0;
    const totalSlides = slides.length;

    // Drag/swipe state
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;

    // Auto slide
    let autoSlide = null;
    const AUTO_SLIDE_INTERVAL = 5000;

    // Helpers
    function setPositionByIndex() {
        currentTranslate = currentSlide * -100;
        prevTranslate = currentTranslate;
        sliderContainer.style.transition = "transform 0.3s ease-out";
        sliderContainer.style.transform = `translateX(${currentTranslate}%)`;

        // sync dots
        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === currentSlide);
        });

        // remove transition after
        setTimeout(() => {
            sliderContainer.style.transition = "";
        }, 300);
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        setPositionByIndex();
    }

    function startAutoSlide() {
        stopAutoSlide();
        autoSlide = setInterval(nextSlide, AUTO_SLIDE_INTERVAL);
    }

    function stopAutoSlide() {
        if (autoSlide) {
            clearInterval(autoSlide);
            autoSlide = null;
        }
    }

    function getPositionX(event) {
        return event.type.includes("mouse")
            ? event.pageX
            : event.touches[0].clientX;
    }

    function animation() {
        sliderContainer.style.transform = `translateX(${currentTranslate}%)`;
        if (isDragging) requestAnimationFrame(animation);
    }

    // DRAG/SWIPE HANDLERS
    function handleDragStart(event) {
        isDragging = true;
        startPos = getPositionX(event);
        sliderContainer.style.cursor = "grabbing";
        sliderContainer.style.transition = "none";
        animationID = requestAnimationFrame(animation);
        stopAutoSlide();
    }

    function handleDragMove(event) {
        if (!isDragging) return;
        const currentPosition = getPositionX(event);
        const moveX = currentPosition - startPos;

        // 100% of width = 1 slide, so convert px to percentage
        const sliderWidth = sliderContainer.offsetWidth || 1;
        const movePercent = (moveX / sliderWidth) * 100;

        currentTranslate = prevTranslate + movePercent;
    }

    function handleDragEnd() {
        if (!isDragging) return;
        isDragging = false;
        sliderContainer.style.cursor = "grab";
        cancelAnimationFrame(animationID);

        const movedBy = currentTranslate - prevTranslate;
        const threshold = 20; // percent

        if (movedBy < -threshold && currentSlide < totalSlides - 1) {
            currentSlide += 1;
        }
        if (movedBy > threshold && currentSlide > 0) {
            currentSlide -= 1;
        }

        setPositionByIndex();
        startAutoSlide();
    }

    // Attach events
    // Prevent image drag ghosting
    slides.forEach(slide => {
        slide.querySelectorAll("img").forEach(img => {
            img.addEventListener("dragstart", e => e.preventDefault());
        });
    });

    sliderContainer.style.cursor = "grab";

    // Mouse events
    sliderContainer.addEventListener("mousedown", handleDragStart);
    sliderContainer.addEventListener("mousemove", handleDragMove);
    sliderContainer.addEventListener("mouseup", handleDragEnd);
    sliderContainer.addEventListener("mouseleave", handleDragEnd);

    // Touch events
    sliderContainer.addEventListener("touchstart", handleDragStart, { passive: true });
    sliderContainer.addEventListener("touchmove", handleDragMove, { passive: true });
    sliderContainer.addEventListener("touchend", handleDragEnd);

    // DOT CLICK EVENTS
    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            currentSlide = index;
            setPositionByIndex();
            startAutoSlide();
        });
    });

    // HOVER PAUSE (desktop)
    if (slider) {
        slider.addEventListener("mouseenter", stopAutoSlide);
        slider.addEventListener("mouseleave", startAutoSlide);
    }

    // INIT
    setPositionByIndex();
    startAutoSlide();
});
