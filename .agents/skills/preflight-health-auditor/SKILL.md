---
name: preflight-health-auditor
description: Automated pre-flight quality check skill verifying broken links, missing WebP assets, console error prevention, and clean http-server local deployment checks.
---

# Pre-Flight Health Auditor Skill

## Automated Checks Before Completing Tasks
1. **Asset & Link Integrity**:
   - Verify every local `<img src="...">` and `<a href="...">` points to a valid, existing file inside `public_html`.
   - Ensure zero broken image links or broken page anchors.

2. **Local Dev Server Check**:
   - Verify pages load cleanly without console errors over the local dev server (`http://127.0.0.1:3000`).

3. **No Auto-Commit Enforcement**:
   - Verify that no automatic `git commit` or `git push` is performed without explicit user direction or permission.
