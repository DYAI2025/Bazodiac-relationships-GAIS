# Accessibility Checklist (WCAG 2.1 AA Compliance) — Bazodiac Relationships

This document details the accessibility specifications implemented inside the Bazodiac Relationships landing page prototype to meet WCAG 2.1 AA guidelines.

---

## 1. Landmark & Document Structure

| WCAG Criteria | Implementation Measure | Status | Test Verification Method |
| :--- | :--- | :--- | :--- |
| **1.3.1 Info and Relationships** | Native HTML5 semantic elements used: `<header>`, `<nav>`, `<main>`, `<section>`, and `<footer>`. | **COMPLETED** | Run an accessibility browser tree audit to verify that distinct regions are correctly announced. |
| **2.4.1 Bypass Blocks** | Interactive "Skip to main content" bypass link added at the top-level body root, linking directly to `#main-content`. | **COMPLETED** | Reload page, press `Tab` as your first keystroke. Ensure the "Skip to main content" button is visually revealed. |
| **1.3.1 Headings Tree** | Single `<h1>` display heading per page. Sub-headings use sequential, non-skipping `<h2>` and `<h3>` layout tags. | **COMPLETED** | Use a heading outline extension or tool to verify logical nesting (e.g. `H1 -> H2 -> H3`). |

---

## 2. Keyboard & Focus Management

| WCAG Criteria | Implementation Measure | Status | Test Verification Method |
| :--- | :--- | :--- | :--- |
| **2.1.1 Keyboard** | Every single interactive link, anchor, button, tab button, toggle, and dialog control is focusable and operable. | **COMPLETED** | Press `Tab` and `Shift + Tab` to ensure every actionable element can be highlighted and activated. |
| **2.4.7 Focus Visible** | All focusable components display a highly-contrasting focus outline: `outline: 3px solid #27386c; outline-offset: 4px;`. | **COMPLETED** | Tab through the page. Verify focus ring remains visible and does not clipping on bounds. |
| **2.4.3 Focus Order** | Dom structures match visual order. Modal dialog triggers a focus shift into the overlay and traps keyboard navigation. | **COMPLETED** | Open the evidence modal, tab repeatedly. Focus must loop only within modal controls until dismissed. |
| **2.1.2 No Keyboard Trap** | Mobile nav drawers and modals do not trap keyboard focus unless they are modal-overlays, from which users can exit using `Escape`. | **COMPLETED** | Open mobile menu and modal. Press `Escape` to ensure they close cleanly and restore focus to the trigger. |

---

## 3. Dynamic Interactive Widgets (ARIA)

| WCAG Criteria | Implementation Measure | Status | Test Verification Method |
| :--- | :--- | :--- | :--- |
| **4.1.2 Name, Role, Value** | Tab widget utilizes: `role="tablist"`, `role="tab"`, `role="tabpanel"`. Selecting tabs updates `aria-selected` and `aria-hidden`. | **COMPLETED** | Inspect tab buttons. Verify that changing active tabs dynamically updates `aria-selected` to `true` / `false`. |
| **1.3.1 Keyboard Tabs** | Right/Left arrow keys navigate and select tabs sequentially. `Home` selects first tab, `End` selects last. | **COMPLETED** | Focus on a tab, press Right Arrow. Active focus and panel content must shift immediately. |
| **4.1.2 Disclosure** | Conditions accordion uses `aria-expanded` and `aria-controls` linked to collapsible containers. | **COMPLETED** | Trigger the "View conditions" accordion. Confirm that `aria-expanded` switches between `true` and `false`. |

---

## 4. Forms, Validation & Status Updates

| WCAG Criteria | Implementation Measure | Status | Test Verification Method |
| :--- | :--- | :--- | :--- |
| **3.3.2 Labels or Instructions** | Every form element has a visible, associated `<label for="...">`. Placeholders are not used as labels. | **COMPLETED** | Inspect input labels. Ensure that clicking a label text focuses the corresponding input box. |
| **3.3.1 Error Identification** | Programmatic error labels display inline and associate with fields using `aria-describedby` upon invalid submissions. | **COMPLETED** | Submit empty forms. Verify that errors appear and are associated with correct input IDs. |
| **3.3.3 Error Suggestion** | A central `<div role="alert">` summary panel highlights all form validation failures and receives screen-reader focus. | **COMPLETED** | Trigger validation errors. Verify that focus moves automatically to the Error Summary box. |
| **4.1.3 Status Messages** | Success toast popups utilize `role="status"` to announce completion messages without interrupting keyboard focus. | **COMPLETED** | Submit valid fields. Check that the "Frontend prototype complete" toast triggers without capturing active focus. |

---

## 5. Visual Design & Contrast

| WCAG Criteria | Implementation Measure | Status | Test Verification Method |
| :--- | :--- | :--- | :--- |
| **1.4.3 Contrast (Minimum)** | High contrast colors. Ink primary charcoal (#2d2925) on ivory (#fbf4d4) exceeds 4.5:1 ratio. | **COMPLETED** | Verify color pairs using an online contrast checker to confirm AA compliance. |
| **1.4.1 Use of Color** | Color is never the sole indicator of meaning. Tab selections, focus states, and validation warnings use borders, text, and icons. | **COMPLETED** | Check forms and split circle toggles. All statuses are readable when color is desaturated. |
| **1.4.4 Resize Text** | The entire interface utilizes flexible units (`rem`, `em`, `%`) allowing up to 200% browser zoom without breaking content. | **COMPLETED** | Zoom browser to 200%. Verify that text wraps cleanly and does not overlap with container boundaries. |
| **2.2.2 Pause, Stop, Hide** | Integrated in-memory toggle deactivates all SVG line drawings, card floatings, and CSS fade transitions immediately. | **COMPLETED** | Click "Reduce motion". Verify that all transitions, drawings, and effects stop immediately. |
