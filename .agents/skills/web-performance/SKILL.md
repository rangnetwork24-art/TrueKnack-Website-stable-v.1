---
name: web-performance
description: Web performance optimization skill focusing on Core Web Vitals, WebP asset optimization, font preloading, critical CSS rendering, and Lighthouse performance scoring.
---

# Web Performance & Core Web Vitals Skill

## Core Principles
1. **Target Core Web Vitals**:
   - **LCP (Largest Contentful Paint)** < 2.5s: Preload key hero images (`<link rel="preload" as="image" href="...">`).
   - **CLS (Cumulative Layout Shift)** < 0.1: Always explicitly specify `width` and `height` attributes on `<img>` and `<iframe>` elements to prevent layout shifts.
   - **INP (Interaction to Next Paint)** < 200ms: Keep main thread execution lightweight. Avoid heavy, blocking JavaScript.

2. **Asset Optimization**:
   - Use WebP/AVIF images exclusively.
   - Set `loading="lazy"` on all images below the fold. Never lazy-load above-the-fold hero images.
   - Minify CSS (`index.min.css`) and JS (`chatbot.min.css`).

3. **Font & Render Performance**:
   - Preconnect to font domains (`fonts.googleapis.com`, `fonts.gstatic.com`).
   - Use `font-display: swap` for Google Fonts to prevent invisible text during font loading.
