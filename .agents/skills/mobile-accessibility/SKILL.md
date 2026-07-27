---
name: mobile-accessibility
description: Mobile UX and accessibility skill enforcing WCAG 2.1 standards, ARIA attributes, 48px min touch target sizes, color contrast compliance, and responsive drawer menu behavior.
---

# Mobile UX & Accessibility Skill

## Requirements
1. **Touch Target Size**:
   - Interactive elements (buttons, nav links, social icons, hamburger menu) MUST have a minimum touch target size of 44px × 44px (preferably 48px × 48px).

2. **Accessibility & ARIA**:
   - Every `<a>` without visible text MUST include an `aria-label` attribute (e.g. social icons, logo link).
   - Interactive buttons must have clear focus styles (`:focus-visible`).
   - Image elements must have meaningful `alt` text.

3. **Mobile Navigation**:
   - Mobile hamburger menu must toggle cleanly without horizontal page scroll.
   - Dropdown sub-menus on mobile must expand smoothly and collapse on backdrop tap.
