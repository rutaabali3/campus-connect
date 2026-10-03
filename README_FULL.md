# CampusConnect – College Event Information System

A responsive, client‑side website that centralizes college events, galleries, contacts, and information for students and faculty. Data is loaded from local JSON files; no backend is required.

## Table of Contents
- Overview
- Project Structure
- How to Run (Local/XAMPP)
- Data Sources and Models
- Pages and Features
- SRS Compliance Checklist (What’s done vs. remaining)
- Known Limitations and Todos
- Non‑Functional Requirements Compliance
- Testing and Demo Artifacts
- Credits

## Overview
CampusConnect provides:
- Dynamic events catalog with filtering, sorting, details page, countdown, and featured banners
- Image gallery with featured carousel, category filters, yearly sections, and lightbox
- About with timelines, organizing bodies, and animated counters
- Contact with faculty/student coordinators (from JSON) and embedded Google Map
- Feedback page (UI‑only, non‑submitting) with star rating component
- Local bookmarking (events and gallery) via Web Storage

Built with vanilla HTML/CSS/JS to satisfy the “pure client‑side” constraint; no third‑party templates used.

## Project Structure
- `css/styles.css` – global styles, components, utilities
- `js/utils.js` – data loading, formatting, storage/bookmark helpers, perf helpers
- `js/app.js` – page rendering and interactive features
- `data/*.json` – content: events, gallery, contacts, about
- `images/*` – hero and preload images (favicons may be missing; see Todos)
- `*.html` – multi‑page shell files (home, events, gallery, about, contact, feedback, bookmarks, event-detail)
- `sw.js` – minimal service worker for clean registration

## How to Run (Local/XAMPP)
Option A: Any static server (recommended)
1) Open the folder in VS Code and use Live Server, or run a static server.
2) Navigate to `index.html` in your browser.

Option B: XAMPP (per SRS)
1) Copy the folder to `XAMPP/htdocs/CampusConnect`
2) Start Apache; visit `http://localhost/CampusConnect/index.html`

Note: For `file://` access, some browsers block `fetch()`. Use a local server.

## Data Sources and Models
- `data/events.json`
  - `id`, `name`, `date`, `time`, `venue`, `category`, `description`, `longDescription`, `image`, `status` (upcoming/past), `organizer`, `registrationRequired`, `featured?`, `priority?`
- `data/gallery.json`
  - `id`, `title`, `caption/description`, `image`, `category`, `event`, `year`, `featured?`
- `data/contacts.json`
  - `contacts`: `{ faculty[], students[], college {name,address,phone,email,website,mapCoordinates} }`
- `data/about.json`
  - `college {description, mission, vision, coreValues[]}`, `annualEvents[]`, `timeline[]`, `organizingBodies[]`, `statistics`

## Pages and Features
- Home (`index.html`)
  - Hero carousel, categories grid, next‑event countdown, featured event, highlights grid, testimonials, CTA, news ticker
- Events (`events.html`)
  - Catalog with category filters (all/technical/cultural/sports/academic/departmental), sort (date/name/category/priority), upcoming/past stats, card grid, modal, share, bookmarks, past events gallery
- Event Detail (`event-detail.html`)
  - Full details, badges, related events, actions (share/bookmark/register/add to calendar placeholder)
- Gallery (`gallery.html`)
  - Featured carousel, stats counters, category tabs, grid, yearly collapsible sections, lightbox
- About (`about.html`)
  - College overview, timeline, mission/vision, organizing bodies flip cards, core values, animated counters
- Contact (`contact.html`)
  - Faculty and student coordinators from JSON, college info, Google Map embed, FAQ accordion
- Feedback (`feedback.html`)
  - UI‑only form: name, email, user type, event attended (static options), rating (stars), comments, subscribe; client‑side interactions only
- Bookmarks (`bookmarks.html`)
  - Lists saved events and gallery items with remove actions

## SRS Compliance Checklist
Functional requirements
- Home page
  - Welcome/banner/slider: Implemented (hero carousel, dynamic content)
  - Nav to sections: Implemented (header nav, responsive)
  - Highlights of upcoming events from JSON: Implemented
  - Countdown to next event: Implemented
  - Responsive + animations: Implemented
- About page
  - College info, annual events, organizing bodies: Implemented
  - Month‑wise timeline: Implemented
- Event Listing / Catalog
  - Structured list with name/date/time/venue/description: Implemented
  - Filter by category (academic/cultural/sports/departmental): Implemented
  - Sort by date/name/category: Implemented (+priority)
  - Event details page: Implemented
  - Event calendar page: Not implemented (Remaining)
- Gallery
  - Images from JSON: Implemented
  - Group by year or category + filters: Implemented
  - Lightbox: Implemented
- Feedback page (UI only)
  - Fields (name, email, user type, event attended, rating, comments): Implemented (UI only)
  - “Event Attended limited to past month”: Not enforced (Remaining)
- Contact page
  - Faculty/Student coordinators from JSON: Implemented
  - Google Map embed: Implemented
- Bookmarking
  - Bookmark/favorite content via Web Storage: Implemented
  - SRS says “temporarily for session only”: Currently persists in localStorage (Remaining: switch to sessionStorage or clear on unload)

Technical considerations and tasks
- Pure client‑side with JSON/TXT: Implemented (JSON)
- SPA using Angular/React: Not implemented (site is multi‑page vanilla JS). Optional migration possible (Remaining)
- Search bar (by name/category) in events: Not implemented (Remaining)
- Sorting by department/popularity: Department field not present in data; popularity not tracked (Remaining or adjust data model)
- GPS functionality: Not implemented (Optional per SRS)
- Optional REST APIs: Not used (Optional)
- Local deployment on XAMPP: Supported (see run steps)

## Known Limitations and Todos
- Add Event Calendar view (month/week/day grid) and route/menu item
- Add search box to Events (name/organizer/category) with debounce
- Department‑wise listing: extend `data/events.json` with `department` and filters; or add Department page
- Registration: add a static registration page and wire “Register Now” buttons to it; optionally store draft data in Web Storage (UI only)
- Feedback: populate “Event Attended” dynamically from past‑month events and enforce the 1‑month rule
- Bookmarking session scope: migrate to `sessionStorage` or clear `localStorage` on session end
- Missing assets: `images/favicon.ico`, `images/apple-touch-icon.png`, OG image path; add lightweight placeholders
- Emoji mojibake in some UI strings: replace with proper Unicode glyphs or SVG icons
- Accessibility: run automated checks (axe/lighthouse) and add skip links/landmarks where missing

## Non‑Functional Requirements Compliance
- Safe to use: No downloads, client‑side only
- Accessibility: Semantic HTML, alt text, ARIA in nav; more work planned (see Todos)
- User‑friendliness: Clear navigation, consistent cards, responsive layout
- Operability: JSON errors handled with user‑friendly banners; graceful fallbacks for images
- Performance: Preload critical images, lazy image loading, minimal JS; countdown/animations efficient; service worker registers cleanly
- Scalability/Availability/Compatibility: Static hosting‑ready; responsive and modern‑browser compatible

## Testing and Demo Artifacts
- Manual test ideas are in `TESTING.md`
- Record an `.mp4` demo covering all pages, filters, sorting, bookmarking, gallery lightbox, and contact map per SRS deliverables

## Credits
- Built by Team Apex for CampusConnect
- No third‑party templates used. Replace emoji with SVGs if required for consistent rendering.
