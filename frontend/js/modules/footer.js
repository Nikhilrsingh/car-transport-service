// Enhanced Footer Interactions: accordion, collapse toggle, micro-toast, in-view animations
(function(){
  'use strict';

  function ready(fn){
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn();
  }

  ready(function(){
    const footer = document.querySelector('#footer-container .footer, .footer');
    if(!footer) return;

    // IntersectionObserver to toggle in-view state for animations & car
    try {
      const obs = new IntersectionObserver((entries)=>{
        entries.forEach(e=>{
          if(e.isIntersecting){ footer.classList.add('in-view'); }
          else { footer.classList.remove('in-view'); }
        });
      }, { threshold: 0.2 });
      obs.observe(footer);
    } catch(_) {}

    // Accordion: allow only one open at a time
    const headers = footer.querySelectorAll('.footer-accordion .accordion-header');
    headers.forEach((btn)=>{
      btn.addEventListener('click', ()=>{
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        headers.forEach(h=> h.setAttribute('aria-expanded','false'));
        if(!expanded){ btn.setAttribute('aria-expanded','true'); }
      });
    });

    // Footer collapse/expand toggle
    const footerMain = document.getElementById('footer-main');
    const toggleBtn = footer.querySelector('.footer-toggle');
    const miniUp = footer.querySelector('.mini-sticky-footer .mini-up');

    function setCollapsed(collapsed){
      if(!footerMain) return;
      if(collapsed){
        toggleBtn && toggleBtn.setAttribute('aria-expanded','false');
        miniUp && miniUp.setAttribute('aria-expanded','false');
        footerMain.style.overflow = 'hidden';
        footerMain.style.maxHeight = '0px';
      } else {
        toggleBtn && toggleBtn.setAttribute('aria-expanded','true');
        miniUp && miniUp.setAttribute('aria-expanded','true');
        footerMain.style.overflow = 'hidden';
        const h = footerMain.scrollHeight;
        footerMain.style.maxHeight = h + 'px';
        setTimeout(()=>{ footerMain.style.overflow = ''; footerMain.style.maxHeight = ''; }, 350);
      }
    }

    if(footerMain){ footerMain.style.transition = 'max-height 0.3s ease'; }
    // Start collapsed on small screens to shorten vertical height
    try { if (window.innerWidth <= 640) setCollapsed(true); } catch(_) {}
    toggleBtn && toggleBtn.addEventListener('click', ()=>{ const expanded = toggleBtn.getAttribute('aria-expanded') === 'true'; setCollapsed(expanded); });
    miniUp && miniUp.addEventListener('click', ()=>{ setCollapsed(false); footer.scrollIntoView({ behavior: 'smooth', block: 'end' }); });

    // Newsletter subscribe micro-toast
    const form = footer.querySelector('#footerNewsletter');
    if(form){
      form.addEventListener('submit', (e)=>{
        e.preventDefault();
        const email = (form.querySelector('input[name="email"]')||{}).value || '';
        const stack = form.parentElement.querySelector('.toast-stack') || footer.querySelector('.toast-stack');
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
          showToast(stack, 'Please enter a valid email');
          return;
        }
        showToast(stack, 'Subscribed! 🎉');
        form.reset();
      });
    }

    function showToast(stack, message){
      if(!stack) return alert(message);
      const t = document.createElement('div');
      t.className = 'toast';
      t.textContent = message;
      stack.appendChild(t);
      setTimeout(()=>{ try{ stack.removeChild(t); }catch(_){} }, 2500);
    }
  });
})();

