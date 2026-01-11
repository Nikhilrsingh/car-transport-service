/* ====================================
   FLOATING CHATBOT BUTTON – IMPROVED
   ==================================== */

(function () {
  'use strict';

  /* ---------------- CONFIG ---------------- */
  const CONFIG = {
    BUTTON_ID: 'floating-chatbot-btn',
    MODAL_ID: 'chatbot-modal-overlay',
    INPUT_ID: 'chatbot-input',
    MESSAGE_AREA_ID: 'chatbot-messages',
    CLICK_DELAY: 400,
    PULSE_DURATION: 6000
  };

  let isLocked = false;
  let lastFocusedElement = null;

  /* ---------------- UTILITIES ---------------- */
  const $ = (id) => document.getElementById(id);

  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const debounceClick = (callback) => {
    if (isLocked) return;
    isLocked = true;
    callback();
    setTimeout(() => (isLocked = false), CONFIG.CLICK_DELAY);
  };

  /* ---------------- BUTTON INIT ---------------- */
  function initFloatingChatbotButton() {
    if ($(CONFIG.BUTTON_ID)) return;

    const button = document.createElement('button');
    button.id = CONFIG.BUTTON_ID;
    button.type = 'button';
    button.setAttribute('aria-label', 'Open chat support');
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-expanded', 'false');
    button.title = 'Chat with us';

    const icon = document.createElement('i');
    icon.className = 'fas fa-comments';
    icon.setAttribute('aria-hidden', 'true');
    button.appendChild(icon);

    document.body.appendChild(button);

    addButtonEvents(button);
  }

  /* ---------------- EVENTS ---------------- */
  function addButtonEvents(button) {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      debounceClick(openChatbotModal);
    });

    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        button.click();
      }
    });
  }

  /* ---------------- MODAL CONTROL ---------------- */
  function openChatbotModal() {
    const modal = $(CONFIG.MODAL_ID);
    if (!modal) return;

    lastFocusedElement = document.activeElement;

    modal.style.display = 'flex';
    requestAnimationFrame(() => modal.classList.add('active'));

    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');

    const button = $(CONFIG.BUTTON_ID);
    button?.setAttribute('aria-expanded', 'true');

    const chatArea = $(CONFIG.MESSAGE_AREA_ID);
    if (chatArea) {
      chatArea.setAttribute('aria-live', 'polite');
      chatArea.setAttribute('aria-atomic', 'true');
    }

    setTimeout(() => {
      $(CONFIG.INPUT_ID)?.focus();
    }, 100);

    document.addEventListener('keydown', escHandler);
  }

  function closeChatbotModal() {
    const modal = $(CONFIG.MODAL_ID);
    if (!modal) return;

    modal.classList.remove('active');
    setTimeout(() => (modal.style.display = 'none'), 300);

    const button = $(CONFIG.BUTTON_ID);
    button?.setAttribute('aria-expanded', 'false');

    lastFocusedElement?.focus();
    document.removeEventListener('keydown', escHandler);
  }

  function toggleChatbotModal() {
    const modal = $(CONFIG.MODAL_ID);
    if (!modal || modal.style.display === 'none') {
      openChatbotModal();
    } else {
      closeChatbotModal();
    }
  }

  function escHandler(e) {
    if (e.key === 'Escape') closeChatbotModal();
  }

  /* ---------------- ANIMATION ---------------- */
  function animatePulse() {
    if (prefersReducedMotion()) return;

    const button = $(CONFIG.BUTTON_ID);
    if (!button) return;

    button.classList.add('pulse');
    setTimeout(() => button.classList.remove('pulse'), CONFIG.PULSE_DURATION);
  }

  /* ---------------- INIT ---------------- */
  function initialize() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', start);
    } else {
      start();
    }
  }

  function start() {
    initFloatingChatbotButton();
    animatePulse();
  }

  /* ---------------- PUBLIC API ---------------- */
  window.chatbotUI = {
    open: openChatbotModal,
    close: closeChatbotModal,
    toggle: toggleChatbotModal,
    init: initialize
  };

  initialize();
})();
