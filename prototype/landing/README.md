# Bazodiac Relationships — Landing Page & Click Dummy Prototype

This directory contains the complete, polished, and fully accessible offline-executable HTML click dummy for the public landing page of **Bazodiac Relationships**.

This product is structured to support relational reflection using Chinese metaphysics and Western astrology perspectives without prescribing rigid diagnostic compatibility scores.

---

## 1. How to Open and Execute

Since this prototype is built using vanilla HTML5, CSS3, and standard JavaScript, it has **zero build steps or package dependencies**. It is designed to work fully offline and can be opened directly from the filesystem in any browser:

1. Locate the directory: `./prototype/landing/`
2. Double-click or open `index.html` in your web browser of choice.
3. The page will load and execute all interactions (tabs, dialogs, form validation, and responsiveness) immediately.

*Note for development preview*: When the Vite development server is running in AI Studio, navigating to the root URL (e.g. `http://localhost:3000`) will automatically redirect your browser window to this static folder, offering an instant, live, hot-reloading preview in the iframe.

---

## 2. File Architecture

The prototype is organized into clean, modular, single-responsibility files:

```text
prototype/landing/
├── index.html                  # Master Explanatory Landing Page with inline SVGs
├── login.html                  # Secure current-user mock Login form
├── register.html               # New-user mock Account Registration form
├── method.html                 # Methodology page detailing astro-synthesis principles
├── privacy.html                # Platform-intended data privacy principles
├── accessibility.html          # Public-facing web accessibility compliance statement
├── terms.html                  # Sandbox prototype legal disclaimer notice
├── styles.css                  # Custom CSS design system, typography, grids & responsive breakpoints
├── app.js                      # Core UX controller (header, tabs, accordion, circle, dialogs, motion)
├── auth-ui.js                  # Authentication form validators, state managers & secure adaptors
├── content.js                  # Isolated copy data representing report samples & evidence cards
├── assets/
│   └── relationship-network.svg # Reference vector network layout illustration
├── validate.js                 # Automated static assertion checker for CI/CD or dev checks
├── README.md                   # Setup, structural overview, and integration blueprints (this file)
└── ACCESSIBILITY_CHECKLIST.md  # Detailed WCAG 2.1 accessibility auditing checklist
```

---

## 3. Interaction Overview

Every single control and button on the interface is functional:

- **Global Navigation (Header & Footer)**: Fully wired to scroll smoothly to targeted IDs on the page, or navigate to corresponding external pages.
- **Mobile Menu**: Mobile navigation expands/collapses with custom visual markers, is dismissible with the Escape key, and handles accessible focus recovery cleanly.
- **Interactive Report Anatomy (Section 5)**: Multi-view ARIA-compliant tab controls. Left/Right arrows, Home, and End keys shift active states. Tab-panels toggle `aria-hidden` and `tabindex` programmatically.
- **Conditions Accordion**: An interactive disclosure panel exposing hidden intensifying or moderating variables and counter-hypotheses. Includes real-time `aria-expanded` and label changes.
- **Split Circle (Chance/Shadow - Section 6)**: Visual split-circle representing dual conditional expressions. Users can click on either half of the SVG circle or press custom buttons to instantly toggle active states.
- **Evidence Dialog (Section 8)**: An accessible `role="dialog"` modal that pops up over the page. It traps focus securely within the modal borders while open, can be closed via overlay clicks, close buttons, or the Escape key, and returns focus to the initiating button on exit.
- **Authentication Forms (Login/Register)**: Includes email syntax validations, password field match controls, password reveal toggles, accessible error summary blocks, and simulated loading indicators before rendering successful toast status notifications.
- **Reduced Motion**: Supports standard OS-level media queries and incorporates an in-memory toggle button. When motion is restricted, line-drawing, floats, parallax, and transitions are completely deactivated instantly.

---

## 4. Prototype Boundaries & Data Safety

To ensure compliance with strict data security guidelines, this click dummy runs in a sandboxed offline boundary:

- **No Network Activity**: Submit buttons trigger simulated loading lags of 1 second for visualization but execute zero network requests or AJAX calls.
- **No Client-Side Persistency**: No data is written to `localStorage`, `sessionStorage`, `document.cookie`, or IndexedDB. Email inputs are cleared on submission and never stored.
- **Zero Query-String Leakage**: Form actions are blocked from standard serializing into URL search strings. All passwords remain obscured in scope and are never logged, stored in state, or written to DOM attributes.
- **Next Parameter Safeguard**: Only allow known internal redirect hooks (`create-report` and `home`). Any unknown query string entries fallback immediately to `home`.

---

## 5. Future Backend Integration Blueprint

When transitioning this frontend prototype to a fully-functioning production cloud container, the `authAdapter` block in `auth-ui.js` can be refactored to interface directly with secure, server-side REST/gRPC endpoints.

### Authentication Endpoint Integration
```javascript
// Replace the prototype mock with a real fetch query proxying a server API route:
const authAdapter = {
  async register({ email, password }) {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create account.");
    }
    
    return await response.json(); // { accountCreated: true, redirectUrl: "/dashboard" }
  },

  async login({ email, password }) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Authentication failed.");
    }
    
    return await response.json(); // { sessionCreated: true, redirectUrl: "/dashboard" }
  }
};
```

All API keys (such as astrological API keys and database service account secrets) must remain securely on the server-side to prevent client-side credential exposure, adhering to strict production guidelines.
