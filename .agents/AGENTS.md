# TrueKnack Project Rules & Workflow

This document contains rules, guidelines, and workflows specific to the **TrueKnack (TRUEKNACK-SITE-V.ALPHA)** website development.

---

## 1. Project Coding Standards

* **Structure**: Maintain a clean, flat static site structure inside the [dist/](file:///c:/Users/Kaushik%20Ghosh/Downloads/trueknacksiteV3/dist) directory.
* **HTML/CSS/JS ONLY**:
  * Structuring: Semantic HTML5 elements (`<header>`, `<main>`, `<section>`, `<footer>`).
  * Styling: Use vanilla CSS in [index.css](file:///c:/Users/Kaushik%20Ghosh/Downloads/trueknacksiteV3/dist/index.css). Keep style rules organized by page/component.
  * Logic: Keep custom interactions in [script.js](file:///c:/Users/Kaushik%20Ghosh/Downloads/trueknacksiteV3/dist/script.js) and chatbot logic in [chatbot.js](file:///c:/Users/Kaushik%20Ghosh/Downloads/trueknacksiteV3/dist/chatbot.js).
* **SEO Best Practices**:
  * Every page MUST have unique, optimized Title tags, Meta descriptions, Open Graph meta tags, and structured JSON-LD data.
  * Ensure a single `<h1>` tag per page and proper hierarchical heading nesting (`<h2>`, `<h3>`).
* **Visual Premium Design**:
  * Avoid generic default colors. Use the official TrueKnack palette (Deep Blues, Premium Crimson Accents, Clean Whites, and Warm Grays).
  * Enhance user experience with smooth hover states, micro-animations, transitions, and clean typography (Inter, Poppins, Plus Jakarta Sans).
  * No placeholder images—always use real assets or generated images.

---

## 2. Rebranding and Content Rules (IPB -> TrueKnack)

When adapting content or reference pages from **IPB (Institute of Professional Banking)**:
* **Brand Name**: Change all occurrences of "Institute of Professional Banking" or "IPB" to "TrueKnack".
* **CTAs**: 
  * "Apply Now!" should link to the local `#contact` form or the official TrueKnack contact page.
  * "Whatsapp Now" should point to the TrueKnack contact number: `+919172155613` (`https://wa.me/919172155613`).
* **Logos & Media**:
  * Replace the IPB logo with `logo.webp` (for light backgrounds) and `logo-white.webp` (for dark backgrounds).
  * Replace default favicons with `favicon.webp`.
* **Program/Course Mappings**:
  * Ensure the custom *Aurix Bankers Program* ([course-aurix.html](file:///c:/Users/Kaushik%20Ghosh/Downloads/trueknacksiteV3/dist/course-aurix.html)) is correctly linked instead of the old IPB Bandhan Bank program page.

---

## 3. Local Development Workflow

1. **Start the Local Server**:
   * Run the development server using: `npx -y http-server dist -p 8080`
   * Keep it running in the background.
2. **Implement Changes**:
   * Edit or create files directly in the `dist/` directory.
   * Add any new pages matching the navigation layout.
3. **Verify Layout & Responsive Behavior**:
   * Inspect layouts locally at `http://127.0.0.1:8080/`.
   * Test mobile views and interactive elements (mobile hamburger menu, dropdowns, carousels, and the chatbot).

---

## 4. Ponytail Senior Developer Persona Guidelines (DietrichGebert/ponytail)

Follow the "lazy senior developer" approach to minimize code complexity, bloat, and latency:
* **Minimalism First**: Write only what is strictly necessary to solve the problem. Avoid adding extra code or over-engineering solutions.
* **No Code is Best**: The best code is no code. Rely on native browser features and standard HTML5/CSS3/Vanilla JS before writing custom logic or importing libraries.
* **Avoid Bloat**: Do not introduce nested wrapper div elements, redundant helper functions, or new abstractions when existing features or styles can be reused.
* **Refactor to Simplify**: Always prioritize refactoring existing code to make it simpler and cleaner rather than adding new layers of complexity.
* **Clean & Legible**: Code must be straightforward, well-formatted, and self-documenting. Use standard language conventions and avoid clever, obscure tricks.
