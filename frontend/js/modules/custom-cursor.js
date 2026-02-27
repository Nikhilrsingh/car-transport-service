export const initCustomCursor = () => {
    
    if (typeof TweenMax === 'undefined') {
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.3/TweenMax.min.js";
        script.onload = () => initCustomCursor();
        document.head.appendChild(script);
        return;
    }

    
    if (!document.querySelector('.cursor')) {
        const cursorContainer = document.createElement('div');
        cursorContainer.className = 'cursor';
        cursorContainer.innerHTML = `
        <div class="cursor__ball cursor__ball--big">
          <svg height="30" width="30" style="overflow: visible;">
            <circle cx="15" cy="15" r="12"></circle>
          </svg>
        </div>
        <div class="cursor__ball cursor__ball--small">
          <svg height="10" width="10" style="overflow: visible;">
            <circle cx="5" cy="5" r="4"></circle>
          </svg>
        </div>`;
        document.body.prepend(cursorContainer); 
    }

    const $bigBall = document.querySelector('.cursor__ball--big');
    const $smallBall = document.querySelector('.cursor__ball--small');
    const $hoverables = document.querySelectorAll('a, button, .hoverable, .cta-btn, .submit-btn, input, select');

    // Movement
    document.addEventListener('mousemove', (e) => {
        TweenMax.to($bigBall, 0.4, { x: e.clientX - 15, y: e.clientY - 15 });
        TweenMax.to($smallBall, 0.1, { x: e.clientX - 5, y: e.clientY - 7 });
    });

  
    $hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            TweenMax.to($bigBall, 0.3, { scale: 4, opacity: 0.5 });
        });
        el.addEventListener('mouseleave', () => {
            TweenMax.to($bigBall, 0.3, { scale: 1, opacity: 1 });
        });
    });
};