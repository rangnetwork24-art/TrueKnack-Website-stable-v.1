---
name: security-and-hardening
description: Hardens code against vulnerabilities. Use when handling user input, authentication, data storage, or external integrations. Use when building any feature that accepts untrusted data, manages user sessions, or interacts with third-party services.
---

# Security and Hardening

## Overview

Security-first development practices for web applications. Treat every external input as hostile, every secret as sacred, and every authorization check as mandatory. Security isn't a phase — it's a constraint on every line of code that touches user data, authentication, or external systems.

## When to Use

- Building anything that accepts user input
- Implementing authentication or authorization
- Storing or transmitting sensitive data
- Integrating with external APIs or services
- Adding file uploads, webhooks, or callbacks

## Security Boundaries & Secret Management

### Always Do (No Exceptions)
- **Never commit secrets** (such as API keys, tokens, or private credentials) to version control.
- **Never store API keys in plaintext client-side files**.
- **Validate all external inputs** at the boundary.
- **Encode all output** to prevent Cross-Site Scripting (XSS).

### Safe Client-Side Integrations
For static websites that make direct client-side requests to third-party APIs (like Gemini):
1. **No Hardcoded Keys**: The application must never embed credentials or keys in cleartext within files.
2. **User-Provided Keys**: Allow users to input their own keys in a form field.
3. **Secure Browser Storage**: Store the user-provided key in `localStorage` in the user's browser context. Storing it in local storage ensures it remains isolated within their browser sandbox and is never exposed in git history or transmitted to other servers.
