// Utility functions for EventSphere

// Robust data loading utilities with caching and retry logic
const DATA_CACHE = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

async function loadJSON(path) {
  try {
    // Check cache first
    const cacheKey = path;
    const cached = DATA_CACHE.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    // Make sure path is relative for GitHub Pages
    const url = path.startsWith('./') ? path : `./${path}`;
    
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Fetch ${path} failed: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    
    // Cache the result
    DATA_CACHE.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    return data;
  } catch (error) {
    console.error(`Error loading ${path}:`, error);
    
    // Show user-friendly error message
    showDataLoadError(path, error.message);
    
    // Return empty structure instead of null to prevent crashes
    if (path.includes('events')) {
      return { events: [] };
    } else if (path.includes('gallery')) {
      return { gallery: [] };
    } else if (path.includes('contacts')) {
      return { staff: [], students: [] };
    } else if (path.includes('about')) {
      return { college: {}, vision: '', mission: '', stats: [] };
    }
    
    return {};
  }
}

// Show unobtrusive error message
function showDataLoadError(path, message) {
  const errorArea = document.getElementById('error-area') || createErrorArea();
  errorArea.innerHTML = `
    <div style="
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #dc2626;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      margin: 0.5rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    ">
      <span>⚠️</span>
      <span>Data loading issue: ${path}. Some content may not display correctly.</span>
      <button onclick="location.reload()" style="
        background: none;
        border: 1px solid currentColor;
        color: inherit;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        font-size: 0.75rem;
        cursor: pointer;
        margin-left: auto;
      ">Retry</button>
    </div>
  `;
}

function createErrorArea() {
  let errorArea = document.getElementById('error-area');
  if (!errorArea) {
    errorArea = document.createElement('div');
    errorArea.id = 'error-area';
    errorArea.style.cssText = 'position: fixed; top: 90px; left: 1rem; right: 1rem; z-index: 1001;';
    document.body.appendChild(errorArea);
  }
  return errorArea;
}

// Image fallback handler
function handleImageError(img, altText) {
  // Try placeholder service first
  if (!img.src.includes('placeholder')) {
    img.src = `https://via.placeholder.com/400x200/171717/24cfa6?text=${encodeURIComponent(altText)}`;
    return;
  }
  
  // If placeholder fails, create CSS-based fallback
  img.style.display = 'none';
  
  const fallback = document.createElement('div');
  fallback.style.cssText = `
    width: 100%;
    height: 200px;
    background: var(--card-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
    font-size: 14px;
    text-align: center;
    padding: 20px;
    border-radius: var(--radius-large) var(--radius-large) 0 0;
    border-bottom: 1px solid var(--border-color);
  `;
  
  fallback.innerHTML = `
    <div>
      <div style="font-size: 24px; margin-bottom: 8px;">🎯</div>
      <div>${altText}</div>
    </div>
  `;
  
  img.parentNode.insertBefore(fallback, img);
}

// Session Storage utilities for bookmarking (session-only per SRS)
const BookmarkManager = {
  getBookmarks(type = 'events') {
    const bookmarks = sessionStorage.getItem(`campusconnect_bookmarks_${type}`);
    return bookmarks ? JSON.parse(bookmarks) : [];
  },

  addBookmark(type, id) {
    const bookmarks = this.getBookmarks(type);
    if (!bookmarks.includes(id)) {
      bookmarks.push(id);
      sessionStorage.setItem(`campusconnect_bookmarks_${type}`, JSON.stringify(bookmarks));
    }
  },

  removeBookmark(type, id) {
    const bookmarks = this.getBookmarks(type);
    const index = bookmarks.indexOf(id);
    if (index > -1) {
      bookmarks.splice(index, 1);
      sessionStorage.setItem(`campusconnect_bookmarks_${type}`, JSON.stringify(bookmarks));
    }
  },

  isBookmarked(type, id) {
    return this.getBookmarks(type).includes(id);
  },

  toggleBookmark(type, id) {
    if (this.isBookmarked(type, id)) {
      this.removeBookmark(type, id);
      return false;
    } else {
      this.addBookmark(type, id);
      return true;
    }
  }
};

// Date formatting utilities
function formatDate(dateString) {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

function isUpcoming(dateString) {
  return new Date(dateString) >= new Date();
}

// Array filtering and sorting utilities
function filterEvents(events, category) {
  if (!category || category === 'all') {
    return events;
  }
  return events.filter(event => 
    event.category.toLowerCase() === category.toLowerCase()
  );
}

function sortEvents(events, sortBy) {
  const sortedEvents = [...events];
  
  switch (sortBy) {
    case 'date':
      return sortedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    case 'name':
      return sortedEvents.sort((a, b) => a.name.localeCompare(b.name));
    case 'category':
      return sortedEvents.sort((a, b) => a.category.localeCompare(b.category));
    default:
      return sortedEvents;
  }
}

function filterGallery(gallery, filter) {
  if (!filter || filter === 'all') {
    return gallery;
  }
  
  // Check if filter is a year or category
  if (filter.includes('-')) {
    // Year filter (e.g., "2023-24")
    return gallery.filter(item => item.year === filter);
  } else {
    // Category filter
    return gallery.filter(item => 
      item.category.toLowerCase() === filter.toLowerCase()
    );
  }
}

// DOM utilities
function createElement(tag, className = '', textContent = '') {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (textContent) element.textContent = textContent;
  return element;
}

function createEventCard(event) {
  const isBookmarked = BookmarkManager.isBookmarked('events', event.id);
  const statusBadge = event.status === 'upcoming' ? 'badge-success' : 'badge-secondary';
  const categoryBadge = getCategoryBadgeClass(event.category);

  return `
    <article class="card event-card fade-in-up" role="article" aria-labelledby="event-title-${event.id}" tabindex="0">
      <img src="${event.image}" 
           alt="${event.name} - ${event.category} event on ${formatDate(event.date)}" 
           class="card-image" 
           loading="lazy" 
           decoding="async"
           onerror="handleImageError(this, '${event.name}')">
      <div class="card-content">
        <div class="d-flex justify-between align-center mb-2">
          <h3 class="card-title" id="event-title-${event.id}">${event.name}</h3>
          <button class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" 
                  onclick="toggleEventBookmark(${event.id})" 
                  aria-label="${isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}" 
                  title="${isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}">
            <span aria-hidden="true">❤️</span>
            <span class="sr-only">${isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}</span>
          </button>
        </div>
        
        <div class="card-meta">
          <span class="card-meta-item">📅 ${formatDate(event.date)}</span>
          <span class="card-meta-item">⏰ ${event.time}</span>
          <span class="card-meta-item">📍 ${event.venue}</span>
        </div>
        
        <div class="mb-2">
          <span class="badge ${statusBadge}">${event.status}</span>
          <span class="badge ${categoryBadge}">${event.category}</span>
        </div>
        
        <p class="card-text">${event.description}</p>
        
        <div class="d-flex justify-between align-center">
          <small class="text-secondary">by ${event.organizer}</small>
          <a class="btn btn-outline" href="event-detail.html?id=${event.id}">
            Learn More
          </a>
        </div>
      </div>
    </article>
  `;
}

function createGalleryItem(item) {
  const isBookmarked = BookmarkManager.isBookmarked('gallery', item.id);
  
  return `
    <div class="gallery-item" onclick="openGalleryModal(${item.id})">
      <img src="${item.image}" alt="${item.title}" class="gallery-image"
           onerror="this.src='https://via.placeholder.com/400x300?text=${encodeURIComponent(item.title)}'">
      <div class="gallery-overlay">
        <div class="gallery-info">
          <div class="d-flex justify-between align-center">
            <div>
              <h4 class="gallery-title">${item.title}</h4>
              <p class="gallery-description">${item.description}</p>
            </div>
            <button class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" 
                    onclick="event.stopPropagation(); toggleGalleryBookmark(${item.id})"
                    title="${isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}">
              ❤️
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function createContactCard(contact, isStudent = false) {
  const yearInfo = isStudent ? `<div class="contact-department">${contact.year} - ${contact.department}</div>` 
                             : `<div class="contact-department">${contact.department}</div>`;
  
  return `
    <div class="contact-card fade-in-up">
      <img src="${contact.image}" alt="${contact.name}" class="contact-avatar"
           onerror="this.src='https://via.placeholder.com/80x80?text=${encodeURIComponent(contact.name.charAt(0))}'">
      <h3 class="contact-name">${contact.name}</h3>
      <div class="contact-role">${contact.designation}</div>
      ${yearInfo}
      
      <div class="contact-info">
        <a href="tel:${contact.phone}" class="contact-info-item">
          📞 ${contact.phone}
        </a>
        <a href="mailto:${contact.email}" class="contact-info-item">
          ✉️ ${contact.email}
        </a>
      </div>
      
      <div class="text-secondary">
        <small>Responsibilities:</small>
        <ul style="text-align: left; margin-top: 0.5rem;">
          ${contact.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
}

function getCategoryBadgeClass(category) {
  switch (category.toLowerCase()) {
    case 'technical': return 'badge-primary';
    case 'cultural': return 'badge-warning';
    case 'sports': return 'badge-success';
    case 'academic': return 'badge-info';
    case 'departmental': return 'badge-secondary';
    default: return 'badge-secondary';
  }
}

// Modal utilities
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Loading state utilities
function showLoading(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = `
      <div class="loading">
        <div class="spinner"></div>
      </div>
    `;
  }
}

// Smooth scroll utility
function smoothScrollTo(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

// Mobile menu utilities with accessibility
function toggleMobileMenu() {
  const navMenu = document.querySelector('.nav-menu');
  const toggle = document.querySelector('.mobile-menu-toggle');
  
  if (navMenu && toggle) {
    const isOpen = navMenu.classList.contains('active');
    
    navMenu.classList.toggle('active');
    toggle.setAttribute('aria-expanded', (!isOpen).toString());
    
    const icon = toggle.querySelector('[aria-hidden]');
    if (icon) {
      icon.textContent = isOpen ? '☰' : '✕';
    }
    
    // Focus management
    if (!isOpen) {
      // Menu is opening - focus first menu item
      const firstLink = navMenu.querySelector('.nav-link');
      if (firstLink) firstLink.focus();
    }
  }
}

// Header scroll effect + auto-hide on scroll down, show on scroll up
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  const onScroll = () => {
    const currentY = window.scrollY;

    // Add compact style once scrolled a bit
    if (currentY > 50) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }

    // Auto hide/show based on direction (ignore very small movements)
    const delta = currentY - lastScrollY;
    const threshold = 6; // small threshold to reduce jitter

    if (Math.abs(delta) > threshold) {
      if (delta > 0 && currentY > 100) {
        // Scrolling down
        header.classList.add('header-hidden');
      } else {
        // Scrolling up
        header.classList.remove('header-hidden');
      }
      lastScrollY = currentY;
    }

    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
}

// Initialize animations on scroll
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  });

  // Observe all elements with fade-in-up class
  document.querySelectorAll('.fade-in-up').forEach((el) => {
    observer.observe(el);
  });
}

// Performance optimizations
// Preload critical resources
function preloadCriticalResources() {
  const criticalImages = [
    './images/1.png',
    './images/2.png', 
    './images/3.png'
  ];
  
  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

// Optimize image loading with intersection observer
function optimizeImageLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// Service Worker registration for offline support
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
}

// URL utilities for navigation
function getPageFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('page') || 'home';
}

function setPageURL(page) {
  const url = new URL(window.location);
  url.searchParams.set('page', page);
  window.history.pushState({}, '', url);
}

// Debounce utility for search and filters
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
