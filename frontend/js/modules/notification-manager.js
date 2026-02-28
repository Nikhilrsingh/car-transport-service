/**
 * NotificationManager - Handles dynamic browser tab title and favicon updates
 * Designed for Cargo Premium UX to grab user attention when they are on another tab.
 */
class NotificationManager {
  constructor() {
    this.originalTitle = document.title;
    this.originalFavicon = this.getFaviconHref();
    this.notifFavicon = this.getNotifFaviconPath();
    this.notificationCount = 0;
    this.isTabActive = document.visibilityState === 'visible';
    this.messages = [];
    this.scrollInterval = null;

    this.init();
  }

  init() {
    // Track visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.isTabActive = true;
        this.clearNotifications();
      } else {
        this.isTabActive = false;
      }
    });

    console.log('NotificationManager initialized');
  }

  getFaviconHref() {
    const link = document.querySelector("link[rel~='icon']");
    return link ? link.href : '';
  }

  getNotifFaviconPath() {
    const currentPath = window.location.pathname;
    const isInPagesFolder = currentPath.toLowerCase().includes('/pages/');
    const base = isInPagesFolder ? '../' : './';
    return `${base}assets/icons/favicon-notif.png`;
  }

  setFavicon(href) {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = href;
  }

  /**
   * Trigger a new tab notification
   * @param {string} message - The message to show (e.g., 'New Booking')
   */
  notify(message) {
    if (this.isTabActive) return; // Don't notify if user is already looking

    this.notificationCount++;
    if (!this.messages.includes(message)) {
      this.messages.push(message);
    }

    this.updateUI();
  }

  updateUI() {
    // Swap Favicon
    this.setFavicon(this.notifFavicon);

    // Update Title
    this.startTitleScroll();
  }

  startTitleScroll() {
    if (this.scrollInterval) clearInterval(this.scrollInterval);

    let step = 0;
    const updateTitle = () => {
      if (this.isTabActive) return;

      const countPrefix = `(${this.notificationCount}) `;
      const messagesStr = this.messages.join(' | ');

      // Alternate between count+message and original title
      if (step % 2 === 0) {
        document.title = `${countPrefix}${messagesStr} | Cargo`;
      } else {
        document.title = this.originalTitle;
      }
      step++;
    };

    updateTitle();
    this.scrollInterval = setInterval(updateTitle, 2000);
  }

  clearNotifications() {
    this.notificationCount = 0;
    this.messages = [];
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
      this.scrollInterval = null;
    }

    // Restore title and icon
    document.title = this.originalTitle;
    this.setFavicon(this.originalFavicon);
  }
}

// Export for global use
window.NotificationManager = NotificationManager;
