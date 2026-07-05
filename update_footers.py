import os
import re

directory = r"c:\Users\Kaushik Ghosh\Downloads\trueknacksiteV3\dist"

target_logo_old = """        <div class="footer-logo">
          <img src="logo-white.webp" alt="TrueKnack Footer Logo">
        </div>"""

target_logo_new = """        <div class="footer-logo">
          <img src="logo-white.webp" alt="TrueKnack Footer Logo">
        </div>
        <p style="margin-top: 10px; font-size: 0.85rem; line-height: 1.6; color: rgba(255,255,255,0.7); font-family: var(--font-body); text-align: left;">
          <strong>Head Office:</strong><br>
          2nd Floor, 201, Bhairaav Milestone, Wagle Industrial Estate, Thane West, Maharashtra - 400604
        </p>"""

# Match both single-line and multi-line versions of the floating whatsapp anchor tag
whatsapp_pattern = re.compile(
    r'<a\s+href="https://wa\.me/919172155613"\s+target="_blank"\s+rel="noopener\s+noreferrer"\s+class="floating-whatsapp"\s+aria-label="Chat\s+on\s+WhatsApp">\s*<i\s+class="fa-brands\s+fa-whatsapp"></i>\s*</a>',
    re.IGNORECASE | re.DOTALL
)

whatsapp_replacement = """  <!-- Floating WhatsApp + Call Buttons -->
  <div class="whatsapp-widget-container">
    <div class="whatsapp-popup" id="waPopup">
      <div class="wa-popup-header">
        <img src="logo-white.webp" alt="TrueKnack Logo" style="height: 24px; display: block; margin: 0 auto 5px auto;">
        <p style="margin: 0; font-size: 0.8rem; opacity: 0.9;">Chat with us on WhatsApp</p>
      </div>
      <div class="wa-popup-body">
        <a href="https://wa.me/919172155613" target="_blank" rel="noopener noreferrer" class="wa-contact-row">
          <div class="wa-contact-icon"><i class="fa-brands fa-whatsapp"></i></div>
          <div class="wa-contact-info">
            <span class="wa-contact-label">Admissions / Franchise</span>
            <span class="wa-contact-number">+91 91721 55613</span>
          </div>
        </a>
        <a href="https://wa.me/917559115998" target="_blank" rel="noopener noreferrer" class="wa-contact-row">
          <div class="wa-contact-icon"><i class="fa-brands fa-whatsapp"></i></div>
          <div class="wa-contact-info">
            <span class="wa-contact-label">Student Helpline</span>
            <span class="wa-contact-number">+91 75591 15998</span>
          </div>
        </a>
      </div>
    </div>
    <button class="floating-whatsapp" id="waToggle" aria-label="Open WhatsApp Chat">
      <i class="fa-brands fa-whatsapp"></i>
    </button>
  </div>"""

for filename in os.listdir(directory):
    if filename.endswith(".html"):
        filepath = os.path.join(directory, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        # Update Head Office Address under Logo
        if target_logo_old in content and target_logo_new not in content:
            content = content.replace(target_logo_old, target_logo_new)
            print(f"Updated footer logo address in {filename}")

        # Update Working Hours (fully spelled out)
        content = content.replace("Mon - Sat", "Monday - Saturday")

        # Update Floating WhatsApp Anchor with the dual number widget
        if whatsapp_pattern.search(content):
            content = whatsapp_pattern.sub(whatsapp_replacement, content)
            print(f"Updated WhatsApp widget in {filename}")

        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)

print("Bulk update complete!")
