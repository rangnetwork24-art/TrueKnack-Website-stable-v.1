---
name: seo-schema-validator
description: Automated SEO and JSON-LD Schema audit skill for verifying OpenGraph tags, structured data, canonical URLs, meta descriptions, and heading hierarchy across TrueKnack pages.
---

# SEO & Schema Validation Skill

## Rules & Checkpoints
1. **MetaData Integrity**:
   - Every HTML page MUST have unique `<title>`, `<meta name="description">`, and `<meta name="keywords">`.
   - Include OpenGraph tags (`og:title`, `og:description`, `og:image`, `og:url`) and Twitter Cards (`twitter:card`, `twitter:title`, `twitter:image`).
   - Standardize `<link rel="canonical" href="https://www.trueknack.in/[page.html]">`.

2. **JSON-LD Structured Data**:
   - Maintain correct Schema.org structured data for `EducationalOrganization`, `EmploymentAgency`, `WebSite`, and `BreadcrumbList`.
   - Ensure `telephone`, `email`, and `sameAs` social links match official TrueKnack profiles.

3. **Heading Hierarchy**:
   - Exactly ONE `<h1>` per page.
   - Strictly nested heading structure (`<h2>` for sections, `<h3>` for cards/sub-sections).
