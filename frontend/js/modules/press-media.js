/**
 * 1. GLOBAL FUNCTIONS: 
 * Attached to 'window' so HTML onclick attributes can find them.
 */
window.showNotification = function(message, type = 'info') {
    const existing = document.querySelector('.media-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    // Important: applying the type class for CSS coloring
    notification.className = `media-notification ${type}`;
    
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    const icon = icons[type] || icons.info;

    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;

        document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
};

// Helper function to get pretty names for assets
function getAssetName(assetType) {
    const names = {
        'logo-package': 'Company Logo Package',
        'brand-guidelines': 'Brand Guidelines',
        'press-photos': 'Press Photos',
        'fact-sheet': 'Company Fact Sheet',
        'infographics': 'Infographics',
        'company-video': 'Company Video'
    };
    return names[assetType] || 'Asset';
}

window.downloadAsset = function(assetType) {
    const assetName = getAssetName(assetType);
    window.showNotification(`Preparing ${assetName}...`, 'info');
    
    setTimeout(() => {
        window.showNotification(`${assetName} download started!`, 'success');
    }, 800);
};

window.downloadPressRelease = function(releaseId) {
    window.showNotification('Fetching press release...', 'info');
    setTimeout(() => {
        window.showNotification('Press release downloaded!', 'success');
    }, 800);
};

// Universal Close Logic
window.closeAllModals = function() {
    document.getElementById('articleModal').style.display = "none";
    const successModal = document.getElementById('successModal');
    if(successModal) successModal.style.display = "none";
    document.body.style.overflow = "auto"; 
};

/**
 * 2. PRIVATE LOGIC
 */
(function() {
    'use strict';

     const articleData = {
        'times-of-india': {
            title: "Revolutionizing Car Transport in India: The Harihar Standard",
            source: "Times of India",
            date: "Oct 20, 2024",
            image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=1200",
            content: `
                <p>The logistics sector in India has long been plagued by fragmentation and a lack of accountability. However, Harihar Car Carriers is making headlines by proving that technology can bridge the gap between service providers and customer expectations. By integrating advanced IoT sensors across its entire fleet, the company has achieved a staggering 99.8% damage-free delivery rate over the last fiscal year.</p>
                <h4>A New Era of Digital Transparency</h4>
                <p>For years, customers relocating vehicles across states had to rely on sporadic phone calls for updates. Harihar's new proprietary AI dashboard has changed the game. "We realized that the biggest stress for a car owner isn't just the potential for damage, but the 'black hole' of information during transit," says the Head of Operations. The system now provides automated WhatsApp updates the moment a vehicle reaches any of the 45 major transit hubs in the network.</p>
                <p>Furthermore, the company has introduced high-definition 360-degree cameras at every loading dock. This ensures that every vehicle's condition is digitally fingerprinted before it ever moves. If a scratch is detected, the AI highlights it automatically, preventing any disputes regarding pre-existing conditions. This level of forensic detail is a first for the Indian car transport market.</p>
                <h4>Investing in Infrastructure</h4>
                <p>Beyond software, Harihar has invested over ₹50 crores in specialized hydraulic ramps and enclosed carriers. Unlike traditional open trailers, these enclosed pods protect luxury vehicles from road debris, dust, and varying weather conditions found between the Himalayas and the coastal regions. As luxury car sales in India continue to surge, Harihar’s focus on high-end safety is positioning them as the preferred partner for brands like Mercedes, BMW, and Audi for their corporate logistics needs.</p>`
        },
        'ndtv-business': {
            title: "Green Initiative: Logistics Goes Carbon Neutral",
            source: "NDTV Business",
            date: "Sep 15, 2024",
            image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=1200",
            content: `
                <p>In a bold move that is reverberating through the heavy transport industry, Harihar Car Carriers has announced the induction of 50 eco-friendly electric carriers for urban distributions. This initiative makes them the first carbon-neutral car carrier service in Central India, setting a precedent that many environmentalists hope will become the industry standard.</p>
                <h4>The Roadmap to 2026</h4>
                <p>The "Green Lane" project isn't just a marketing slogan; it is a comprehensive overhaul of the company's energy consumption. By the end of 2026, the company aims to reduce its total carbon footprint by 40%. This includes massive installations of solar arrays on the roofs of their major storage hubs in Nagpur and Mumbai. These solar plants will not only power the warehouses but also serve as charging stations for the burgeoning electric fleet.</p>
                <p>During an exclusive sit-down, CEO Rajesh Sharma emphasized that sustainability and profitability are not mutually exclusive. "Our maintenance costs for the electric fleet are nearly 30% lower than traditional diesel trucks," he noted. "While the initial capital expenditure is high, the long-term fuel savings and environmental benefits are undeniable. We are building a business that can last for the next fifty years, and you can't do that while ignoring the planet."</p>
                <h4>Public Response and Industry Impact</h4>
                <p>The response from corporate clients has been overwhelmingly positive. Many multinational corporations with strict ESG (Environmental, Social, and Governance) targets are now prioritizing Harihar for their employee relocation contracts. This shift is forcing competitors to rethink their reliance on aging, high-emission diesel engines, effectively sparking a green revolution in a sector that was once considered impossible to decarbonize.</p>`
        },
        'business-today': {
            title: "Growth Hack: How Harihar Scaled 300% in 3 Years",
            source: "Business Today",
            date: "Aug 30, 2024",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200",
            content: `
                <p>Business Today has officially recognized Harihar Car Carriers in its prestigious annual growth list. The data is clear: the company has seen a 300% increase in its customer base over the last three years, scaling from a respected regional player into a national logistics powerhouse. But how did they achieve such rapid scale in a crowded market?</p>
                <h4>The "Driver-Partner" Revolution</h4>
                <p>The secret lies in their human capital strategy. While most logistics firms treat drivers as low-skill labor, Harihar launched a unique "Driver-Partner" program. By providing drivers with health insurance, performance bonuses tied to safety, and a clear path to owning their own vehicles through company financing, they have achieved unprecedented levels of accountability. "Our drivers don't just move cars; they are ambassadors of our brand," says the HR Director.</p>
                <p>This stability in the workforce has led to a significant decrease in transit delays and accidents. Reliable staffing allowed the company to open 15 new transit hubs in Tier-2 cities like Indore, Jaipur, and Surat simultaneously. These hubs act as specialized vehicle "hotels," where cars are stored in temperature-controlled environments during transit breaks, ensuring they arrive at their destination in showroom condition.</p>
                <h4>Looking Toward Global Markets</h4>
                <p>With a firm grip on the domestic market, Harihar is now eyeing international horizons. Sources close to the leadership team suggest that the company is exploring partnerships in Southeast Asia and the Middle East. Their goal is to export their tech-driven, driver-centric model to emerging markets that face similar logistical challenges. If their domestic success is any indicator, the Harihar name could soon be a global staple in vehicle relocation.</p>`
        },
        'logistics-podcast': {
            title: "Podcast: The AI-Driven Future of the Supply Chain",
            source: "Logistics Podcast",
            date: "Jul 12, 2024",
            image: "https://images.unsplash.com/photo-1566633806327-68e152aaf26d?q=80&w=1200",
            content: `
                <p>In this week's featured episode, we sit down with the CTO of Harihar Car Carriers to discuss the invisible forces shaping the modern supply chain. The conversation centered on one primary theme: the shift from reactive to predictive logistics. In the old days, you fixed a truck when it broke. Today, Harihar uses machine learning to predict a breakdown before the driver even sees a warning light.</p>
                <h4>Machine Learning in Motion</h4>
                <p>By analyzing thousands of data points from engine vibrations, fuel consumption patterns, and even weather-impacted route data, the company's AI can schedule maintenance precisely when it's needed. This has reduced mid-transit failures by 85%. But the AI doesn't stop at the engine. "We use computer vision to analyze road conditions ahead," the CTO explained. "If a route is showing increased gravel or debris, our system reroutes the carrier to protect the vehicles on board."</p>
                <p>This data-centric approach ensures that every vehicle is handled with surgical precision. The podcast explores how digital-first companies are successfully disrupting traditional "movers and packers" by focusing on data-driven reliability rather than just manual labor. For any professional in the logistics space, this episode is a masterclass in how to stay relevant in an increasingly automated world.</p>
                <h4>The Human-AI Synergy</h4>
                <p>One of the most interesting points of the discussion was the role of the human operator. Rather than replacing drivers, Harihar uses AI to empower them. Dashboards provide real-time coaching on fuel efficiency and safety, making the driving experience safer and less stressful. As the industry moves toward autonomous vehicles, Harihar is positioning itself as the leader in the transition, proving that the future of logistics is a partnership between human intuition and machine intelligence.</p>`
        },
        'economic-times': {
            title: "Analysis: Why Customer Loyalty is the New Currency",
            source: "Economic Times",
            date: "Jun 25, 2024",
            image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1200",
            content: `
                <p>An in-depth analysis of Harihar Car Carriers' service model reveals why they hold a 99.8% satisfaction rating in a highly fragmented industry. In an era where customers are often treated as mere invoice numbers, Harihar has doubled down on a "Customer-First" philosophy that treats every vehicle relocation as a high-stakes mission.</p>
                <h4>Specialization as a Competitive Edge</h4>
                <p>The company's success stems from its refusal to be a "jack of all trades." By focusing exclusively on car transport, they have been able to develop specialized equipment like "Premium Enclosed Carriers." These units are air-suspended to prevent any road vibration from affecting the vehicle's alignment and are completely sealed to protect against the varying climates of India. For high-net-worth individuals and corporate executives, this level of specialized care is worth the premium price point.</p>
                <p>Additionally, Harihar has revolutionized the insurance claims process. Typically, getting a claim settled in the transport sector can take months. Harihar offers an end-to-end "Hassle-Free" insurance package where they handle all the paperwork. In the rare event of a damage claim, the company aims for a 7-day resolution. This commitment to standing by their service has built a level of brand trust that is unparalleled in the Indian logistics landscape.</p>
                <h4>The Data Behind the Delight</h4>
                <p>Data analytics play a massive role in their customer service. Every piece of feedback is analyzed by a dedicated team to identify recurring pain points. If a particular route consistently receives lower satisfaction scores, the company investigates everything from the road quality to the specific transit hubs used. This obsession with detail has created a feedback loop that constantly improves the service, ensuring that Harihar remains at the top of the Customer Choice awards year after year.</p>`
        },
        'newsnation': {
            title: "Safety First: The Infrastructure of Trust",
            source: "NewsNation",
            date: "May 18, 2024",
            image: "https://images.unsplash.com/photo-1506015391300-4802dc74de2e?q=80&w=1200",
            content: `
                <p>NewsNation recently went behind the scenes at Harihar Car Carriers' main facility to witness their "Zero-Damage" mission in action. What we found was a facility that looks more like an aerospace hangar than a traditional truck depot. The level of cleanliness and organization is the first indicator that this is a company obsessed with safety and precision.</p>
                <h4>Mechanical Safeguards and Hydraulic Innovation</h4>
                <p>The feature explored the company's "Zero-Manual Handling" goal. Traditionally, cars are driven up steep ramps onto trailers, a process fraught with the risk of clutch wear or bumper scrapes. Harihar has replaced these with specialized hydraulic lift platforms. These platforms lift the vehicle horizontally, keeping it perfectly level until it is safely secured inside the carrier. This removes the "human error" factor from the loading process entirely.</p>
                <p>Inside the carriers, vehicles are secured using soft-webbing wheel ties rather than metal chains, ensuring that the suspension and chassis are never under unnecessary stress. These small mechanical innovations, when multiplied across a fleet of hundreds, result in the industry-leading safety record the company is famous for.</p>
                <h4>The Gold Standard of Training</h4>
                <p>The segment concluded with a look at the Harihar Training Academy. Every employee, from the loading crew to the long-haul drivers, undergoes a rigorous 4-week certification program. They are trained in everything from defensive driving to the chemical properties of different car paints to ensure they use the right protective covers. By investing in their people as much as their machines, Harihar has built an infrastructure of trust that makes them the gold standard for safety compliance in the logistics sector.</p>`
        }
    };
       

     const articleModal = document.getElementById('articleModal');
    const successModal = document.getElementById('successModal');
    const articleBody = document.getElementById('articleBody');

    // Article Link Handlers
    document.querySelectorAll('.media-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const card = this.closest('.media-card');
            const sourceSpan = card.querySelector('.media-logo span');
            if (!sourceSpan) return;
            const sourceKey = sourceSpan.innerText.toLowerCase().trim().replace(/\s+/g, '-');
            const data = articleData[sourceKey];

            if (data) {
                articleBody.innerHTML = `
                    <div class="article-header">
                        <div class="article-meta-info">${data.source} | ${data.date}</div>
                        <h2>${data.title}</h2>
                    </div>
                    <img src="${data.image}" class="article-image" alt="Article Visual">
                    <div class="article-full-text">${data.content}</div>
                `;
                articleModal.style.display = "block";
                document.body.style.overflow = "hidden"; // Lock background
            }
        });
    });

    // Form Submission with FULL VALIDATION
    const mediaForm = document.getElementById('mediaInquiryForm');
    if (mediaForm) {
        mediaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validation
            const name = document.getElementById('mediaName').value.trim();
            const email = document.getElementById('mediaEmail').value.trim();
            const message = document.getElementById('mediaMessage').value.trim();

            if (name.length < 2 || !email.includes('@') || message.length < 20) {
                window.showNotification('Please provide valid information (Message min 20 chars).', 'error');
                return;
            }
    

     const submitBtn = e.target.querySelector('.submit-inquiry-btn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

            setTimeout(() => {
                window.showNotification('Inquiry Sent!', 'success');
                successModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
                e.target.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Inquiry';
            }, 1200);
        });
    }

     document.querySelectorAll('.close-article').forEach(btn => {
        btn.addEventListener('click', window.closeAllModals);
    });

    window.addEventListener('click', (e) => {
        if (e.target == articleModal || e.target == successModal) window.closeAllModals();
    });
    })();