/**
 * TrueKnack Chatbot Assistant
 */
document.addEventListener('DOMContentLoaded', () => {
  // Create chatbot elements dynamically and inject them
  injectChatbotHTML();

  const launcher = document.querySelector('.chatbot-launcher');
  const windowEl = document.querySelector('.chatbot-window');
  const closeBtn = document.querySelector('.chatbot-close');
  const sendBtn = document.querySelector('.chatbot-send-btn');
  const inputEl = document.getElementById('chatbotInput');
  const messagesEl = document.querySelector('.chatbot-messages');

  let initialized = false;

  // Toggle Chat window
  const toggleChat = () => {
    const isActive = windowEl.classList.toggle('active');
    launcher.classList.toggle('active', isActive);
    
    if (isActive && !initialized) {
      triggerBotGreeting();
      initialized = true;
    }
  };

  launcher.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', toggleChat);

  // Send message on click or Enter key
  sendBtn.addEventListener('click', handleUserSend);
  inputEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUserSend();
  });

  // Handle quick replies delegation
  messagesEl.addEventListener('click', (e) => {
    if (e.target.classList.contains('quick-reply-chip')) {
      const userText = e.target.getAttribute('data-reply') || e.target.innerText;
      addUserMessage(userText);
      generateBotResponse(userText);
    }
  });

  function injectChatbotHTML() {
    const chatbotContainer = document.createElement('div');
    chatbotContainer.id = 'trueknack-chatbot-container';
    chatbotContainer.innerHTML = `
      <div class="chatbot-launcher">
        <img src="images/chatbot_agent.webp?v=7" alt="Chatbot Launcher" class="chatbot-launcher-img">
        <i class="fa-solid fa-xmark chatbot-close-icon" style="display: none;"></i>
        <span class="chatbot-launcher-badge">Hi!</span>
      </div>
      <div class="chatbot-window">
        <div class="chatbot-header">
          <div class="chatbot-avatar">
            <img src="images/chatbot_agent.webp?v=7" alt="Knacky Avatar" class="chatbot-avatar-img">
          </div>
          <div class="chatbot-header-info">
            <h4>Knacky 🚀</h4>
            <span>Admission Assistant</span>
          </div>
          <div class="chatbot-close">
            <i class="fa-solid fa-xmark"></i>
          </div>
        </div>
        <div class="chatbot-messages">
          <!-- Messages will load here dynamically -->
        </div>
        <div class="chatbot-input-area">
          <input type="text" id="chatbotInput" placeholder="Ask me about banking courses..." autocomplete="off">
          <button class="chatbot-send-btn" aria-label="Send message">
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(chatbotContainer);
  }

  function triggerBotGreeting() {
    showTypingIndicator();
    setTimeout(() => {
      removeTypingIndicator();
      addBotMessage(
        "Hey there! 🌟 Welcome to **TrueKnack**! I'm Knacky, your Admission Assistant. I'm super excited to help you launch a successful career in banking! 🚀 What are we exploring today?",
        [
          { text: "Explore Courses 🎓", reply: "courses" },
          { text: "Placement Record 💼", reply: "placement" },
          { text: "Fees & Duration 💸", reply: "fees" },
          { text: "Contact an Advisor 📞", reply: "contact" }
        ]
      );
    }, 1000);
  }

  function handleUserSend() {
    const text = inputEl.value.trim();
    if (!text) return;

    addUserMessage(text);
    inputEl.value = '';
    generateBotResponse(text);
  }

  function addUserMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-msg user';
    msgDiv.innerHTML = `
      <div class="chat-msg-bubble">${escapeHTML(text)}</div>
      <span class="chat-msg-time">${getCurrentTime()}</span>
    `;
    messagesEl.appendChild(msgDiv);
    scrollToBottom();
  }

  function addBotMessage(markdownText, quickReplies = []) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-msg bot';
    
    // Simple markdown converter (bold, links, linebreaks)
    let formattedText = escapeHTML(markdownText)
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color: #9B1A1E; font-weight:600;">$1</a>')
      .replace(/\n/g, '<br>');

    let htmlContent = `<div class="chat-msg-bubble">${formattedText}</div>`;

    if (quickReplies && quickReplies.length > 0) {
      let chipsHTML = `<div class="chat-quick-replies">`;
      quickReplies.forEach(chip => {
        chipsHTML += `<button class="quick-reply-chip" data-reply="${chip.reply}">${chip.text}</button>`;
      });
      chipsHTML += `</div>`;
      htmlContent += chipsHTML;
    }

    htmlContent += `<span class="chat-msg-time">${getCurrentTime()}</span>`;
    msgDiv.innerHTML = htmlContent;
    messagesEl.appendChild(msgDiv);
    scrollToBottom();
  }

  function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'chatbot-typing-indicator';
    indicator.className = 'chat-msg bot';
    indicator.innerHTML = `
      <div class="chat-msg-bubble typing-indicator">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    `;
    messagesEl.appendChild(indicator);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('chatbot-typing-indicator');
    if (indicator) indicator.remove();
  }

  function generateBotResponse(userText) {
    showTypingIndicator();
    const query = userText.toLowerCase().trim();

    setTimeout(() => {
      removeTypingIndicator();
      
      // Match keywords
      if (query.includes('course') || query.includes('program') || query.includes('pgcr') || query === 'courses') {
        addBotMessage(
          "Fantastic choice! Banking is one of the most stable and rewarding careers out there. 📈 At TrueKnack, we offer four placement-focused programs designed for graduates:\n\n" +
          "1. **CBFS Course** (Certificate in Banking & Financial Services): A 3-month job-ready online certificate. 🎓\n" +
          "2. **PO Program** (Probationary Officer's Program): A 12-month residential path for AM-II recruitment at Utkarsh Small Finance Bank. 👔\n" +
          "3. **DCB Bank Program**: A fast-track 15-day Hire-Train-Deploy model for Customer Service Managers. 💼\n" +
          "4. **IGNITE Program**: A 2-week residential launchpad in collaboration with Equitas Small Finance Bank. ⚡\n\n" +
          "Which course would you like to explore?",
          [
            { text: "CBFS Course", reply: "cbfs" },
            { text: "PO Program", reply: "po" },
            { text: "DCB Bank Program", reply: "dcb" },
            { text: "IGNITE Program", reply: "ignite" }
          ]
        );
      } 
      else if (query.includes('cbfs')) {
        addBotMessage(
          "Awesome! The **CBFS (Certificate in Banking & Financial Services)** course is a great entry point:\n\n" +
          "- ⏱️ **Duration**: 3 Months (Online mode).\n" +
          "- 🎓 **Eligibility**: Graduation with min. 50% marks in 10th, 12th & Graduation, aged 21-27 years.\n" +
          "- 🎯 **Salary Package**: ₹ 2.4 to 3.5 LPA (TrueKnack average).\n" +
          "- 📚 **Highlights**: Core banking systems (Finacle) training, Advanced Excel, NISM VA MF prep, and ex-banker mock interviews.",
          [
            { text: "How to Apply", reply: "apply" },
            { text: "Main Menu", reply: "menu" }
          ]
        );
      } 
      else if (query.includes('po ') || query.includes(' po') || query === 'po' || query.includes('utkarsh')) {
        addBotMessage(
          "Superb choice! The **Probationary Officer's Program** in partnership with Utkarsh Small Finance Bank is a premium residential course:\n\n" +
          "- ⏱️ **Duration**: 12 Months (4 months residential at Baddi University + 2 months internship with ₹10,000/mo stipend + 6 months OJT with ₹16,000/mo stipend).\n" +
          "- 🎓 **Eligibility**: Regular graduation or postgraduation with min. 50% marks, aged below 27 years.\n" +
          "- 🎯 **Starting CTC**: AM-II role starting at ₹ 5.0 LPA.\n" +
          "- 📚 **Certification**: UGC-approved Advanced Certificate in Banking and Financial Services (ACBFS) from Sharda University.",
          [
            { text: "How to Apply", reply: "apply" },
            { text: "Main Menu", reply: "menu" }
          ]
        );
      } 
      else if (query.includes('dcb')) {
        addBotMessage(
          "Excellent! The **HTD Model with DCB Bank** is a secure, fast-track career launchpad:\n\n" +
          "- ⏱️ **Duration**: 15 Days (Offline classroom training).\n" +
          "- 🎓 **Eligibility**: Regular graduation with min. 50% marks, aged below 25 years.\n" +
          "- 🎯 **Starting CTC**: Customer Service Manager with ₹ 3.5 - 4.5 LPA assured salary.\n" +
          "- 📚 **Highlights**: Selection by DCB Bank before training starts. Fee of ₹40,000 + GST is payable only after selection.",
          [
            { text: "How to Apply", reply: "apply" },
            { text: "Main Menu", reply: "menu" }
          ]
        );
      } 
      else if (query.includes('ignite') || query.includes('equitas')) {
        addBotMessage(
          "Fantastic! The **Equitas SFB IGNITE Program** is a short, job-assured residential carrier launchpad:\n\n" +
          "- ⏱️ **Duration**: 2 Weeks (Residential training at Baddi University).\n" +
          "- 🎓 **Eligibility**: Graduation with min. 50% marks, aged 26 years and below.\n" +
          "- 🎯 **Starting CTC**: Business Development Officer (BDO) with ₹ 3.5 LPA + incentives.\n" +
          "- 📚 **Highlights**: Job offer letter issued before training. Full course fee of ₹42,000 + GST is refunded as a performance bonus after 12 months.",
          [
            { text: "How to Apply", reply: "apply" },
            { text: "Main Menu", reply: "menu" }
          ]
        );
      } 
      else if (query.includes('placement') || query.includes('job') || query.includes('hiring') || query.includes('recruit')) {
        addBotMessage(
          "Our placement record is something we are incredibly proud of! 🎉\n\n" +
          "We have successfully helped over **6,000+ graduates** kickstart their careers! 🚀 Our students are placed in top private sector banks like Axis Bank, HDFC Bank, Kotak Mahindra, IDFC First Bank, DCB Bank, and Equitas Small Finance Bank, with packages up to **4.5 LPA**! 💸\n\n" +
          "Want to see where our graduates work?",
          [
            { text: "View Recruiters", reply: "recruiters" },
            { text: "Main Menu", reply: "menu" }
          ]
        );
      } 
      else if (query.includes('fee') || query.includes('cost') || query.includes('duration') || query === 'fees') {
        addBotMessage(
          "We offer flexible payment options to help you invest in your future:\n\n" +
          "- **CBFS Course**: ₹ 69,900 (Installments & 0% interest loan options available).\n" +
          "- **PO Program**: ₹ 2.65 Lacs (Initial deposit of ₹40,000, rest via bank loan).\n" +
          "- **DCB Bank Program**: ₹ 40,000 + GST (Payable only after selection).\n" +
          "- **IGNITE Program**: ₹ 42,000 + GST (Fully refunded after 12 months on job).\n\n" +
          "Would you like our admissions advisor to contact you with details?",
          [
            { text: "Yes, Request Callback", reply: "contact" },
            { text: "Main Menu", reply: "menu" }
          ]
        );
      } 
      else if (query.includes('eligibility') || query.includes('eligible') || query.includes('qualification')) {
        addBotMessage(
          "Eligibility criteria varies by program, but generally:\n\n" +
          "- 🎓 **Education**: Graduation in regular mode with minimum 50% marks.\n" +
          "- 👶 **Age Limit**: Aged between 21-27 years depending on the program (below 25 for DCB, 26 for IGNITE).\n" +
          "- 📍 **Centers**: Local counseling is available at our verified Maharashtra centers (Thane, Pune, Mumbai, Nagpur, Sambhajinagar).\n\n" +
          "Ask me about a specific program to check your fit!",
          [
            { text: "Check CBFS", reply: "cbfs" },
            { text: "Check PO Program", reply: "po" },
            { text: "Main Menu", reply: "menu" }
          ]
        );
      }
      else if (query.includes('location') || query.includes('center') || query.includes('pune') || query.includes('thane') || query.includes('mumbai') || query.includes('where')) {
        addBotMessage(
          "We are super proud of our roots in Maharashtra! 🗺️ Our headquarters is located in **Thane**, but we operate interactive learning hubs across the state:\n\n" +
          "📍 Thane, Pune, Mumbai, Nashik, Nagpur, Kolhapur, Aurangabad, and Solapur.\n\n" +
          "Our main office:\n" +
          "🏢 Wagle Industrial Estate, Thane West, Maharashtra - 400604.",
          [
            { text: "Contact Details", reply: "contact" },
            { text: "Main Menu", reply: "menu" }
          ]
        );
      } 
      else if (query.includes('contact') || query.includes('call') || query.includes('number') || query.includes('phone') || query.includes('email') || query.includes('support')) {
        addBotMessage(
          "Let's chat! Our friendly advisor team is ready to answer all your questions and guide you:\n\n" +
          "📞 **Admissions Helpline**: +91 99670 49610\n" +
          "📧 **Email**: info@trueknack.com\n" +
          "💬 **WhatsApp**: [Click here to Chat directly!](https://wa.me/919967049610)\n\n" +
          "Helpline hours: Mon - Sat, 9:00 AM - 6:00 PM. Talk soon! 😊",
          [
            { text: "Back to Menu", reply: "menu" }
          ]
        );
      }
      else if (query.includes('apply') || query.includes('register') || query.includes('admission')) {
        addBotMessage(
          "Fantastic choice! I'm so excited you're ready to start your journey! 🌟 Here are the easiest ways to apply:\n\n" +
          "1️⃣ Fill out the application form on the [Contact Us](#contact) page.\n" +
          "2️⃣ Call Admissions directly at **+91 99670 49610**.\n" +
          "3️⃣ Or request a callback below and we'll reach out to you!\n\n" +
          "Let's build your future together! 🚀",
          [
            { text: "Request Callback", reply: "contact" },
            { text: "Main Menu", reply: "menu" }
          ]
        );
      }
      else if (query.includes('recruiters') || query.includes('banks')) {
        addBotMessage(
          "We partner with the best in the industry! 🤝 Our graduates are highly sought after by premier financial brands:\n\n" +
          "🏦 Axis Bank, HDFC Bank, Kotak Mahindra, IndusInd Bank, Yes Bank, ICICI Bank, AU Small Finance Bank, and Bandhan Bank.",
          [
            { text: "Placement Record", reply: "placement" },
            { text: "Main Menu", reply: "menu" }
          ]
        );
      }
      else if (query === 'menu' || query === 'help' || query === 'hi' || query === 'hello') {
        addBotMessage(
          "Hey! Great to see you here! 😄 How can I help you kickstart your banking career today? Pick an option to get started:",
          [
            { text: "Explore Courses 🎓", reply: "courses" },
            { text: "Placement Record 💼", reply: "placement" },
            { text: "Fees & Duration 💸", reply: "fees" },
            { text: "Contact Info 📞", reply: "contact" }
          ]
        );
      }
      else {
        addBotMessage(
          "Hmm, I didn't quite catch that, but don't worry! 🤔 I'm always learning. You can ask me about our courses, placements, fees, locations, eligibility, or type 'menu' to see all options!",
          [
            { text: "Explore Courses 🎓", reply: "courses" },
            { text: "Contact Advisor 📞", reply: "contact" }
          ]
        );
      }
    }, 800);
  }

  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 12 instead of 0
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
  }

  function escapeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
