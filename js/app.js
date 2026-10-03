// CampusConnect Main Application - Multi-page Version
let eventsData = null;
let galleryData = null;
let contactsData = null;
let aboutData = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', async function() {
  // Load data
  await loadData();
  
  // Initialize components
  initializeApp();
  
  // Determine current page from body data attribute
  const page = document.body.getAttribute('data-page') || 'home';
  loadPage(page);
});

// Load all JSON data
async function loadData() {
  try {
    showLoading('content');
    
    eventsData = await loadJSON('data/events.json');
    galleryData = await loadJSON('data/gallery.json');
    contactsData = await loadJSON('data/contacts.json');
    aboutData = await loadJSON('data/about.json');
    
    if (!eventsData || !galleryData || !contactsData || !aboutData) {
      throw new Error('Failed to load data');
    }
  } catch (error) {
    console.error('Error loading application data:', error);
    document.getElementById('content').innerHTML = `
      <div class="container section text-center">
        <h2>Error Loading Data</h2>
        <p>Please check your connection and try again.</p>
        <button class="btn btn-primary" onclick="location.reload()">Reload</button>
      </div>
    `;
  }
}

// Initialize app components
function initializeApp() {
  renderHeader();
  renderFooter();
  initHeaderScroll();
  
  // Performance optimizations
  preloadCriticalResources();
  optimizeImageLoading();
  registerServiceWorker();
  
  // Close mobile menu on window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      const navMenu = document.querySelector('.nav-menu');
      if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        const toggle = document.querySelector('.mobile-menu-toggle');
        if (toggle) {
          toggle.setAttribute('aria-expanded', 'false');
          const icon = toggle.querySelector('[aria-hidden]');
          if (icon) icon.textContent = '☰';
        }
      }
    }
  });
}

// Render header navigation
function renderHeader() {
  const header = document.getElementById('site-header');
  const currentPage = document.body.getAttribute('data-page') || 'home';
  
  header.innerHTML = `
    <div class="container">
      <nav class="navbar" role="navigation" aria-label="Main navigation">
        <a href="index.html" class="logo" aria-label="CampusConnect - Home">CampusConnect</a>
        
        <ul class="nav-menu" role="menubar">
          <li role="none"><a href="index.html" class="nav-link ${currentPage === 'home' ? 'active' : ''}" role="menuitem" ${currentPage === 'home' ? 'aria-current="page"' : ''}>Home</a></li>
          <li role="none"><a href="events.html" class="nav-link ${currentPage === 'events' ? 'active' : ''}" role="menuitem" ${currentPage === 'events' ? 'aria-current="page"' : ''}>Events</a></li>
          
          <li role="none"><a href="gallery.html" class="nav-link ${currentPage === 'gallery' ? 'active' : ''}" role="menuitem" ${currentPage === 'gallery' ? 'aria-current="page"' : ''}>Gallery</a></li>
          <li role="none"><a href="bookmarks.html" class="nav-link ${currentPage === 'bookmarks' ? 'active' : ''}" role="menuitem" ${currentPage === 'bookmarks' ? 'aria-current="page"' : ''}><span aria-hidden="true"></span> Bookmarks</a></li>
          <li role="none"><a href="about.html" class="nav-link ${currentPage === 'about' ? 'active' : ''}" role="menuitem" ${currentPage === 'about' ? 'aria-current="page"' : ''}>About</a></li>
          <li role="none"><a href="feedback.html" class="nav-link ${currentPage === 'feedback' ? 'active' : ''}" role="menuitem" ${currentPage === 'feedback' ? 'aria-current="page"' : ''}>Feedback</a></li>
          <li role="none"><a href="contact.html" class="nav-link ${currentPage === 'contact' ? 'active' : ''}" role="menuitem" ${currentPage === 'contact' ? 'aria-current="page"' : ''}>Contact</a></li>
        </ul>
        
        <button class="mobile-menu-toggle" onclick="toggleMobileMenu()" aria-label="Toggle mobile menu" aria-expanded="false">
          <span aria-hidden="true">☰</span>
        </button>
      </nav>
    </div>
  `;
}

// Render footer
function renderFooter() {
  const footer = document.getElementById('site-footer');
  
  footer.innerHTML = `
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>CampusConnect</h3>
          <p>Your central hub for college events. Stay updated, stay involved!</p>
        </div>
        
        <div class="footer-section">
          <h3>Quick Links</h3>
          <ul class="footer-links">
            <li><a href="index.html">Home</a></li>
            <li><a href="events.html">Events</a></li>
            <li><a href="gallery.html">Gallery</a></li>
            <li><a href="contact.html">Contact</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h3>Categories</h3>
          <ul class="footer-links">
            <li><a href="events.html">Technical</a></li>
            <li><a href="events.html">Cultural</a></li>
            <li><a href="events.html">Sports</a></li>
            <li><a href="events.html">Academic</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h3>Contact Info</h3>
          <ul class="footer-links">
            <li>📍 Aptech NN</li>
            <li>📞 +92-1234567890</li>
            <li>✉️ info@aptechnn.edu</li>
          </ul>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2024 CampusConnect - Excellence Institute of Technology. All rights reserved.</p>
      </div>
    </div>
  `;
}

// Load page content
function loadPage(page, filter = null) {
  const content = document.getElementById('content');
  
  switch (page) {
    case 'home':
      renderHomePage(content);
      break;
    case 'about':
      renderAboutPage(content);
      break;
    case 'events':
      renderEventsPage(content, filter);
      break;
    
    case 'gallery':
      renderGalleryPage(content, filter);
      break;
    case 'feedback':
      renderFeedbackPage(content);
      break;
    case 'contact':
      renderContactPage(content);
      break;
    case 'bookmarks':
      renderBookmarksPage(content);
      break;
    case 'event-detail':
      renderEventDetailPage(content);
      break;
    default:
      renderHomePage(content);
  }
  
  setTimeout(() => {
    initScrollAnimations();
  }, 100);
}

// Render Home Page
function renderHomePage(content) {
  if (!eventsData) return;
  
  const upcomingEvents = eventsData.events.filter(event => event.status === 'upcoming').slice(0, 6);
  const nextUpcomingEvent = getNextUpcomingEvent();
  const featuredEvent = getFeaturedEvent();
  const newsUpdates = generateNewsUpdates();
  
  content.innerHTML = `
    <!-- Hero Carousel -->
    <section class="hero-carousel">
      <div class="carousel-container">
        <div class="carousel-slide active slide-1">
          <div class="carousel-content">
            <h1>Welcome to CampusConnect</h1>
            <p>Where Campus Life Comes Alive!</p>
          </div>
        </div>
        
        <div class="carousel-slide slide-2">
          <div class="carousel-content">
            <h1>Stay Ahead</h1>
            <p>Track Every Technical, Cultural & Sports Event</p>
          </div>
        </div>
        
        <div class="carousel-slide slide-3">
          <div class="carousel-content">
            <h1>Celebrate, Compete, Connect</h1>
            <p>All Events, One Hub</p>
          </div>
        </div>
        
        <button class="carousel-arrows carousel-prev" onclick="previousSlide()">‹</button>
        <button class="carousel-arrows carousel-next" onclick="nextSlide()">›</button>
        
        <div class="carousel-nav">
          <div class="carousel-dot active" onclick="currentSlide(1)"></div>
          <div class="carousel-dot" onclick="currentSlide(2)"></div>
          <div class="carousel-dot" onclick="currentSlide(3)"></div>
        </div>
      </div>
    </section>

    <!-- Event Categories Section -->
    <section class="categories-section">
      <div class="container">
        <div class="section-header">
          <h2>Event Categories</h2>
          <p>Explore events by category and find what interests you most</p>
        </div>
    
        <div class="grids grids-4">
          <!-- Technical -->
          <a href="events.html?filter=technical" class="category-cards technical fade-in-ups">
            <div class="curtain">
              <div class="category-icons">💻</div>
              <h3>Technical</h3>
            </div>
            <div class="subcategory">
              <div class="subcategory-content">
                <p class="subcategory-intro">These are the events under this category:</p>
                <ul class="subcategory-list">
                  <li>Hackathons</li>
                  <li>Coding competitions</li>
                  <li>Workshops</li>
                  <li>Tech talks</li>
                </ul>
              </div>
            </div>
          </a>
    
          <!-- Cultural -->
          <a href="events.html?filter=cultural" class="category-cards cultural fade-in-ups">
            <div class="curtain">
              <div class="category-icons">🎭</div>
              <h3>Cultural</h3>
            </div>
            <div class="subcategory">
              <div class="subcategory-content">
                <p class="subcategory-intro">These are the events under this category:</p>
                <ul class="subcategory-list">
                  <li>Dance</li>
                  <li>Music</li>
                  <li>Drama</li>
                  <li>Art exhibitions</li>
                  <li>Cultural festivals</li>
                </ul>
              </div>
            </div>
          </a>
    
          <!-- Sports -->
          <a href="events.html?filter=sports" class="category-cards sports fade-in-ups">
            <div class="curtain">
              <div class="category-icons">🏆</div>
              <h3>Sports</h3>
            </div>
            <div class="subcategory">
              <div class="subcategory-content">
                <p class="subcategory-intro">These are the events under this category:</p>
                <ul class="subcategory-list">
                  <li>Cricket</li>
                  <li>Football</li>
                  <li>Basketball</li>
                  <li>Athletics</li>
                  <li>Fitness events</li>
                </ul>
              </div>
            </div>
          </a>
    
          <!-- Departmental -->
          <a href="events.html?filter=departmental" class="category-cards departmental fade-in-ups">
            <div class="curtain">
              <div class="category-icons">🎓</div>
              <h3>Departmental</h3>
            </div>
            <div class="subcategory">
              <div class="subcategory-content">
                <p class="subcategory-intro">These are the events under this category:</p>
                <ul class="subcategory-list">
                  <li>Department symposiums</li>
                  <li>Seminars</li>
                  <li>Academic conferences</li>
                </ul>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- Countdown Timer Section -->
    <section class="countdown-section" id="countdown">
      <div class="container">
        <div class="countdown-content">
          <h2 class="countdown-title">Next Event Countdown</h2>
          ${nextUpcomingEvent ? `
            <div class="event-name" id="countdown-event-name">${nextUpcomingEvent.name}</div>
            <div class="countdown-timer" id="countdown-timer">
              <div class="countdown-unit">
                <span class="countdown-number" id="days">00</span>
                <div class="countdown-label">Days</div>
              </div>
              <div class="countdown-unit">
                <span class="countdown-number" id="hours">00</span>
                <div class="countdown-label">Hours</div>
              </div>
              <div class="countdown-unit">
                <span class="countdown-number" id="minutes">00</span>
                <div class="countdown-label">Minutes</div>
              </div>
              <div class="countdown-unit">
                <span class="countdown-number" id="seconds">00</span>
                <div class="countdown-label">Seconds</div>
              </div>
            </div>
            <a href="event-detail.html?id=${nextUpcomingEvent.id}" class="btn btn-primary">View Event Details</a>
          ` : `
            <!-- Beautiful No Events Fallback -->
            <div class="no-events-container">
              <div class="no-events-icon">🎯</div>
              <h3 class="no-events-title">No Upcoming Events</h3>
              <p class="no-events-message">We're currently planning some amazing events for you! Check back soon or explore our past events to see what's been happening on campus.</p>
              <a href="events.html" class="no-events-cta">Explore All Events</a>
            </div>
          `}
        </div>
      </div>
    </section>

    <!-- Featured Event Section -->
    ${featuredEvent ? `
      <section class="featured-section">
        <div class="container">
          <div class="section-header">
            <h2>Featured Event of the Month</h2>
            <p>Don't miss this month's biggest celebration</p>
          </div>
          
          <div class="featured-event">
            <div class="featured-bg" style="background-image: url('${featuredEvent.image}')"></div>
            <div class="featured-content">
              <div class="featured-badge">✨ Featured Event</div>
              <h2 class="featured-title">${featuredEvent.name}</h2>
              <p class="featured-description">${featuredEvent.longDescription || featuredEvent.description}</p>
              
              <div class="featured-meta">
                <div class="featured-meta-item">
                  <span>📅</span>
                  <span>${formatDate(featuredEvent.date)}</span>
                </div>
                <div class="featured-meta-item">
                  <span>⏰</span>
                  <span>${featuredEvent.time}</span>
                </div>
                <div class="featured-meta-item">
                  <span>📍</span>
                  <span>${featuredEvent.venue}</span>
                </div>
              </div>
              
              <a href="event-detail.html?id=${featuredEvent.id}" class="btn btn-primary">Learn More</a>
            </div>
          </div>
        </div>
      </section>
    ` : ''}

    <!-- Event Highlights Section -->
    <section class="highlights-section" id="highlights">
      <div class="container">
        <div class="section-header">
          <h2>Event Highlights</h2>
          <p>Don't miss out on these exciting upcoming events!</p>
        </div>
        
        <div class="grid grid-3">
          ${upcomingEvents.map((event, index) => `
            <article class="card event-card fade-in-up" style="animation-delay: ${index * 0.2}s">
              <img src="${event.image}" alt="${event.name}" class="card-image" 
                   onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
              <div class="image-fallback" style="display:none; background:var(--card-bg); color:var(--text-secondary); height:200px; align-items:center; justify-content:center; font-size:14px; text-align:center; padding:20px;">
                <div>
                  <div style="font-size:24px; margin-bottom:8px;">🎯</div>
                  <div>${event.name}</div>
                </div>
              </div>
              <div class="card-content">
                <div class="d-flex justify-between align-center mb-2">
                  <h3 class="card-title">${event.name}</h3>
                  <button class="bookmark-btn ${BookmarkManager.isBookmarked('events', event.id) ? 'bookmarked' : ''}" 
                          onclick="toggleEventBookmark(${event.id})" 
                          title="${BookmarkManager.isBookmarked('events', event.id) ? 'Remove from bookmarks' : 'Add to bookmarks'}">
                    ❤️
                  </button>
                </div>
                
                <div class="card-meta">
                  <span class="card-meta-item">📅 ${formatDate(event.date)}</span>
                  <span class="card-meta-item">⏰ ${event.time}</span>
                  <span class="card-meta-item">📍 ${event.venue}</span>
                </div>
                
                <div class="mb-2">
                  <span class="badge badge-success">${event.status}</span>
                  <span class="badge badge-${getCategoryBadgeClass(event.category).replace('badge-', '')}">${event.category}</span>
                </div>
                
                <p class="card-text">${event.description}</p>
                
                <div class="card-organizer">
                  <small class="text-secondary">by ${event.organizer}</small>
                </div>
                
                <!-- Learn More Button - Inside card content -->
                <a class="card-action-button" href="event-detail.html?id=${event.id}">
                  Learn More
                </a>
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials-section">
      <div class="container">
        <div class="section-header">
          <h2>What Our Community Says</h2>
          <p>Hear from students and faculty about their CampusConnect experience</p>
        </div>
        
        <div class="testimonials-grid">
          <div class="testimonial-card fade-in-up">
            <div class="testimonial-text">
              CampusConnect helped me never miss a single event! The notifications and bookmarking feature are game-changers.
            </div>
            <div class="testimonial-author">Sir Abdul Wadood</div>
            <div class="testimonial-role">Computer Science Head</div>
          </div>
          
          <div class="testimonial-card fade-in-up" style="animation-delay: 0.2s">
            <div class="testimonial-text">
              CampusConnect made organizing events so much easier! I love how effortlessly students can find and engage with our activities.
            </div>
            <div class="testimonial-author">Prof. Ahmed</div>
            <div class="testimonial-role">Cultural Committee Head</div>
          </div>
          
          <div class="testimonial-card fade-in-up" style="animation-delay: 0.4s">
            <div class="testimonial-text">
              The gallery feature is amazing! I can relive all the wonderful moments from past events and share them with friends.
            </div>
            <div class="testimonial-author">Moiz Ahmed</div>
            <div class="testimonial-role">2nd Year Student</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>Ready to Dive In?</h2>
          <p>Explore all events, join the celebrations, and be part of the vibrant campus community</p>
          <div class="cta-buttons">
            <a href="events.html" class="cta-btn">Explore Events →</a>
            <a href="gallery.html" class="cta-btn">Join the Celebration →</a>
          </div>
        </div>
      </div>
    </section>

    <!-- USP Section -->


    <!-- Features Section -->
    <section class="section bg-light">
      <div class="container">
        <div class="section-header">
          <h2>Why Choose CampusConnect?</h2>
          <p>Your one-stop destination for all college events</p>
        </div>
        
        <div class="grid grid-3">
          <div class="card text-center fade-in-up">
            <div class="card-content">
              <div style="font-size: 3rem; margin-bottom: 1rem; animation: pulse 2s infinite;">🎯</div>
              <h3>Stay Updated</h3>
              <p>Get real-time updates about all college events, never miss an important announcement.</p>
            </div>
          </div>
          
          <div class="card text-center fade-in-up" style="animation-delay: 0.2s">
            <div class="card-content">
              <div style="font-size: 3rem; margin-bottom: 1rem; animation: pulse 2s infinite 0.5s;">📅</div>
              <h3>Easy Planning</h3>
              <p>Browse events by category, date, and location. Plan your schedule effortlessly.</p>
            </div>
          </div>
          
          <div class="card text-center fade-in-up" style="animation-delay: 0.4s">
            <div class="card-content">
              <div style="font-size: 3rem; margin-bottom: 1rem; animation: pulse 2s infinite 1s;">❤️</div>
              <h3>Bookmark Favorites</h3>
              <p>Save events and gallery images you love. Create your personal collection.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- News Ticker -->
    <section class="news-ticker">
      <div class="container">
        <div class="ticker-container">
          <div class="ticker-label">📢 Latest Updates</div>
          <div class="ticker-content">
            <div class="ticker-text">${newsUpdates}</div>
          </div>
        </div>
      </div>
    </section>
  `;
  
  // Initialize carousel and countdown after content is loaded
  setTimeout(() => {
    initializeCarousel();
    initScrollAnimations();
    if (nextUpcomingEvent) {
      startCountdown(nextUpcomingEvent.date);
    }
  }, 100);
}

  // Render About Page - Modern Design
  function renderAboutPage(content) {
    if (!aboutData) return;
    
    const college = aboutData.college;
    const events = aboutData.annualEvents;
    const timeline = aboutData.timeline;
    const organizingBodies = aboutData.organizingBodies;
    const stats = aboutData.statistics;
    
    content.innerHTML = `
      <!-- Hero Section with Animated Background -->
      <section class="about-hero">
        <div class="about-hero-bg">
          <div class="floating-shapes">
            <div class="shape shape-1"></div>
            <div class="shape shape-2"></div>
            <div class="shape shape-3"></div>
            <div class="shape shape-4"></div>
          </div>
        </div>
        <div class="container">
          <div class="about-hero-content">
            <h1 class="about-hero-title">About CampusConnect</h1>
            <p class="about-hero-subtitle">More than just events – we're the heartbeat of campus life</p>
            <div class="about-hero-stats">
              <div class="hero-stat animated-counter" data-target="50">
                <div class="stat-number counter-number">0</div>
                <div class="stat-label">Annual Events</div>
              </div>
              <div class="hero-stat animated-counter" data-target="5000">
                <div class="stat-number counter-number">0</div>
                <div class="stat-label">Participants</div>
              </div>
              <div class="hero-stat animated-counter" data-target="20">
                <div class="stat-number counter-number">0</div>
                <div class="stat-label">Departments</div>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      <!-- College Overview with Animated Cards -->
      <section class="college-overview">
        <div class="container">
          <div class="section-header text-center">
            <h2>Excellence Institute of Technology</h2>
            <p class="section-subtitle">${college.description}</p>
          </div>
          
          <div class="overview-cards">
            <div class="overview-card education-card fade-in-left">
              <div class="card-icon">🎓</div>
              <div class="card-content">
                <h3>Education</h3>
                <p>World-class education with cutting-edge curriculum and experienced faculty</p>
                <ul class="card-features">
                  <li>8 Engineering Departments</li>
                  <li>450+ Faculty Members</li>
                  <li>95% Placement Rate</li>
                </ul>
              </div>
            </div>
            

            
            <div class="overview-card culture-card fade-in-right">
              <div class="card-icon">🎭</div>
              <div class="card-content">
                <h3>Culture</h3>
                <p>Rich cultural heritage with diverse festivals and artistic expressions</p>
                <ul class="card-features">
                  <li>Cultural Festivals</li>
                  <li>Art Exhibitions</li>
                  <li>Literary Events</li>
                </ul>
              </div>
            </div>
            
            <div class="overview-card sports-card fade-in-left" style="animation-delay: 0.3s">
              <div class="card-icon">⚽</div>
              <div class="card-content">
                <h3>Sports</h3>
                <p>Promoting physical fitness and team spirit through various sports activities</p>
                <ul class="card-features">
                  <li>Sports Complex</li>
                  <li>Olympic Pool</li>
                  <li>Inter-college Competitions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Interactive Timeline -->
      <section class="events-timeline">
        <div class="container">
          <div class="section-header text-center">
            <h2>Annual Events Timeline</h2>
            <p class="section-subtitle">Journey through our year-long celebration</p>
          </div>
          
          <div class="timeline-container">
            <div class="timeline-line"></div>
            ${timeline.map((item, index) => `
              <div class="timeline-item ${index % 2 === 0 ? 'timeline-left' : 'timeline-right'} fade-in-timeline" style="animation-delay: ${index * 0.2}s">
                <div class="timeline-content">
                  <div class="timeline-icon bg-${item.color}">
                    ${item.icon}
                  </div>
                  <div class="timeline-card">
                    <div class="timeline-month">${item.month}</div>
                    <h3 class="timeline-event">${item.event}</h3>
                    <p class="timeline-description">${item.description}</p>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
  
      <!-- Mission & Vision with Split Design -->
     
      <!-- Organizing Bodies with Hover/Flip Cards -->
      <section class="organizing-bodies">
        <div class="container">
          <div class="section-header text-center">
            <h2>Event Organizing Bodies</h2>
            <p class="section-subtitle">Meet the teams behind our spectacular events</p>
          </div>
          
          <div class="organizing-grid">
            ${organizingBodies.map((body, index) => `
              <div class="flip-card fade-in-up" style="animation-delay: ${index * 0.1}s">
                <div class="flip-card-inner">
                  <div class="flip-card-front bg-${body.color}">
                    <div class="flip-icon">${body.icon}</div>
                    <h3 class="flip-title">${body.name}</h3>
                    <p class="flip-subtitle">${body.description}</p>
                  </div>
                  <div class="flip-card-back">
                    <h3>${body.name}</h3>
                    <div class="responsibilities">
                      <h4>Key Responsibilities:</h4>
                      <ul>
                        ${body.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
  
      <!-- Animated Statistics Counter
      <section class="statistics-section">
        <div class="container">
          <div class="section-header text-center">
            <h2>CampusConnect by Numbers</h2>
            <p class="section-subtitle">Our impact in numbers</p>
          </div>
          
          <div class="stats-grid">
            <div class="stat-item fade-in-up" data-target="50">
              <div class="stat-icon">🎉</div>
              <div class="stat-number" id="stat-events">0</div>
              <div class="stat-label">Annual Events</div>
            </div>
            
            <div class="stat-item fade-in-up" data-target="5000" style="animation-delay: 0.2s">
              <div class="stat-icon">👥</div>
              <div class="stat-number" id="stat-participants">0</div>
              <div class="stat-label">Participants</div>
            </div>
            
            <div class="stat-item fade-in-up" data-target="20" style="animation-delay: 0.4s">
              <div class="stat-icon">🏢</div>
              <div class="stat-number" id="stat-departments">0</div>
              <div class="stat-label">Departments</div>
            </div>
            
            <div class="stat-item fade-in-up" data-target="100" style="animation-delay: 0.6s">
              <div class="stat-icon">❤️</div>
              <div class="stat-number" id="stat-spirit">0</div>
              <div class="stat-label">Campus Spirit %</div>
            </div>
          </div>
        </div>
      </section>-->
  
      <!-- Core Values with Gradient Cards -->
      <section class="core-values">
        <div class="container">
          <div class="section-header text-center">
            <h2>Our Core Values</h2>
            <p class="section-subtitle">The principles that guide our journey</p>
          </div>
          
          <div class="values-grid">
            ${college.coreValues.map((value, index) => `
              <div class="value-card fade-in-up" style="animation-delay: ${index * 0.15}s">
                <div class="value-content">
                  <h3>${value.title}</h3>
                  <p>${value.description}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
    
    // Initialize animations and counters after content is loaded
    setTimeout(() => {
      initScrollAnimations();
      initCounterAnimations();
      initTimelineAnimations();
    }, 100);
  }

// Render Events Page with enhanced features
function renderEventsPage(content, initialFilter = null) {
  if (!eventsData || !eventsData.events) {
    content.innerHTML = `
      <section class="section">
        <div class="container text-center">
          <h2>Loading Events...</h2>
          <p>Please wait while we fetch the latest events.</p>
        </div>
      </section>
    `;
    return;
  }
  
  const categories = ['all', 'technical', 'cultural', 'sports', 'academic', 'departmental'];
  const upcomingEvents = eventsData.events.filter(event => event.status === 'upcoming');
  const pastEvents = eventsData.events.filter(event => event.status === 'past');
  
  // Get the next upcoming event for featured banner
  const nextUpcomingEvent = getNextUpcomingEvent();
  
  content.innerHTML = `
    <!-- Featured Upcoming Event Banner -->
    ${nextUpcomingEvent ? `
      <section class="featured-event-banner">
        <div class="container">
          <div class="featured-banner-content">
            <div class="featured-banner-info">
              <div class="featured-badge">🌟 Next Event</div>
              <h2 class="featured-event-title">${nextUpcomingEvent.name}</h2>
              <p class="featured-event-description">${nextUpcomingEvent.description}</p>
              <div class="featured-event-meta">
                <span class="meta-item">📅 ${formatDate(nextUpcomingEvent.date)}</span>
                <span class="meta-item">⏰ ${nextUpcomingEvent.time}</span>
                <span class="meta-item">📍 ${nextUpcomingEvent.venue}</span>
              </div>
              <div class="featured-actions">
                <a href="event-detail.html?id=${nextUpcomingEvent.id}" class="btn btn-primary btn-large">
                  Learn More
                </a>
                <button class="btn btn-outline bookmark-featured ${BookmarkManager.isBookmarked('events', nextUpcomingEvent.id) ? 'bookmarked' : ''}" 
                        onclick="toggleEventBookmark(${nextUpcomingEvent.id})">
                  ${BookmarkManager.isBookmarked('events', nextUpcomingEvent.id) ? '❤️ Bookmarked' : '🤍 Bookmark'}
                </button>
              </div>
            </div>
            <div class="featured-banner-image">
              <img src="${nextUpcomingEvent.image}" alt="${nextUpcomingEvent.name}" 
                   onerror="this.src='https://via.placeholder.com/500x300?text=${encodeURIComponent(nextUpcomingEvent.name)}'">
              <div class="featured-overlay"></div>
            </div>
          </div>
        </div>
      </section>
    ` : ''}

    <!-- Events Catalog Section -->
    <section class="events-catalog-section">
      <div class="container">
        <div class="section-header text-center">
          <h1>Events Catalog</h1>
          <p>Discover all the amazing events happening at our college</p>
        </div>
        
        <!-- Controls Row -->
        <div class="events-controls">
          <!-- Search Bar -->
          <div class="search-section">
            <h3>Search Events</h3>
            <div class="search-box-container">
              <input type="text" 
                     id="eventSearchInput" 
                     class="search-input custom-input-1" 
                     placeholder="Search by name, organizer, or category..."
                     oninput="handleEventSearch(this.value)">
            </div>
          </div>
          
       
          
          <!-- Sort Controls -->
          <div class="sort-section">
            <h3>Sort Events</h3>
            <div class="sort-controls">
              <select id="sortSelect" class="sort-select" onchange="sortEventsBy(this.value)">
                <option value="date">📅 By Date</option>
                <option value="name">🔤 Alphabetical</option>
                <option value="category">📂 By Category</option>
                <option value="priority">⭐ By Priority</option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- Event Stats -->
        <div class="events-stats">
          <div class="stat-card">
            <div class="stat-number" id="total-events">${eventsData.events.length}</div>
            <div class="stat-label">Total Events</div>
          </div>
          <div class="stat-card">
            <div class="stat-number" id="upcoming-events">${upcomingEvents.length}</div>
            <div class="stat-label">Upcoming</div>
          </div>
          <div class="stat-card">
            <div class="stat-number" id="past-events">${pastEvents.length}</div>
            <div class="stat-label">Past Events</div>
          </div>
        </div>
        
        <!-- Loading Indicator -->
        <div id="loading-indicator" class="loading-indicator hidden">
          <div class="loader"></div>
          <p>Loading events...</p>
        </div>
        
        <!-- Events Grid -->
        <div id="events-grid" class="events-grid">
          <!-- Events will be populated here -->
        </div>
        
        <!-- Empty State -->
        <div id="empty-state" class="empty-state text-center hidden">
          <div class="empty-icon">🔍</div>
          <h3>No events found</h3>
          <p>Try adjusting your filters to see more events.</p>
          <button class="btn btn-outline" onclick="filterEventsByCategory('all')">Show All Events</button>
        </div>
      </div>
    </section>

    <!-- Past Events Section -->
    ${pastEvents.length > 0 ? `
      <section class="past-events-section">
        <div class="container">
          <div class="section-header text-center">
            <h2>Past Events Gallery</h2>
            <p>Relive the memorable moments from our previous events</p>
          </div>
          <div class="past-events-grid">
            ${pastEvents.slice(0, 6).map((event, index) => `
              <div class="past-event-card fade-in-up" style="animation-delay: ${index * 0.1}s">
                <div class="past-event-image">
                  <img src="${event.image}" alt="${event.name}" 
                       onerror="this.src='https://via.placeholder.com/300x200?text=${encodeURIComponent(event.name)}'">
                  <div class="past-event-overlay">
                    <div class="past-event-date">${formatDate(event.date)}</div>
                  </div>
                </div>
                <div class="past-event-info">
                  <h4>${event.name}</h4>
                  <p>${event.description.substring(0, 80)}...</p>
                  <span class="past-event-category ${getCategoryClass(event.category)}">${event.category}</span>
                </div>
              </div>
            `).join('')}
          </div>
          ${pastEvents.length > 6 ? `
            <div class="text-center mt-3">
              <button class="btn btn-outline" onclick="togglePastEvents()">View All Past Events</button>
            </div>
          ` : ''}
        </div>
      </section>
    ` : ''}

    <!-- Event Detail Modal -->
    <div id="eventModal" class="modal">
      <div class="modal-content">
        <button class="modal-close" onclick="closeEventModal()">×</button>
        <div id="eventModalContent"></div>
      </div>
    </div>
  `;
  
  // Initialize events display
  setTimeout(() => {
    initEventsPage(initialFilter);
  }, 100);
}

// Initialize Events Page functionality
function initEventsPage(initialFilter = 'all') {
  // Initialize with animations
  initScrollAnimations();
  
  // Set initial filter and display events
  filterEventsByCategory(initialFilter);
  
  // Initialize modal functionality
  initEventModal();
}

// Enhanced filter function with animations
function filterEventsByCategory(category) {
  if (!eventsData || !eventsData.events) return;
  
  // Update active filter button
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-category') === category) {
      btn.classList.add('active');
    }
  });
  
  // Apply search and filters together
  applySearchAndFilters();
}

// Search state
let currentSearchQuery = '';
let searchDebounceTimer = null;

// Handle event search with debounce
window.handleEventSearch = function(query) {
  currentSearchQuery = query.trim().toLowerCase();
  
  // Show/hide clear button
  const clearBtn = document.getElementById('searchClearBtn');
  if (clearBtn) {
    clearBtn.style.display = currentSearchQuery ? 'block' : 'none';
  }
  
  // Debounce search
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
  
  searchDebounceTimer = setTimeout(() => {
    applySearchAndFilters();
  }, 300);
};

// Clear search
window.clearEventSearch = function() {
  const searchInput = document.getElementById('eventSearchInput');
  const clearBtn = document.getElementById('searchClearBtn');
  
  if (searchInput) searchInput.value = '';
  if (clearBtn) clearBtn.style.display = 'none';
  
  currentSearchQuery = '';
  applySearchAndFilters();
};

// Apply search and filters together
function applySearchAndFilters() {
  if (!eventsData || !eventsData.events) return;
  
  showLoadingIndicator();
  
  setTimeout(() => {
    let events = eventsData.events.filter(event => event.status === 'upcoming');
    
    // Apply category filter
    const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-category') || 'all';
    events = filterEvents(events, activeFilter);
    
    // Apply search filter
    if (currentSearchQuery) {
      events = events.filter(event => {
        const searchableText = [
          event.name,
          event.organizer,
          event.category,
          event.description,
          event.venue
        ].join(' ').toLowerCase();
        
        return searchableText.includes(currentSearchQuery);
      });
    }
    
    // Apply sort
    const sortBy = document.getElementById('sortSelect')?.value || 'date';
    const sorted = sortEvents(events, sortBy);
    
    displayEventsWithAnimation(sorted);
    hideLoadingIndicator();
  }, 200);
}

// Enhanced sort function
function sortEventsBy(sortBy) {
  applySearchAndFilters();
}

// Display events with staggered animations
function displayEventsWithAnimation(events) {
  const grid = document.getElementById('events-grid');
  const emptyState = document.getElementById('empty-state');
  
  if (!grid) return;
  
  if (events.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }
  
  if (emptyState) emptyState.classList.add('hidden');
  
  // Fade out existing events
  grid.style.opacity = '0';
  
  setTimeout(() => {
    grid.innerHTML = events.map((event, index) => createEnhancedEventCard(event, index)).join('');
    grid.style.opacity = '1';
    
    // Initialize card animations
    setTimeout(() => {
      initScrollAnimations();
    }, 100);
  }, 150);
}

// Create enhanced event card with animations and hover effects
function createEnhancedEventCard(event, index) {
  const isBookmarked = BookmarkManager.isBookmarked('events', event.id);
  const statusClass = event.status === 'upcoming' ? 'status-upcoming' : 'status-past';
  const categoryClass = getCategoryClass(event.category);
  const priorityClass = getPriorityClass(event.priority);
  
  return `
    <article class="enhanced-event-card ${categoryClass} ${priorityClass} fade-in-up" 
             style="animation-delay: ${index * 0.1}s" data-category="${event.category.toLowerCase()}">
      
      <!-- Card Header -->
      <div class="event-card-header">
        <div class="event-status ${statusClass}">${event.status.toUpperCase()}</div>
        <button class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" 
                onclick="toggleEventBookmark(${event.id})" 
                title="${isBookmarked ? 'Remove bookmark' : 'Add bookmark'}">
          <span class="bookmark-icon">${isBookmarked ? '❤️' : '🤍'}</span>
        </button>
      </div>
      
      <!-- Event Image -->
      <div class="event-image-container">
        <img src="${event.image}" alt="${event.name}" class="event-image" 
             onerror="this.src='https://via.placeholder.com/400x250/667eea/ffffff?text=${encodeURIComponent(event.name)}'">
        <div class="event-image-overlay">
          <div class="event-category-tag ${categoryClass}">
            <span class="category-icon">${getCategoryIcon(event.category)}</span>
            <span>${event.category}</span>
          </div>

        </div>
        <div class="event-quick-actions">
         
          <button class="quick-action-btn" onclick="shareEvent(${event.id})" title="Share Event">
            🔗
          </button>
        </div>
      </div>
      
      <!-- Event Content -->
      <div class="event-content">
        <div class="event-priority priority-${event.priority || 1}"></div>
        
        <h3 class="event-title">${event.name}</h3>
        <p class="event-description">${event.description}</p>
        
        <!-- Event Meta Info -->
        <div class="event-meta">
          <div class="meta-row">
            <span class="meta-item">
              <span class="meta-icon">📅</span>
              <span class="meta-text">${formatDate(event.date)}</span>
            </span>
            <span class="meta-item">
              <span class="meta-icon">⏰</span>
              <span class="meta-text">${event.time}</span>
            </span>
          </div>
          <div class="meta-row">
            <span class="meta-item">
              <span class="meta-icon">📍</span>
              <span class="meta-text">${event.venue}</span>
            </span>
            <span class="meta-item organizer">
              <span class="meta-icon">👥</span>
              <span class="meta-text">${event.organizer}</span>
            </span>
          </div>
        </div>
        
        <!-- Registration Info -->
        ${event.registrationRequired ? `
          <div class="registration-required">
            <span class="registration-icon">âš ï¸</span>
            <span>Registration Required</span>
          </div>
        ` : ''}
        <!-- Card Actions - Inside the content div -->
        <div class="event-actions">
          <a href="event-detail.html?id=${event.id}" class="card-action-button">
            Learn More
          </a>
        </div>
      </div>
      
      <!-- Hover Effects -->
      <div class="card-hover-effect"></div>
    </article>
  `;
}

// Helper functions
function getCategoryIcon(category) {
  const icons = {
    'all': '🎆',
    'technical': '💻',
    'cultural': '🎭',
    'sports': '🏆',
    'academic': '🎓',
    'departmental': '🏢'
  };
  return icons[category.toLowerCase()] || '🎯';
}

function getCategoryClass(category) {
  return `category-${category.toLowerCase()}`;
}

function getPriorityClass(priority) {
  return `priority-${priority || 1}`;
}

// Loading indicator functions
function showLoadingIndicator() {
  const indicator = document.getElementById('loading-indicator');
  if (indicator) indicator.classList.remove('hidden');
}

function hideLoadingIndicator() {
  const indicator = document.getElementById('loading-indicator');
  if (indicator) indicator.classList.add('hidden');
}

// Modal functions
function initEventModal() {
  // Close modal when clicking outside
  const modal = document.getElementById('eventModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeEventModal();
      }
    });
  }
}

function openEventModal(eventId) {
  const event = eventsData.events.find(e => e.id === eventId);
  if (!event) return;
  
  const modal = document.getElementById('eventModal');
  const content = document.getElementById('eventModalContent');
  
  if (!modal || !content) return;
  
  const isBookmarked = BookmarkManager.isBookmarked('events', event.id);
  const statusBadge = event.status === 'upcoming' ? 'badge-success' : 'badge-secondary';
  const categoryBadge = getCategoryClass(event.category);
  
  content.innerHTML = `
    <div class="modal-header">
      <div class="modal-badges">
        <span class="badge ${statusBadge}">${event.status}</span>
        <span class="badge ${categoryBadge}">${event.category}</span>
      </div>
    </div>
    
    <div class="modal-image">
      <img src="${event.image}" alt="${event.name}" 
           onerror="this.src='https://via.placeholder.com/600x300?text=${encodeURIComponent(event.name)}'">
    </div>
    
    <div class="modal-body">
      <div class="modal-title-row">
        <h2>${event.name}</h2>
        <button class="bookmark-btn large ${isBookmarked ? 'bookmarked' : ''}" 
                onclick="toggleEventBookmark(${event.id})">
          ${isBookmarked ? '❤️' : '🤍'}
        </button>
      </div>
      
      <div class="modal-meta">
        <div class="meta-item">
          <span class="meta-icon">📅</span>
          <span>${formatDate(event.date)}</span>
        </div>
        <div class="meta-item">
          <span class="meta-icon">⏰</span>
          <span>${event.time}</span>
        </div>
        <div class="meta-item">
          <span class="meta-icon">📍</span>
          <span>${event.venue}</span>
        </div>
        <div class="meta-item">
          <span class="meta-icon">👥</span>
          <span>${event.organizer}</span>
        </div>
      </div>
      
      <div class="modal-description">
        <p><strong>Description:</strong></p>
        <p>${event.longDescription || event.description}</p>
      </div>
      
      ${event.registrationRequired ? `
        <div class="registration-notice">
          <span class="registration-icon">⚠️</span>
          <span>Registration Required for this event</span>
        </div>
      ` : ''}
      
      <div class="modal-actions">
        <a href="event-detail.html?id=${event.id}" class="btn btn-primary btn-large">
          View Full Details & Register
        </a>
        <button class="btn btn-outline" onclick="shareEvent(${event.id})">
          Share Event
        </button>
      </div>
    </div>
  `;
  
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeEventModal() {
  const modal = document.getElementById('eventModal');
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }
}

// Share event function
function shareEvent(eventId) {
  const event = eventsData.events.find(e => e.id === eventId);
  if (!event) return;
  
  if (navigator.share) {
    navigator.share({
      title: event.name,
      text: event.description,
      url: `${window.location.origin}/event-detail.html?id=${eventId}`
    });
  } else {
    // Fallback - copy to clipboard
    const url = `${window.location.origin}/event-detail.html?id=${eventId}`;
    navigator.clipboard.writeText(url).then(() => {
      // Show toast notification
      showToast('Link copied to clipboard!');
    });
  }
}

// Toast notification
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

// Update global window functions
window.filterEventsByCategory = filterEventsByCategory;
window.sortEventsBy = sortEventsBy;
window.openEventModal = openEventModal;
window.closeEventModal = closeEventModal;
window.shareEvent = shareEvent;
window.toggleEventBookmark = function(eventId) {
  if (!BookmarkManager) {
    console.error('BookmarkManager not available');
    return;
  }
  
  try {
    const isBookmarked = BookmarkManager.toggleBookmark('events', eventId);
    
    // Update all bookmark buttons for this event
    const buttons = document.querySelectorAll(`[onclick*="toggleEventBookmark(${eventId})"]`);
    
    buttons.forEach(btn => {
      btn.classList.toggle('bookmarked', isBookmarked);
      btn.title = isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks';
      
      // Update button content based on its structure
      const icon = btn.querySelector('.bookmark-icon');
      if (icon) {
        // Header bookmark button with icon span
        icon.textContent = isBookmarked ? '❤️' : '🤍';
      } else if (btn.textContent.includes('Bookmarked') || btn.textContent.includes('Bookmark')) {
        // Text bookmark button
        btn.innerHTML = isBookmarked ? '❤️ Bookmarked' : '🤍 Bookmark';
      } else {
        // Icon-only bookmark button
        btn.innerHTML = isBookmarked ? '❤️' : '🤍';
      }
    });
    
    // Show toast notification
    if (window.showToast) {
      showToast(isBookmarked ? 'Event bookmarked!' : 'Bookmark removed!');
    }
  } catch (error) {
    console.error('Error in toggleEventBookmark:', error);
  }
};

// Bookmark management functions for bookmarks page
window.removeEventBookmark = function(eventId) {
  BookmarkManager.removeBookmark('events', eventId);
  showToast('Event bookmark removed!');
  // Reload bookmarks page
  setTimeout(() => {
    renderBookmarksPage(document.getElementById('content'));
  }, 500);
};

window.removeGalleryBookmark = function(itemId) {
  BookmarkManager.removeBookmark('gallery', itemId);
  showToast('Gallery bookmark removed!');
  // Reload bookmarks page
  setTimeout(() => {
    renderBookmarksPage(document.getElementById('content'));
  }, 500);
};

// Event Detail Page
function renderEventDetailPage(content) {
  if (!eventsData) return;
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  const event = eventsData.events.find(e => e.id === id);
  if (!event) {
    content.innerHTML = `
      <section class="event-detail-section" style="padding-top: 120px;">
        <div class="container text-center">
          <h2>Event Not Found</h2>
          <p>The event you are looking for does not exist.</p>
          <a class="btn btn-primary" href="events.html">Back to Events</a>
        </div>
      </section>`;
    return;
  }

  const isBookmarked = BookmarkManager.isBookmarked('events', event.id);
  const statusBadge = event.status === 'upcoming' ? 'badge-success' : 'badge-secondary';
  const categoryBadge = getCategoryBadgeClass(event.category);
  
  // Generate detailed event information
  const eventDuration = calculateEventDuration(event.date, event.endDate);
  const daysUntilEvent = calculateDaysUntil(event.date);
  const relatedEvents = getRelatedEvents(event.category, event.id);
  const eventHighlights = generateEventHighlights(event);

  content.innerHTML = `
    <!-- Hero Section with proper spacing -->
    <section class="event-detail-hero" style="padding-top: 100px; margin-bottom: 40px;">
      <div class="container">
        <!-- Navigation with proper spacing -->
        <div class="event-detail-nav" style="margin-bottom: 30px;">
          <a href="events.html" class="btn btn-outline-primary">
            <span class="btn-icon">←</span> Back to Events
          </a>
          <div class="event-actions">
            <button class="btn btn-icon-only" onclick="shareEvent(${event.id})" title="Share Event">
              🔗
            </button>
            <button class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" 
                    onclick="toggleEventBookmark(${event.id})" 
                    title="${isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}">
              ${isBookmarked ? '❤️' : '🤍'}
            </button>
          </div>
        </div>

        <!-- Event Header -->
        <div class="event-header">
          <div class="event-badges">
            <span class="badge ${statusBadge}">${event.status.toUpperCase()}</span>
            <span class="badge ${categoryBadge}">${event.category}</span>
            ${event.featured ? '<span class="badge badge-featured">⭐ Featured</span>' : ''}
            ${event.priority && event.priority > 1 ? `<span class="badge badge-priority">High Priority</span>` : ''}
          </div>
          <h1 class="event-title">${event.name}</h1>
          <p class="event-subtitle">${event.description}</p>
        </div>
      </div>
    </section>

    <!-- Event Image Section -->
    <section class="event-image-section" style="margin-bottom: 50px;">
      <div class="container">
        <div class="event-image-container">
          <img src="${event.image}" alt="${event.name}" class="event-detail-image" 
               style="width: 100%; height: 400px; object-fit: cover; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);" 
               onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
          <div class="image-fallback event-detail-image-fallback" style="display:none; color: white; height: 400px; border-radius: 12px; align-items:center; justify-content:center; font-size:18px; text-align:center; padding:40px;">
            <div>
              <div style="font-size:64px; margin-bottom:20px;">🎯</div>
              <div style="font-size: 24px; font-weight: 600;">${event.name}</div>
              <div style="font-size: 16px; opacity: 0.9; margin-top: 10px;">${event.category} Event</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Event Details Section -->
    <section class="event-details-section" style="margin-bottom: 50px;">
      <div class="container">
        <div class="grid grid-2" style="gap: 40px;">
          <!-- Main Event Information -->
          <div class="event-main-info">
            <div class="info-card event-detail-card">
              <style>.event-detail-card { background: var(--card-bg); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); padding: 30px; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.3); margin-bottom: 20px; }</style>
              <h3 style="color: var(--accent); margin-bottom: 20px; display: flex; align-items: center;">
                <span style="margin-right: 10px;">📋</span> Event Information
              </h3>
              
              <div class="event-meta-detailed">
                <div class="meta-item event-meta-item">
                  <style>.event-meta-item { display: flex; align-items: center; margin-bottom: 15px; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; backdrop-filter: blur(10px); }</style>
                  <span class="meta-icon" style="font-size: 20px; margin-right: 15px; width: 30px;">📅</span>
                  <div>
                    <div style="font-weight: 600; color: var(--text-primary);">${formatDate(event.date)}</div>
                    <div style="font-size: 14px; color: var(--text-secondary);">${daysUntilEvent}</div>
                  </div>
                </div>
                
                <div class="meta-item event-meta-item">
                  <span class="meta-icon" style="font-size: 20px; margin-right: 15px; width: 30px;">⏰</span>
                  <div>
                    <div style="font-weight: 600; color: var(--text-primary);">${event.time}</div>
                    <div style="font-size: 14px; color: var(--text-secondary);">${eventDuration}</div>
                  </div>
                </div>
                
                <div class="meta-item event-meta-item">
                  <span class="meta-icon" style="font-size: 20px; margin-right: 15px; width: 30px;">📍</span>
                  <div>
                    <div style="font-weight: 600; color: var(--text-primary);">${event.venue}</div>
                    <div style="font-size: 14px; color: var(--text-secondary);">Event Venue</div>
                  </div>
                </div>
                
                <div class="meta-item event-meta-item">
                  <span class="meta-icon" style="font-size: 20px; margin-right: 15px; width: 30px;">👥</span>
                  <div>
                    <div style="font-weight: 600; color: var(--text-primary);">${event.organizer}</div>
                    <div style="font-size: 14px; color: var(--text-secondary);">Organized by</div>
                  </div>
                </div>
                
                ${event.capacity ? `
                  <div class="meta-item event-meta-item">
                    <span class="meta-icon" style="font-size: 20px; margin-right: 15px; width: 30px;">🎫</span>
                    <div>
                      <div style="font-weight: 600; color: var(--text-primary);">${event.capacity} Seats</div>
                      <div style="font-size: 14px; color: var(--text-secondary);">Maximum Capacity</div>
                    </div>
                  </div>
                ` : ''}
              </div>
            </div>

            <!-- Registration Information -->
            ${event.registrationRequired ? `
              <div class="registration-card event-registration-card">
                <style>.event-registration-card { background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(239, 68, 68, 0.2)); backdrop-filter: blur(20px); border: 1px solid rgba(245, 158, 11, 0.3); padding: 25px; border-radius: 12px; margin-bottom: 20px; }</style>
                <h4 style="color: var(--text-primary); margin-bottom: 15px; display: flex; align-items: center;">
                  <span style="margin-right: 10px;">⚠️</span> Registration Required
                </h4>
                <p style="color: var(--text-secondary); margin-bottom: 15px;">This event requires advance registration. Please register early to secure your spot!</p>
                <div style="display: flex; gap: 10px;">
                  <button class="btn btn-primary">Register Now</button>
                  <button class="btn btn-outline">Learn More</button>
                </div>
              </div>
            ` : ''}
          </div>

          <!-- Event Description & Details -->
          <div class="event-description">
            <div class="info-card event-detail-card">
              <h3 style="color: var(--accent); margin-bottom: 20px; display: flex; align-items: center;">
                <span style="margin-right: 10px;">📝</span> About This Event
              </h3>
              <div style="line-height: 1.8; color: var(--text-secondary);">
                ${event.longDescription || event.description}
              </div>
              
              <!-- Event Highlights -->
              ${eventHighlights.length > 0 ? `
                <div style="margin-top: 30px;">
                  <h4 style="color: var(--text-primary); margin-bottom: 15px;">✨ Event Highlights</h4>
                  <ul style="list-style: none; padding: 0;">
                    ${eventHighlights.map(highlight => `
                      <li style="display: flex; align-items: center; margin-bottom: 10px; padding: 8px 0;">
                        <span style="color: var(--accent); margin-right: 10px;">•</span>
                        <span style="color: var(--text-primary);">${highlight}</span>
                      </li>
                    `).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>

            <!-- Contact Information -->
            <div class="contact-card event-contact-card">
              <style>.event-contact-card { background: linear-gradient(135deg, rgba(36, 207, 166, 0.2), rgba(0, 132, 255, 0.2)); backdrop-filter: blur(20px); border: 1px solid rgba(36, 207, 166, 0.3); padding: 25px; border-radius: 12px; }</style>
              <h4 style="color: var(--text-primary); margin-bottom: 15px; display: flex; align-items: center;">
                <span style="margin-right: 10px;">📞</span> Need Help?
              </h4>
              <p style="color: var(--text-secondary); margin-bottom: 10px;">For questions about this event, please contact:</p>
              <div style="color: var(--text-primary);">
                <div>📧 events@college.edu</div>
                <div>📱 +91-80-12345678</div>
                <div>🏢 ${event.organizer}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Related Events Section -->
    ${relatedEvents.length > 0 ? `
      <section class="related-events-section" style="background: var(--bg-section); padding: 50px 0;">
        <div class="container">
          <h3 style="text-align: center; margin-bottom: 40px; color: var(--text-primary);">🔍 Related Events You Might Like</h3>
          <div class="grid grid-3">
            ${relatedEvents.map(relatedEvent => `
              <div class="related-event-card event-related-card">
                <style>.event-related-card { background: var(--card-bg); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.3); transition: transform 0.3s ease; }</style>
                <img src="${relatedEvent.image}" alt="${relatedEvent.name}" style="width: 100%; height: 150px; object-fit: cover;" 
                     onerror="this.src='https://via.placeholder.com/300x150?text=${encodeURIComponent(relatedEvent.name)}'">
                <div style="padding: 20px;">
                  <h5 style="margin-bottom: 10px; color: var(--text-primary);">${relatedEvent.name}</h5>
                  <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 15px;">${relatedEvent.description.substring(0, 100)}...</p>
                  <div style="display: flex; justify-content: between; align-items: center;">
                    <span style="font-size: 12px; color: var(--accent);">📅 ${formatDate(relatedEvent.date)}</span>
                    <a href="event-detail.html?id=${relatedEvent.id}" class="btn btn-sm btn-outline">View Details</a>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    ` : ''}

    <!-- Action Section -->
    <section class="event-actions-section" style="background: var(--bg-section); color: var(--text-primary); padding: 50px 0; text-align: center;">
      <div class="container">
        <h3 style="margin-bottom: 20px; color: var(--bg-main);">Ready to Join This Amazing Event?</h3>
        <p style="margin-bottom: 30px; opacity: 0.9; color: #fff;">Don't miss out on this incredible opportunity!</p>
        <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
          ${event.registrationRequired ? 
            '<button class="btn btn-primary btn-large" style="display: none;">Register Now</button>' :
            '<button class="btn btn-primary btn-large" style="background: rgba(36, 207, 166, 0.2); border: 2px solid var(--accent);">Add to Calendar</button>'
          }
          <button class="bookmark-btn btn-large ${isBookmarked ? 'bookmarked' : ''}" 
                  onclick="toggleEventBookmark(${event.id})" 
                  style="background: rgba(36, 207, 166, 0.2); border: 2px solid var(--accent); color: var(--text-primary);">
            ${isBookmarked ? '❤️ Bookmarked' : '🤍 Bookmark Event'}
          </button>
          <button class="btn btn-large" onclick="shareEvent(${event.id})" 
                  style="background: rgba(0, 132, 255, 0.2); border: 2px solid var(--accent-secondary); color: var(--text-primary);">
            🔗 Share Event
          </button>
        </div>
      </div>
    </section>
  `;
}


// Render Enhanced Gallery Page
function renderGalleryPage(content, initialFilter = null) {
  if (!galleryData) return;
  
  const featuredImages = galleryData.gallery.filter(item => item.featured);
  const categories = ['all', 'technical', 'cultural', 'sports', 'academic'];
  const years = ['all', '2023-24', '2022-23'];
  
  content.innerHTML = `
    <!-- Gallery Hero Section -->
    <section class="gallery-hero">
      <div class="container">
        <div class="gallery-hero-content">
          <h1>Event Gallery</h1>
          <p>Relive the best moments from our campus events</p>
        </div>
      </div>
    </section>

    <!-- Featured Carousel -->
    <section class="featured-carousel">
      <div class="container">
        <h2>✨ Featured Highlights</h2>
        <div class="carousel-wrapper">
          <div class="carousel-track" id="carousel-track">
            ${featuredImages.map((item, index) => `
              <div class="carousel-item">
                <img src="${item.image}" alt="${item.title}" 
                     onerror="this.src='https://via.placeholder.com/1200x500?text=${encodeURIComponent(item.title)}'">
                <div class="carousel-overlay">
                  <h3 class="carousel-title">${item.title}</h3>
                  <p class="carousel-caption">${item.caption}</p>
                </div>
              </div>
            `).join('')}
          </div>
          ${featuredImages.length > 1 ? `
            <button class="carousel-nav-button carousel-prev" onclick="prevCarouselSlide()">‹</button>
            <button class="carousel-nav-button carousel-next" onclick="nextCarouselSlide()">›</button>
            <div class="carousel-indicators">
              ${featuredImages.map((_, index) => `
                <div class="carousel-indicator ${index === 0 ? 'active' : ''}" onclick="goToCarouselSlide(${index})"></div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    </section>

    <!-- Gallery Statistics -->
    <section class="gallery-stats">
      <div class="container">
        <div class="stats-container">
          <div class="stat-item">
            <div class="stat-number" id="memories-count">0</div>
            <div class="stat-label">Memories Captured</div>
          </div>
          <div class="stat-item">
            <div class="stat-number" id="events-count">0</div>
            <div class="stat-label">Events Covered</div>
          </div>
          <div class="stat-item">
            <div class="stat-number" id="years-count">0</div>
            <div class="stat-label">Years of Celebrations</div>
          </div>
         
        </div>
      </div>
    </section>

    <!-- Gallery Filters -->
    <section class="gallery-filters">
      <div class="container">
        <div class="filter-tabs">
          ${categories.map(category => `
            <button class="filter-tab ${category === 'all' ? 'active' : ''}" 
                    onclick="filterGalleryByCategory('${category}')" data-category="${category}">
              ${category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          `).join('')}
        </div>
        <div id="gallery-grid" class="gallery-grid">
          <!-- Gallery items will be populated here -->
        </div>
      </div>
    </section>

    <!-- Yearly Sections -->
    <section class="yearly-sections">
      <div class="container">
        <h2 class="yearly-sections-title">📅 Memories by Year</h2>
        ${years.filter(year => year !== 'all').map(year => `
          <div class="year-section" data-year="${year}">
            <div class="year-header" onclick="toggleYearSection('${year}')">
              <h3 class="year-title">${year}</h3>
              <span class="year-toggle">▼</span>
            </div>
            <div class="year-content">
              <div class="year-gallery" id="year-${year}">
                <!-- Year-specific gallery items will be populated here -->
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- Lightbox Modal -->
    <div id="lightbox-modal" class="lightbox-modal">
      <div class="lightbox-content">
        <button class="lightbox-close" onclick="closeLightbox()">×</button>
        <button class="lightbox-nav lightbox-prev" onclick="prevLightboxImage()">‹</button>
        <button class="lightbox-nav lightbox-next" onclick="nextLightboxImage()">›</button>
        <img id="lightbox-image" class="lightbox-image" src="" alt="">
        <div class="lightbox-info">
          <h3 id="lightbox-title" class="lightbox-title"></h3>
          <p id="lightbox-caption" class="lightbox-caption"></p>
        </div>
      </div>
    </div>
  `;
  
  // Initialize gallery functionality
  setTimeout(() => {
    initializeGallery();
    initializeFeaturedCarousel();
    animateCounters();
    populateGalleryGrid('all');
    populateYearlySections();
  }, 100);
}

// Enhanced Gallery Logic
let currentCarouselIndex = 0;
let lightboxIndex = 0;
let currentFilteredItems = [];

function initializeGallery() {
  window.filterGalleryByCategory = filterGalleryByCategory;
  window.openLightbox = openLightbox;
  window.closeLightbox = closeLightbox;
  window.nextLightboxImage = nextLightboxImage;
  window.prevLightboxImage = prevLightboxImage;
  window.toggleYearSection = toggleYearSection;

  // Set initial filtered items
  currentFilteredItems = [...galleryData.gallery];
}

function populateGalleryGrid(category) {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  const items = category === 'all' ? galleryData.gallery : galleryData.gallery.filter(item => 
    item.category.toLowerCase() === category.toLowerCase()
  );
  currentFilteredItems = items;

  if (items.length === 0) {
    grid.innerHTML = '<div class="text-center" style="grid-column: 1/-1; padding: 2rem; color: var(--text-secondary);">No images found for this filter.</div>';
    return;
  }

  grid.innerHTML = items.map(item => `
    <div class="gallery-item" onclick="openLightbox(${item.id})">
      <img src="${item.image}" alt="${item.title}" 
           onerror="this.src='https://via.placeholder.com/600x400?text=${encodeURIComponent(item.title)}'">
      <div class="gallery-overlay">
        <div class="gallery-info">
          <h3>${item.title}</h3>
          <p>${item.caption || item.description || ''}</p>
          <span class="gallery-badge">${item.category}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function populateYearlySections() {
  const years = [...new Set(galleryData.gallery.map(item => item.year))];
  years.forEach(year => {
    const container = document.getElementById(`year-${year}`);
    if (!container) return;
    const items = galleryData.gallery.filter(item => item.year === year);
    container.innerHTML = items.map(item => `
      <div class="gallery-item" onclick="openLightbox(${item.id})">
        <img src="${item.image}" alt="${item.title}">
        <div class="gallery-overlay">
          <div class="gallery-info">
            <h3>${item.title}</h3>
            <span class="gallery-badge">${item.category}</span>
          </div>
        </div>
      </div>
    `).join('');
  });
}

function filterGalleryByCategory(category) {
  document.querySelectorAll('.filter-tab').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-category') === category);
  });
  populateGalleryGrid(category);
}

// Lightbox functions
function openLightbox(itemId) {
  const items = currentFilteredItems.length ? currentFilteredItems : galleryData.gallery;
  const index = items.findIndex(i => i.id === itemId);
  if (index === -1) return;
  lightboxIndex = index;
  updateLightbox(items[lightboxIndex]);
  document.getElementById('lightbox-modal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox-modal').classList.remove('active');
  document.body.style.overflow = '';
}

function updateLightbox(item) {
  document.getElementById('lightbox-image').src = item.image;
  document.getElementById('lightbox-title').textContent = item.title;
  document.getElementById('lightbox-caption').textContent = item.caption || item.description || '';
}

function nextLightboxImage() {
  const items = currentFilteredItems.length ? currentFilteredItems : galleryData.gallery;
  lightboxIndex = (lightboxIndex + 1) % items.length;
  updateLightbox(items[lightboxIndex]);
}

function prevLightboxImage() {
  const items = currentFilteredItems.length ? currentFilteredItems : galleryData.gallery;
  lightboxIndex = (lightboxIndex - 1 + items.length) % items.length;
  updateLightbox(items[lightboxIndex]);
}

// Year section toggle
function toggleYearSection(year) {
  const section = document.querySelector(`.year-section[data-year="${year}"]`);
  section.classList.toggle('expanded');
}

// Featured carousel
function initializeFeaturedCarousel() {
  window.nextCarouselSlide = nextCarouselSlide;
  window.prevCarouselSlide = prevCarouselSlide;
  window.goToCarouselSlide = goToCarouselSlide;
}

function updateCarousel() {
  const track = document.getElementById('carousel-track');
  if (!track) return;
  const width = track.clientWidth;
  track.style.transform = `translateX(-${currentCarouselIndex * width}px)`;
  const dots = document.querySelectorAll('.carousel-indicator');
  dots.forEach((dot, i) => dot.classList.toggle('active', i === currentCarouselIndex));
}

function nextCarouselSlide() {
  const total = document.querySelectorAll('#carousel-track .carousel-item').length;
  currentCarouselIndex = (currentCarouselIndex + 1) % total;
  updateCarousel();
}

function prevCarouselSlide() {
  const total = document.querySelectorAll('#carousel-track .carousel-item').length;
  currentCarouselIndex = (currentCarouselIndex - 1 + total) % total;
  updateCarousel();
}

function goToCarouselSlide(index) {
  currentCarouselIndex = index;
  updateCarousel();
}

// Animated Counters
function animateCounters() {
  // Only run if we're on the gallery page
  const currentPage = document.body.getAttribute('data-page');
  if (currentPage !== 'gallery') {
    return;
  }
  
  const totalImages = galleryData.gallery.length;
  const totalEvents = new Set(galleryData.gallery.map(i => i.event)).size;
  const totalYears = new Set(galleryData.gallery.map(i => i.year)).size;
  const smiles = Math.round(totalImages * 12.5); // fun estimate

  countTo('memories-count', totalImages);
  countTo('events-count', totalEvents);
  countTo('years-count', totalYears);
  countTo('smiles-count', smiles);
}

function countTo(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('counter-animated');
  const duration = 1200;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(progress * target);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// Render Enhanced Feedback Page
function renderFeedbackPage(content) {
  // Get past events from the last 30 days
  const pastMonthEvents = getPastMonthEvents();
  
  content.innerHTML = `
    <!-- Feedback Hero Section -->
    <section class="feedback-hero">
      <div class="container">
        <div class="feedback-hero-content">
          <h1 class="feedback-hero-title">We Value Your Feedback</h1>
          <p class="feedback-hero-subtitle">Your voice helps us make every event better</p>
          <div class="feedback-hero-icons">
            <span class="hero-icon animate-bounce" style="animation-delay: 0.5s;">⭐</span>
            <span class="hero-icon animate-bounce" style="animation-delay: 0.7s;">💬</span>
            <span class="hero-icon animate-bounce" style="animation-delay: 0.9s;">🎉</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Feedback Section -->
    <section class="feedback-main">
      <div class="container">
        <div class="feedback-grid">
          <!-- Feedback Form -->
          <div class="feedback-form-container fade-in-left">
            <div class="form-card">
              <div class="form-header">
                <h2>📝 Event Feedback Form</h2>
                <p>Share your thoughts about our events and help us make them even better.</p>
              </div>
              
              <form id="feedbackForm" class="feedback-form">
                <div class="form-group animate-slide-up" style="animation-delay: 0.1s;">
                  <label for="name" class="form-label">Full Name *</label>
                  <input type="text" id="name" class="form-control animated-input" required placeholder="Enter your full name">
                </div>
                
                <div class="form-group animate-slide-up" style="animation-delay: 0.2s;">
                  <label for="email" class="form-label">Email Address *</label>
                  <input type="email" id="email" class="form-control animated-input" required placeholder="Enter your email">
                </div>
                
                <div class="form-group animate-slide-up" style="animation-delay: 0.3s;">
                  <label for="userType" class="form-label">User Type *</label>
                  <select id="userType" class="form-control form-select animated-select" required>
                    <option value="">Select your role</option>
                    <option value="student">🎓 Student</option>
                    <option value="faculty">👩‍🏫 Faculty</option>
                    <option value="staff">👨‍💼 Staff</option>
                    <option value="alumni">🎯 Alumni</option>
                    <option value="visitor">👥 Visitor</option>
                  </select>
                </div>
                
               <div class="form-group animate-slide-up" style="animation-delay: 0.4s;">
  <label for="eventAttended" class="form-label">Event Attended (Past 30 Days Only)</label>
  <select id="eventAttended" class="form-control form-select animated-select" required>
    <option value="">Select an event</option>

    <!-- ✅ Static event list -->
    <option value="1">🧰 Web Development Bootcamp - Nov 2, 2025</option>
    <option value="2">🎤 AI for Students Seminar - Oct 30, 2025</option>
    <option value="3">🏆 Hackathon 2025 - Oct 25, 2025</option>
    <option value="4">🎨 Graphic Design Workshop - Oct 22, 2025</option>
    <option value="5">🎭 Cultural Fest - Oct 18, 2025</option>
    <option value="6">📚 Book Fair - Oct 15, 2025</option>
    <option value="7">⚽ Sports Meet - Oct 10, 2025</option>
    <option value="8">💻 Tech Talk: Future of Computing - Oct 8, 2025</option>
    <option value="9">🎶 Music Night - Oct 5, 2025</option>
    <option value="10">📸 Photography Contest - Oct 2, 2025</option>
  </select>
</div>

                
                <div class="form-group animate-slide-up" style="animation-delay: 0.5s;">
                  <label class="form-label">Overall Rating *</label>
                  <div class="star-rating" id="star-rating">
                    <span class="star" data-rating="1">★</span>
                    <span class="star" data-rating="2">★</span>
                    <span class="star" data-rating="3">★</span>
                    <span class="star" data-rating="4">★</span>
                    <span class="star" data-rating="5">★</span>
                  </div>
                  <input type="hidden" id="ratingValue" required>
                  <div class="rating-text" id="rating-text">Click stars to rate</div>
                </div>
                
                <div class="form-group animate-slide-up" style="animation-delay: 0.6s;">
                  <label for="comments" class="form-label">Comments & Suggestions</label>
                  <textarea id="comments" class="form-control animated-textarea" rows="4" 
                           placeholder="Please share your detailed feedback, suggestions, or any issues you encountered..."></textarea>
                </div>
                
                <div class="form-group animate-slide-up" style="animation-delay: 0.7s;">
                  <label class="checkbox-label">
                    <input type="checkbox" id="subscribe" class="animated-checkbox">
                    <span class="checkmark"></span>
                    Subscribe to event notifications
                  </label>
                </div>
                
                <button type="submit" class="btn-submit animate-slide-up" style="animation-delay: 0.8s;">
                  <span class="btn-text">Submit Feedback</span>
                  <span class="btn-icon">✨</span>
                </button>
                
                <div id="formMessage" class="form-message hidden"></div>
              </form>
            </div>
          </div>
          
          <!-- Right Side Content -->
          <div class="feedback-info fade-in-right">
            <!-- Why Feedback Matters -->
            <div class="info-card why-matters-card animate-slide-up" style="animation-delay: 0.3s;">
              <div class="card-header">
                <h3>🌟 Why Your Feedback Matters</h3>
              </div>
              <div class="card-content">
                <div class="feedback-point">
                  <div class="point-icon">🚀</div>
                  <div class="point-content">
                    <strong>Event Improvement:</strong>
                    <p>Your suggestions help us enhance future events and create better experiences.</p>
                  </div>
                </div>
                <div class="feedback-point">
                  <div class="point-icon">⚙️</div>
                  <div class="point-content">
                    <strong>Service Quality:</strong>
                    <p>We use feedback to improve our services and processes continuously.</p>
                  </div>
                </div>
                <div class="feedback-point">
                  <div class="point-icon">🎓</div>
                  <div class="point-content">
                    <strong>Student Voice:</strong>
                    <p>Your opinion shapes campus experiences and influences our decisions.</p>
                  </div>
                </div>
                <div class="feedback-point">
                  <div class="point-icon">📈</div>
                  <div class="point-content">
                    <strong>Continuous Growth:</strong>
                    <p>Feedback drives our commitment to excellence and innovation.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Contact Information -->
            <div class="info-card contact-card animate-slide-up" style="animation-delay: 0.5s;">
              <div class="card-header">
                <h3>📞 Other Ways to Reach Us</h3>
              </div>
              <div class="card-content">
                <div class="contact-item">
                  <span class="contact-icon">✉️</span>
                  <div>
                    <strong>Email:</strong>
                    <span>feedback@college.edu</span>
                  </div>
                </div>
                <div class="contact-item">
                  <span class="contact-icon">📱</span>
                  <div>
                    <strong>Phone:</strong>
                    <span>+91-80-12345678</span>
                  </div>
                </div>
                <div class="contact-item">
                  <span class="contact-icon">🏢</span>
                  <div>
                    <strong>Office:</strong>
                    <span>Student Affairs Office, Admin Block</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Statistics -->
            <!-- <div class="info-card stats-card animate-slide-up" style="animation-delay: 0.7s;">
              <div class="card-header">
                <h3>📉 Feedback Statistics</h3>
              </div> 
              <div class="card-content">
                <div class="stats-grid">
                  <div class="stat-item">
                    <div class="stat-number" id="avg-rating">0</div>
                    <div class="stat-label">Average Rating</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-number" id="total-feedback">0</div>
                    <div class="stat-label">Feedback Received</div>
                  </div>
                </div>
              </div>
            </div>  -->
          </div>
        </div>
      </div>
    </section>
    
   
  
  `;

  // Initialize feedback page functionality
  setTimeout(() => {
    initializeFeedbackPage();
  }, 100);
}

// Enhanced Feedback Page Initialization
function initializeFeedbackPage() {
  // Initialize star rating
  initStarRating();
  
  // Initialize animated counters
  animateFeedbackStats();
  
  // Initialize form interactions
  initFeedbackForm();
  
  // Initialize animations
  initScrollAnimations();
}

function initStarRating() {
  const stars = document.querySelectorAll('.star');
  const ratingValue = document.getElementById('ratingValue');
  const ratingText = document.getElementById('rating-text');
  let currentRating = 0;
  
  const ratingTexts = {
    1: 'Poor - Needs significant improvement',
    2: 'Fair - Could be better',
    3: 'Good - Satisfactory experience',
    4: 'Very Good - Exceeded expectations',
    5: 'Excellent - Outstanding experience!'
  };
  
  stars.forEach((star, index) => {
    star.addEventListener('click', () => {
      currentRating = index + 1;
      ratingValue.value = currentRating;
      ratingText.textContent = ratingTexts[currentRating];
      ratingText.style.color = 'var(--accent)';
      updateStars(currentRating);
      
      // Add animation effect
      star.style.transform = 'scale(1.2)';
      setTimeout(() => {
        star.style.transform = 'scale(1)';
      }, 200);
    });
    
    star.addEventListener('mouseenter', () => {
      updateStars(index + 1, true);
      ratingText.textContent = ratingTexts[index + 1];
      ratingText.style.color = 'var(--accent-secondary)';
    });
  });
  
  // Reset on mouse leave
  document.querySelector('.star-rating').addEventListener('mouseleave', () => {
    updateStars(currentRating);
    if (currentRating > 0) {
      ratingText.textContent = ratingTexts[currentRating];
      ratingText.style.color = 'var(--accent)';
    } else {
      ratingText.textContent = 'Click stars to rate';
      ratingText.style.color = 'var(--text-secondary)';
    }
  });
  
  function updateStars(rating, isHover = false) {
    stars.forEach((star, index) => {
      star.classList.remove('active', 'hover');
      if (index < rating) {
        star.classList.add(isHover ? 'hover' : 'active');
      }
    });
  }
}

function initFeedbackForm() {
  const form = document.getElementById('feedbackForm');
  const inputs = document.querySelectorAll('.animated-input, .animated-select, .animated-textarea');
  const checkbox = document.querySelector('.animated-checkbox');
  const submitBtn = document.querySelector('.btn-submit');
  
  // Validation rules
  const validationRules = {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s.''-]+$/,
      message: 'Please enter a valid full name (2-50 characters, letters only)'
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address'
    },
    userType: {
      required: true,
      message: 'Please select your user type'
    },
    eventAttended: {
      required: true,
      message: 'Please select an event you attended'
    },
    ratingValue: {
      required: true,
      min: 1,
      max: 5,
      message: 'Please provide a rating (1-5 stars)'
    },
    comments: {
      required: true,
      minLength: 10,
      maxLength: 500,
      message: 'Please provide feedback (10-500 characters)'
    }
  };
  
  // Add focus animations and real-time validation to inputs
  inputs.forEach(input => {
    const fieldName = input.name || input.id;
    
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
      clearFieldError(input);
    });
    
    input.addEventListener('blur', () => {
      if (!input.value) {
        input.parentElement.classList.remove('focused');
      }
      validateField(input, validationRules[fieldName]);
    });
    
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        validateField(input, validationRules[fieldName]);
      }
    });
  });
  
  // Checkbox animation
  if (checkbox) {
    checkbox.addEventListener('change', () => {
      const checkmark = checkbox.nextElementSibling;
      if (checkbox.checked) {
        checkmark.style.transform = 'scale(1.1)';
        setTimeout(() => {
          checkmark.style.transform = 'scale(1)';
        }, 200);
      }
    });
  }
  
  // Submit button effects
  submitBtn.addEventListener('mouseenter', () => {
    if (!submitBtn.disabled) {
      submitBtn.style.transform = 'translateY(-2px) scale(1.02)';
    }
  });
  
  submitBtn.addEventListener('mouseleave', () => {
    submitBtn.style.transform = 'translateY(0) scale(1)';
  });
  
  // Form submission with validation
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Clear previous errors
    clearAllErrors();
    
    // Validate all fields
    let isValid = true;
    const formData = new FormData(form);
    const errors = [];
    
    // Validate each field
    Object.keys(validationRules).forEach(fieldName => {
      const field = form.querySelector(`[name="${fieldName}"], #${fieldName}`);
      const rule = validationRules[fieldName];
      
      if (field && !validateField(field, rule)) {
        isValid = false;
        errors.push(rule.message);
      }
    });
    
    // Special validation for rating
    const ratingValue = document.getElementById('ratingValue');
    if (!ratingValue.value || ratingValue.value < 1) {
      isValid = false;
      const starRatingContainer = document.querySelector('.star-rating').parentElement;
      showFieldError(starRatingContainer, 'Please select a rating');
      document.querySelector('.star-rating').classList.add('error');
      errors.push('Rating is required');
    }
    
    if (!isValid) {
      // Show error message
      showFormError('Please correct the highlighted errors before submitting.');
      
      // Focus on first error field
      const firstErrorField = form.querySelector('.error');
      if (firstErrorField) {
        firstErrorField.focus();
      }
      return;
    }
    
    // If validation passes, submit the form
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitBtn.innerHTML = '<span class="btn-text">Submitting...</span><span class="btn-icon">⏳</span>';
    
    setTimeout(() => {
      if (window.Swal && typeof Swal.fire === 'function') {
        Swal.fire({
          title: 'Thank you! 🎉',
          text: 'Your feedback has been submitted successfully.',
          icon: 'success',
          confirmButtonText: 'Great',
          confirmButtonColor: '#1f78ff'
        }).then(() => {
          resetForm();
        });
      } else {
        const messageDiv = document.getElementById('formMessage');
        messageDiv.innerHTML = `
          <div class="success-message">
            <div class="success-icon">✅</div>
            <div class="success-content">
              <strong>Thank you for your valuable feedback!</strong>
              <p>Your response has been recorded successfully. We appreciate your input and will use it to improve our events and services.</p>
            </div>
          </div>
        `;
        messageDiv.classList.remove('hidden');
        setTimeout(() => {
          resetForm();
        }, 3000);
      }
    }, 1500);
  });
  
  // Validation helper functions
  function validateField(field, rule) {
    if (!field || !rule) return true;
    
    const value = field.value.trim();
    
    // Required validation
    if (rule.required && !value) {
      showFieldError(field, rule.message);
      return false;
    }
    
    // Skip other validations if field is empty and not required
    if (!value && !rule.required) {
      clearFieldError(field);
      return true;
    }
    
    // Length validations
    if (rule.minLength && value.length < rule.minLength) {
      showFieldError(field, rule.message);
      return false;
    }
    
    if (rule.maxLength && value.length > rule.maxLength) {
      showFieldError(field, rule.message);
      return false;
    }
    
    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      showFieldError(field, rule.message);
      return false;
    }
    
    // Numeric validations
    if (rule.min && parseFloat(value) < rule.min) {
      showFieldError(field, rule.message);
      return false;
    }
    
    if (rule.max && parseFloat(value) > rule.max) {
      showFieldError(field, rule.message);
      return false;
    }
    
    clearFieldError(field);
    return true;
  }
  
  function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    field.parentElement.appendChild(errorDiv);
  }
  
  function clearFieldError(field) {
    field.classList.remove('error');
    const errorMessage = field.parentElement.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.remove();
    }
  }
  
  function clearAllErrors() {
    const errorFields = form.querySelectorAll('.error');
    const errorMessages = form.querySelectorAll('.error-message');
    
    errorFields.forEach(field => field.classList.remove('error'));
    errorMessages.forEach(message => message.remove());
    
    // Clear star rating error
    const starRating = document.querySelector('.star-rating');
    if (starRating) {
      starRating.classList.remove('error');
    }
    
    const formMessage = document.getElementById('formMessage');
    formMessage.classList.add('hidden');
  }
  
  function showFormError(message) {
    const messageDiv = document.getElementById('formMessage');
    messageDiv.innerHTML = `
      <div class="error-message-form">
        <div class="error-icon">❌</div>
        <div class="error-content">
          <strong>Validation Error</strong>
          <p>${message}</p>
        </div>
      </div>
    `;
    messageDiv.classList.remove('hidden');
  }
  
  function resetForm() {
    form.reset();
    document.getElementById('ratingValue').value = '';
    document.getElementById('rating-text').textContent = 'Click stars to rate';
    document.getElementById('rating-text').style.color = 'var(--text-secondary)';
    document.querySelectorAll('.star').forEach(s => s.classList.remove('active', 'hover'));
    document.querySelectorAll('.form-group').forEach(g => g.classList.remove('focused'));
    clearAllErrors();
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
    submitBtn.innerHTML = '<span class="btn-text">Submit Feedback</span><span class="btn-icon">✨</span>';
  }
}

function animateFeedbackStats() {
  // Only animate if we're on the feedback page and elements exist
  const currentPage = document.body.getAttribute('data-page');
  if (currentPage !== 'feedback') {
    console.log('Skipping feedback stats animation - not on feedback page');
    return;
  }
  
  // Animate statistics counters
  setTimeout(() => {
    const avgRatingEl = document.getElementById('avg-rating');
    const totalFeedbackEl = document.getElementById('total-feedback');
    
    console.log('Feedback elements check:', { avgRatingEl, totalFeedbackEl });
    
    if (avgRatingEl && totalFeedbackEl) {
      console.log('Starting feedback counter animations');
      try {
        animateCounter('avg-rating', 4.6, 1500, 1, '/5');
        animateCounter('total-feedback', 1250, 2000, 0, '+');
      } catch (error) {
        console.error('Error in feedback counter animation:', error);
      }
    } else {
      console.warn('Feedback counter elements not found');
    }
  }, 500);
}

function animateCounter(id, target, duration, decimals = 0, suffix = '') {
  const element = document.getElementById(id);
  if (!element) {
    console.warn(`animateCounter: Element with id '${id}' not found`);
    return;
  }
  
  const start = performance.now();
  const startValue = 0;
  
  function step(timestamp) {
    // Double check element still exists
    if (!element || !element.parentNode) {
      console.warn(`animateCounter: Element with id '${id}' was removed from DOM`);
      return;
    }
    
    const progress = Math.min((timestamp - start) / duration, 1);
    const current = startValue + (target - startValue) * progress;
    
    try {
      if (decimals > 0) {
        element.textContent = current.toFixed(decimals) + suffix;
      } else {
        element.textContent = Math.floor(current) + suffix;
      }
    } catch (error) {
      console.error(`animateCounter: Error updating element ${id}:`, error);
      return;
    }
    
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }
  
  requestAnimationFrame(step);
}

// Render Contact Page
function renderContactPage(content) {
  if (!contactsData) return;
  
  const college = contactsData.contacts.college;
  
  content.innerHTML = `
    <!-- Contact Hero Section -->
    <section class="contact-hero">
      <div class="contact-hero-bg">
        <div class="hero-shapes"></div>
      </div>
      <div class="container">
        <div class="contact-hero-content">
          <h1 class="contact-hero-title animate-slide-up">Get in Touch</h1>
          <p class="contact-hero-subtitle animate-slide-up">We're here to answer your questions and help you stay connected</p>
          <div class="contact-hero-icons animate-slide-up">
            <div class="hero-contact-icon">📞</div>
            <div class="hero-contact-icon">✉️</div>
            <div class="hero-contact-icon">📍</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Contact Info -->
    <section class="quick-contact-section">
      <div class="container">
        <div class="quick-contact-grid">
          <div class="quick-contact-card fade-in-up" style="animation-delay: 0.1s">
            <div class="quick-contact-icon">📍</div>
            <div class="quick-contact-info">
              <h3>Visit Us</h3>
              <p>${college.address}</p>
            </div>
          </div>
          <div class="quick-contact-card fade-in-up" style="animation-delay: 0.2s">
            <div class="quick-contact-icon">📞</div>
            <div class="quick-contact-info">
              <h3>Call Us</h3>
              <p>${college.phone}</p>
            </div>
          </div>
          <div class="quick-contact-card fade-in-up" style="animation-delay: 0.3s">
            <div class="quick-contact-icon">✉️</div>
            <div class="quick-contact-info">
              <h3>Email Us</h3>
              <p>${college.email}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Faculty Coordinators Section -->
    <section class="contact-cards-section">
      <div class="container">
        <div class="section-header text-center">
          <h2>Faculty Coordinators</h2>
          <p>Meet our dedicated faculty members who coordinate various events</p>
        </div>
        <div class="contact-cards-grid">
          ${contactsData.contacts.faculty.map((contact, index) => createContactCard(contact, 'faculty', index)).join('')}
        </div>
      </div>
    </section>


    <!-- Student Representatives Section -->
    <section class="contact-cards-section">
      <div class="container">
        <div class="section-header text-center">
          <h2>Student Representatives</h2>
          <p>Connect with our student coordinators for event assistance</p>
        </div>
        <div class="contact-cards-grid">
          ${contactsData.contacts.students.map((contact, index) => createContactCard(contact, 'student', index)).join('')}
        </div>
      </div>
    </section>

    <!-- College Info & Map Section -->
    <section class="college-info-section">
      <div class="container">
        <div class="college-info-grid">
          <div class="college-info-card fade-in-up">
            <h2>College Information</h2>
            <div class="college-info-content">
              <h3>${college.name}</h3>
              <div class="college-contact-details">
                <div class="college-contact-item">
                  <span class="contact-icon">📍</span>
                  <span>${college.address}</span>
                </div>
                <div class="college-contact-item">
                  <span class="contact-icon">📞</span>
                  <span>${college.phone}</span>
                </div>
                <div class="college-contact-item">
                  <span class="contact-icon">✉️</span>
                  <span>${college.email}</span>
                </div>
                <div class="college-contact-item">
                  <span class="contact-icon">🌐</span>
                  <span>${college.website}</span>
                </div>
              </div>
              
              <div class="office-hours">
                <h4>Office Hours</h4>
                <div class="hours-grid">
                  <div class="hours-item">
                    <strong>Monday - Friday:</strong> 9:00 AM - 5:00 PM
                  </div>
                  <div class="hours-item">
                    <strong>Saturday:</strong> 9:00 AM - 1:00 PM
                  </div>
                  <div class="hours-item">
                    <strong>Sunday:</strong> Closed
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="map-card fade-in-up">
            <h2>Find Us on Map</h2>
            <div class="map-container">
     <iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.152233850977!2d67.03217337358457!3d24.926883342599822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33f90157042d3%3A0x93d609e8bec9a880!2sAptech%20Computer%20Education%20North%20Nazimabad%20Center!5e0!3m2!1sen!2s!4v1762851718319!5m2!1sen!2s"
  width="100%"
  height="300"
  style="border:0; border-radius: 12px;"
  allowfullscreen=""
  loading="lazy"
  referrerpolicy="no-referrer-when-downgrade"
  title="Google Map showing Aptech Computer Education North Nazimabad Center">
</iframe>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section bg-light">
      <div class="container">
        <div class="section-header text-center">
          <h2>Frequently Asked Questions</h2>
          <p>Find answers to common questions about our events and services</p>
        </div>
        <div class="faq-container">
          <div class="faq-item" onclick="toggleFAQ(this)">
            <div class="faq-question">
              <h3>How can I propose a new event idea?</h3>
              <span class="faq-toggle">+</span>
            </div>
            <div class="faq-answer">
              <p>You can propose new event ideas by contacting our Student Affairs office or reaching out to any of our faculty coordinators. We welcome innovative ideas that benefit our college community!</p>
            </div>
          </div>
          
          <div class="faq-item" onclick="toggleFAQ(this)">
            <div class="faq-question">
              <h3>How do I register for events?</h3>
              <span class="faq-toggle">+</span>
            </div>
            <div class="faq-answer">
              <p>Event registration is available through our Events page. Simply browse upcoming events and click on the registration link. Some events may require approval from coordinators.</p>
            </div>
          </div>
          
          <div class="faq-item" onclick="toggleFAQ(this)">
            <div class="faq-question">
              <h3>Can external participants join college events?</h3>
              <span class="faq-toggle">+</span>
            </div>
            <div class="faq-answer">
              <p>Some events are open to external participants, while others are exclusive to our college community. Check the event details or contact the respective coordinator for specific information.</p>
            </div>
          </div>
          
          <div class="faq-item" onclick="toggleFAQ(this)">
            <div class="faq-question">
              <h3>What support is available for student-organized events?</h3>
              <span class="faq-toggle">+</span>
            </div>
            <div class="faq-answer">
              <p>We provide comprehensive support including venue booking, technical equipment, marketing assistance, and faculty guidance. Contact our Student Representatives for detailed information about organizing events.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action Footer -->
   
  `
  
  // Initialize animations and interactions after content is loaded
  setTimeout(() => {
    initScrollAnimations();
    initContactAnimations();
  }, 100);
}

// Create Contact Card function
function createContactCard(contact, type, index) {
  const delay = index * 0.1;
  return `
    <div class="contact-card fade-in-up" style="animation-delay: ${delay}s">
      <div class="contact-card-header">
        <div class="contact-avatar">
          <div class="avatar-placeholder" style="color: #222 !important;">${contact.name.charAt(0)}</div>
        </div>
        <div class="contact-status ${type}">${type === 'faculty' ? '👨‍🏫' : '👨‍🎓'}</div>
      </div>
      <div class="contact-card-body">
        <h3 class="contact-name">${contact.name}</h3>
        <p class="contact-designation">${contact.designation}</p>
        <p class="contact-department">${contact.department}</p>
        
        <div class="contact-details">
          <div class="contact-detail-item">
            <span class="contact-icon">📞</span>
            <span>${contact.phone}</span>
          </div>
          <div class="contact-detail-item">
            <span class="contact-icon">✉️</span>
            <span>${contact.email}</span>
          </div>
        </div>
        
        ${contact.responsibilities ? `
          <div class="contact-responsibilities">
            <h4>Responsibilities:</h4>
            <ul>
              ${contact.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
      <div class="contact-card-actions">
        <a href="mailto:${contact.email}" class="contact-action-btn email">
          <span>✉️</span>
        </a>
        <a href="tel:${contact.phone}" class="contact-action-btn call">
          <span>📞</span>
        </a>
      </div>
    </div>
  `;
}

// FAQ Toggle function
window.toggleFAQ = function(element) {
  const isActive = element.classList.contains('active');
  
  // Close all other FAQ items
  document.querySelectorAll('.faq-item.active').forEach(item => {
    if (item !== element) {
      item.classList.remove('active');
      item.querySelector('.faq-toggle').textContent = '+';
    }
  });
  
  // Toggle current item
  if (isActive) {
    element.classList.remove('active');
    element.querySelector('.faq-toggle').textContent = '+';
  } else {
    element.classList.add('active');
    element.querySelector('.faq-toggle').textContent = '×';
  }
};

// Contact page animations
function initContactAnimations() {
  // Animate hero icons
  const heroIcons = document.querySelectorAll('.hero-contact-icon');
  heroIcons.forEach((icon, index) => {
    setTimeout(() => {
      icon.style.animation = 'animate-bounce 2s ease-in-out infinite';
      icon.style.animationDelay = `${index * 0.2}s`;
    }, 1000 + index * 200);
  });
  
  // Contact cards hover effects are handled by CSS
  const contactCards = document.querySelectorAll('.contact-card');
  contactCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)';
    });
  });
}

// Render Bookmarks Page
function renderBookmarksPage(content) {
  const eventBookmarks = BookmarkManager.getBookmarks('events');
  const galleryBookmarks = BookmarkManager.getBookmarks('gallery');
  
  // Get bookmarked events
  const bookmarkedEvents = eventsData && eventsData.events ? 
    eventsData.events.filter(event => eventBookmarks.includes(event.id)) : [];
  
  // Get bookmarked gallery items  
  const bookmarkedGalleryItems = galleryData && galleryData.gallery ? 
    galleryData.gallery.filter(item => galleryBookmarks.includes(item.id)) : [];
  
  content.innerHTML = `
    <!-- Bookmarks Hero Section -->
    <section class="bookmarks-hero">
      <div class="container">
        <div class="bookmarks-hero-content">
          <h1 class="bookmarks-title">❤️ My Bookmarks</h1>
          <p class="bookmarks-subtitle">Your saved events and memories in one place</p>
          <div class="bookmarks-stats">
            <div class="bookmark-stat">
              <div class="stat-number">${bookmarkedEvents.length}</div>
              <div class="stat-label">Saved Events</div>
            </div>
          
            <div class="bookmark-stat">
              <div class="stat-number">${bookmarkedEvents.length + bookmarkedGalleryItems.length}</div>
              <div class="stat-label">Total Bookmarks</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Bookmarked Events Section -->
    <section class="bookmarked-events-section">
      <div class="container">
        <div class="section-header">
          <h2>📅 Saved Events (${bookmarkedEvents.length})</h2>
          <p>Events you've bookmarked for quick access</p>
        </div>
        
        ${bookmarkedEvents.length > 0 ? `
          <div class="bookmarked-events-grid">
            ${bookmarkedEvents.map((event, index) => `
              <div class="bookmark-event-card fade-in-up" style="animation-delay: ${index * 0.1}s">
                <div class="bookmark-card-header">
                  <span class="bookmark-date">${formatDate(event.date)}</span>
                  <button class="remove-bookmark-btn" onclick="removeEventBookmark(${event.id})" title="Remove bookmark">
                    ✕
                  </button>
                </div>
                <div class="bookmark-event-image">
                  <img src="${event.image}" alt="${event.name}" 
                       onerror="this.src='https://via.placeholder.com/300x150?text=${encodeURIComponent(event.name)}'">
                  <div class="bookmark-status ${event.status === 'upcoming' ? 'status-upcoming' : 'status-past'}">
                    ${event.status.toUpperCase()}
                  </div>
                </div>
                <div class="bookmark-event-content">
                  <h3>${event.name}</h3>
                  <div class="bookmark-event-meta">
                    <span>⏰ ${event.time}</span>
                    <span>📍 ${event.venue}</span>
                    <span class="event-category">${event.category}</span>
                  </div>
                  <p class="bookmark-event-description">${event.description}</p>
                  <div class="bookmark-event-actions">
                    <a href="event-detail.html?id=${event.id}" class="btn btn-primary btn-sm">View Details</a>
                    <button class="btn btn-outline btn-sm" onclick="shareEvent(${event.id})">Share</button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="empty-bookmarks">
            <div class="empty-icon">📅</div>
            <h3>No Events Bookmarked</h3>
            <p>Start exploring events and bookmark the ones you're interested in!</p>
            <a href="events.html" class="btn btn-primary">Browse Events</a>
          </div>
        `}
      </div>
    </section>

    ${bookmarkedGalleryItems.length > 0 ? `
      <!-- Bookmarked Gallery Section -->
      <section class="bookmarked-gallery-section">
        <div class="container">
          <div class="section-header">
            <h2>🖼️ Saved Memories (${bookmarkedGalleryItems.length})</h2>
            <p>Gallery images you've saved to remember special moments</p>
          </div>
          <div class="bookmarked-gallery-grid">
            ${bookmarkedGalleryItems.map((item, index) => `
              <div class="bookmark-gallery-card fade-in-up" style="animation-delay: ${(bookmarkedEvents.length + index) * 0.1}s">
                <div class="bookmark-gallery-image">
                  <img src="${item.image}" alt="${item.title}" 
                       onerror="this.src='https://via.placeholder.com/300x200?text=${encodeURIComponent(item.title)}'">
                  <div class="bookmark-gallery-overlay">
                    <button class="remove-bookmark-btn" onclick="removeGalleryBookmark(${item.id})" title="Remove bookmark">
                      ✕
                    </button>
                    <button class="view-gallery-btn" onclick="openGalleryModal(${item.id})" title="View full image">
                      👁️
                    </button>
                  </div>
                </div>
                <div class="bookmark-gallery-info">
                  <h4>${item.title}</h4>
                  <p class="gallery-event-name">${item.event}</p>
                  <span class="gallery-category">${item.category} • ${item.year}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    ` : ''}
  `;
  
  // Initialize animations
  setTimeout(() => {
    initScrollAnimations();
  }, 100);
}

// Legacy code removed - replaced by new enhanced functions

window.showEventDetails = function(eventId) {
  const event = eventsData.events.find(e => e.id === eventId);
  if (!event) return;
  
  const modalContent = document.getElementById('eventModalContent');
  const isBookmarked = BookmarkManager.isBookmarked('events', event.id);
  const statusBadge = event.status === 'upcoming' ? 'badge-success' : 'badge-secondary';
  const categoryBadge = getCategoryBadgeClass(event.category);
  
  modalContent.innerHTML = `
    <div class="text-center mb-2">
      <img src="${event.image}" alt="${event.name}" style="max-width: 100%; height: 300px; object-fit: cover; border-radius: 0.5rem;"
           onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
      <div class="image-fallback" style="display:none; background:var(--card-bg); backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,0.1); color:var(--text-primary); height:300px; align-items:center; justify-content:center; font-size:16px; text-align:center; padding:40px; border-radius:0.5rem;">
        <div>
          <div style="font-size:48px; margin-bottom:16px;">🎯</div>
          <div>${event.name}</div>
        </div>
      </div>
    </div>
    
    <div class="d-flex justify-between align-center mb-2">
      <h2>${event.name}</h2>
      <button class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" 
              onclick="toggleEventBookmark(${event.id})" 
              title="${isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}">
        ❤️
      </button>
    </div>
    
    <div class="mb-2">
      <span class="badge ${statusBadge}">${event.status}</span>
      <span class="badge ${categoryBadge}">${event.category}</span>
    </div>
    
    <div class="card-meta mb-2">
      <span class="card-meta-item">📅 ${formatDate(event.date)}</span>
      <span class="card-meta-item">⏰ ${event.time}</span>
      <span class="card-meta-item">📍 ${event.venue}</span>
      <span class="card-meta-item">👥 ${event.organizer}</span>
    </div>
    
    <p><strong>Description:</strong></p>
    <p>${event.longDescription || event.description}</p>
    
    ${event.registrationRequired ? 
      '<div class="mt-2"><span class="badge badge-warning">Registration Required</span></div>' : 
      ''}
  `;
  
  openModal('eventModal');
};


// Gallery functions
window.filterGallery = filterGalleryByCategory;

window.openGalleryModal = function(itemId) {
  const item = galleryData.gallery.find(i => i.id === itemId);
  if (!item) return;
  
  const modalContent = document.getElementById('galleryModalContent');
  const isBookmarked = BookmarkManager.isBookmarked('gallery', item.id);
  
  modalContent.innerHTML = `
    <div class="text-center">
      <img src="${item.image}" alt="${item.title}" style="max-width: 100%; max-height: 60vh; object-fit: contain;"
           onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
      <div class="image-fallback" style="display:none; background:var(--card-bg); backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,0.1); color:var(--text-primary); max-height:60vh; align-items:center; justify-content:center; font-size:16px; text-align:center; padding:40px;">
        <div>
          <div style="font-size:48px; margin-bottom:16px;">🖼️</div>
          <div>${item.title}</div>
        </div>
      </div>
      
      <div class="mt-2">
        <div class="d-flex justify-between align-center mb-2">
          <h3>${item.title}</h3>
          <button class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" 
                  onclick="toggleGalleryBookmark(${item.id})" 
                  title="${isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}">
            ❤️
          </button>
        </div>
        
        <p><strong>Event:</strong> ${item.event}</p>
        <p><strong>Category:</strong> ${item.category} | <strong>Year:</strong> ${item.year}</p>
        <p>${item.description}</p>
      </div>
    </div>
  `;
  
  openModal('galleryModal');
};

window.toggleGalleryBookmark = function(itemId) {
  const isBookmarked = BookmarkManager.toggleBookmark('gallery', itemId);
  
  document.querySelectorAll(`[onclick*="toggleGalleryBookmark(${itemId})"]`).forEach(btn => {
    btn.classList.toggle('bookmarked', isBookmarked);
    btn.title = isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks';
  });
};

// Carousel functionality
let currentSlideIndex = 0;
let carouselInterval;

function initializeCarousel() {
  // Start automatic slideshow
  carouselInterval = setInterval(nextSlide, 5000);
  
  // Pause on hover
  const carousel = document.querySelector('.hero-carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', () => clearInterval(carouselInterval));
    carousel.addEventListener('mouseleave', () => {
      carouselInterval = setInterval(nextSlide, 5000);
    });
  }
}

function showSlide(index) {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  
  if (!slides.length) return;
  
  // Handle wrap around
  if (index >= slides.length) currentSlideIndex = 0;
  else if (index < 0) currentSlideIndex = slides.length - 1;
  else currentSlideIndex = index;
  
  // Update slides
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === currentSlideIndex);
  });
  
  // Update dots
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlideIndex);
  });
}

window.nextSlide = function() {
  showSlide(currentSlideIndex + 1);
};

window.previousSlide = function() {
  showSlide(currentSlideIndex - 1);
};

window.currentSlide = function(index) {
  showSlide(index - 1);
};

// Global variables for countdown and carousel
let countdownInterval;

// Get Next Upcoming Event for Countdown
function getNextUpcomingEvent() {
  if (!eventsData || !eventsData.events || !Array.isArray(eventsData.events)) return null;
  
  const upcomingEvents = eventsData.events
    .filter(event => event.status === 'upcoming')
    .map(event => ({ ...event, dateObj: new Date(event.date) }))
    .filter(event => event.dateObj > new Date())
    .sort((a, b) => a.dateObj - b.dateObj);
  
  return upcomingEvents[0] || null;
}

// Get Featured Event (highest priority or biggest event of current month)
function getFeaturedEvent() {
  if (!eventsData || !eventsData.events || !Array.isArray(eventsData.events)) return null;
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  // Find events in current month
  const thisMonthEvents = eventsData.events
    .filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getMonth() === currentMonth && 
             eventDate.getFullYear() === currentYear &&
             (event.status === 'upcoming' || event.status === 'ongoing');
    })
    .sort((a, b) => {
      // Priority: featured > priority > normal events
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      if (a.priority > b.priority) return -1;
      if (a.priority < b.priority) return 1;
      return 0;
    });
  
  return thisMonthEvents[0] || null;
}

// Generate News Updates from Events
function generateNewsUpdates() {
  if (!eventsData || !eventsData.events || !Array.isArray(eventsData.events)) return 'Stay tuned for updates!';
  
  const upcomingEvents = eventsData.events
    .filter(event => event.status === 'upcoming')
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);
  
  const updates = upcomingEvents.map(event => {
    const daysUntil = Math.ceil((new Date(event.date) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysUntil <= 7) {
      return `🔥 ${event.name} - Only ${daysUntil} days left! Register now`;
    } else if (daysUntil <= 14) {
      return `📅 ${event.name} - Registration closing soon (${formatDate(event.date)})`;
    } else {
      return `🎯 Upcoming: ${event.name} on ${formatDate(event.date)}`;
    }
  });
  
  // Add some general updates
  updates.push('🌟 New events added weekly - Check back often!');
  updates.push('💡 Tip: Bookmark your favorite events to never miss them!');
  updates.push('🎊 Join our community events and make lasting memories!');
  
  return updates.join(' • ');
}

// Countdown Timer Functions
function startCountdown(eventDate) {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
  
  // Check if countdown elements exist
  const daysEl = document.getElementById('days');
  if (!daysEl) {
    console.warn('Countdown elements not found, skipping countdown initialization');
    return;
  }
  
  const targetDate = new Date(eventDate).getTime();
  
  countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const timeLeft = targetDate - now;
    
    if (timeLeft < 0) {
      clearInterval(countdownInterval);
      const timerEl = document.getElementById('countdown-timer');
      if (timerEl) {
        timerEl.innerHTML = '<div class="countdown-expired">Event Started!</div>';
      }
      return;
    }
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }, 1000);
}

// Counter Animation for About page
function initCounterAnimations() {
  // Only run if we're on the about page
  const currentPage = document.body.getAttribute('data-page');
  if (currentPage !== 'about') {
    return;
  }
  
  // Hero stats counters (animate on page load)
  const heroCounters = document.querySelectorAll('.about-hero-stats .counter-number');
  heroCounters.forEach((counter, index) => {
    const target = parseInt(counter.parentElement.getAttribute('data-target')) || 0;
    // Add staggered delay for hero counters
    setTimeout(() => {
      counter.parentElement.classList.add('fade-in-up');
      animateAboutCounter(counter, target, 2500); // 2.5 seconds animation
    }, index * 400); // 400ms delay between each counter
  });
  
  // Statistics section counters (animate on scroll into view)
  const statCounters = document.querySelectorAll('.statistics-section .stat-number');
  if (statCounters.length > 0) {
    const observerOptions = {
      threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.parentElement.getAttribute('data-target')) || 0;
          animateAboutCounter(counter, target, 2000);
          observer.unobserve(counter);
        }
      });
    }, observerOptions);
    
    statCounters.forEach(counter => {
      observer.observe(counter);
    });
  }
}

function animateAboutCounter(element, target, duration = 2000) {
  // Check if element exists before trying to animate it
  if (!element) {
    console.warn('animateAboutCounter: Element is null or undefined');
    return;
  }
  
  let current = 0;
  const startTime = performance.now();
  const endTime = startTime + duration;
  
  // Add initial fade-in animation to the counter
  element.style.opacity = '0';
  element.style.transform = 'translateY(20px)';
  
  setTimeout(() => {
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  }, 100);
  
  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function for smoother animation (ease-out)
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    current = target * easedProgress;
    
    if (progress >= 1) {
      // Animation complete - show final value with +
      element.textContent = target >= 1000 ? target.toLocaleString() + '+' : target + '+';
      // Add a subtle scale animation when complete
      element.style.transform = 'translateY(0) scale(1.1)';
      setTimeout(() => {
        element.style.transform = 'translateY(0) scale(1)';
      }, 200);
    } else {
      // Show current value (no + during animation)
      const displayValue = Math.floor(current);
      element.textContent = displayValue >= 1000 ? displayValue.toLocaleString() : displayValue.toString();
      requestAnimationFrame(updateCounter);
    }
  }
  
  requestAnimationFrame(updateCounter);
}

// Timeline Animation for About page
function initTimelineAnimations() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  const observerOptions = {
    threshold: 0.3
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);
  
  timelineItems.forEach(item => {
    observer.observe(item);
  });
}

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX;
}

function handleTouchEnd(event) {
  touchEndX = event.changedTouches[0].clientX;
  handleSwipe();
}

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      nextSlide();
    } else {
      previousSlide();
    }
  }
}

// Add touch event listeners after carousel is initialized
function addTouchListeners() {
  const carousel = document.querySelector('.hero-carousel');
  if (carousel) {
    carousel.addEventListener('touchstart', handleTouchStart);
    carousel.addEventListener('touchend', handleTouchEnd);
  }
}

// Initialize touch listeners after page load
if (document.body.getAttribute('data-page') === 'home') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(addTouchListeners, 200);
  });
}

// Helper functions for event detail page
// Get events from the past 30 days for feedback form
function getPastMonthEvents() {
  if (!eventsData || !eventsData.events) return [];
  
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
  
  return eventsData.events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= thirtyDaysAgo && eventDate <= now && event.status === 'past';
  }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Most recent first
}

function calculateEventDuration(startDate, endDate) {
  if (!endDate) return 'Duration varies';
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffHours = Math.abs(end - start) / (1000 * 60 * 60);
  
  if (diffHours < 24) {
    return `${Math.round(diffHours)} hour${diffHours !== 1 ? 's' : ''}`;
  } else {
    const days = Math.round(diffHours / 24);
    return `${days} day${days !== 1 ? 's' : ''}`;
  }
}

function calculateDaysUntil(eventDate) {
  const today = new Date();
  const event = new Date(eventDate);
  const timeDiff = event.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  if (daysDiff < 0) {
    return 'Event has passed';
  } else if (daysDiff === 0) {
    return 'Today!';
  } else if (daysDiff === 1) {
    return 'Tomorrow';
  } else if (daysDiff <= 7) {
    return `In ${daysDiff} days`;
  } else if (daysDiff <= 30) {
    const weeks = Math.floor(daysDiff / 7);
    return `In ${weeks} week${weeks !== 1 ? 's' : ''}`;
  } else {
    const months = Math.floor(daysDiff / 30);
    return `In ${months} month${months !== 1 ? 's' : ''}`;
  }
}

function getRelatedEvents(category, currentEventId) {
  if (!eventsData || !eventsData.events) return [];
  
  return eventsData.events
    .filter(event => 
      event.category.toLowerCase() === category.toLowerCase() && 
      event.id !== currentEventId &&
      event.status === 'upcoming'
    )
    .slice(0, 3);
}

function generateEventHighlights(event) {
  const highlights = [];
  
  // Add specific highlights based on event category
  switch (event.category.toLowerCase()) {
    case 'technical':
      highlights.push('Expert speakers from industry');
      highlights.push('Hands-on workshops and demonstrations');
      highlights.push('Networking opportunities with professionals');
      highlights.push('Certificate of participation');
      break;
    case 'cultural':
      highlights.push('Showcase of diverse cultural performances');
      highlights.push('Interactive cultural activities');
      highlights.push('Traditional food and refreshments');
      highlights.push('Photography and videography opportunities');
      break;
    case 'sports':
      highlights.push('Competitive tournaments and matches');
      highlights.push('Professional coaching and guidance');
      highlights.push('Awards and recognition for winners');
      highlights.push('Team building activities');
      break;
    case 'academic':
      highlights.push('Recognition of outstanding achievements');
      highlights.push('Inspirational speeches by faculty');
      highlights.push('Academic excellence awards');
      highlights.push('Networking with academic community');
      break;
    default:
      highlights.push('Engaging activities and programs');
      highlights.push('Learning and development opportunities');
      highlights.push('Community interaction and networking');
      break;
  }
  
  // Add common highlights
  if (event.featured) {
    highlights.unshift('Featured event of the season');
  }
  
  if (event.capacity && event.capacity < 100) {
    highlights.push('Limited seating - Register early');
  }
  
  if (event.registrationRequired) {
    highlights.push('Advance registration required');
  }
  
  return highlights.slice(0, 5); // Limit to 5 highlights
}


// Debug: Verify BookmarkManager availability
console.log('BookmarkManager loaded:', typeof BookmarkManager !== 'undefined');
console.log('toggleEventBookmark function:', typeof window.toggleEventBookmark);

// Make sure the function is properly bound
if (typeof window.toggleEventBookmark === 'function') {
  console.log('✅ Bookmark functionality is ready');
} else {
  console.error('❌ Bookmark functionality is NOT ready');
}
