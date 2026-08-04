/**
 * TrueKnack Chatbot Assistant
 */
document.addEventListener('DOMContentLoaded', () => {
  let launcher, windowEl, closeBtn, sendBtn, inputEl, messagesEl;
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

  const initChatbot = () => {
    // Only initialize once
    if (document.getElementById('trueknack-chatbot-container')) return;

    injectChatbotHTML();

    launcher = document.querySelector('.chatbot-launcher');
    windowEl = document.querySelector('.chatbot-window');
    closeBtn = document.querySelector('.chatbot-close');
    sendBtn = document.querySelector('.chatbot-send-btn');
    inputEl = document.getElementById('chatbotInput');
    messagesEl = document.querySelector('.chatbot-messages');

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
  };

  // Ensure CSS is loaded before injecting HTML to prevent FOUC (flicker)
  const cbStyle = document.querySelector('link[href*="chatbot.min.css"]');
  if (cbStyle) {
    let isLoaded = false;
    try {
      if (cbStyle.sheet && cbStyle.sheet.cssRules) {
        isLoaded = true;
      }
    } catch (e) {
      if (cbStyle.sheet) isLoaded = true;
    }

    if (isLoaded) {
      initChatbot();
    } else {
      cbStyle.addEventListener('load', initChatbot);
      // Fallback in case load event is missed
      setTimeout(initChatbot, 1000);
    }
  } else {
    initChatbot();
  }

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
      
      if (query.includes('course') || query.includes('program') || query.includes('pgcr') || query === 'courses') {
        addBotMessage(
          "Fantastic choice! Banking is one of the most stable and rewarding careers out there. 📈 At TrueKnack, we offer two premium placement-focused programs designed for graduates:\n\n" +
          "1. **Smart Banker Program**: A 3-month online comprehensive certificate course in Banking & Financial Services. 🎓\n" +
          "2. **Aurix Bankers Program**: A 3-month job-assured program in collaboration with AU Small Finance Bank. 👔\n\n" +
          "Which course would you like to explore?",
          [
            { text: "Smart Banker Program", reply: "smartbanker" },
            { text: "Aurix Bankers Program", reply: "aurix" }
          ]
        );
      } 
      else if (query.includes('smartbanker') || query.includes('smart banker') || query.includes('cbfs')) {
        addBotMessage(
          "Awesome! The **Smart Banker Program** is a great entry point into banking:\n\n" +
          "- ⏱️ **Duration**: 3 Months (Online mode).\n" +
          "- 🎓 **Eligibility**: Graduates or postgraduates aged 21-28 years with min. 50% marks.\n" +
          "- 🎯 **Salary Package**: ₹ 2.4 to 3.5 LPA (TrueKnack average).\n" +
          "- 📚 **Highlights**: Core banking systems (Finacle) training, Advanced Excel, NISM preparation, and ex-banker mock interviews.",
          [
            { text: "How to Apply", reply: "apply" },
            { text: "Main Menu", reply: "menu" }
          ]
        );
      } 
      else if (query.includes('aurix') || query.includes('au bank') || query.includes('au small')) {
        addBotMessage(
          "Superb choice! The **AURIX Bankers Program** in partnership with **AU Small Finance Bank** is an official banking career program:\n\n" +
          "- ⏱️ **Duration**: 1 Month Online Training + 2 Months Paid Internship in AU Bank Branch.\n" +
          "- 💼 **Target Role**: Bank Officer at AU Small Finance Bank.\n" +
          "- 🎓 **Eligibility**: Graduation min. 50% marks from a recognized university, Age up to 26 years.\n" +
          "- 💰 **Stipend**: INR 12,000 total stipend (from AU Bank) during 2-month internship.\n" +
          "- 🎯 **Starting CTC**: **₹ 3,50,000 P.A.** + Variable Incentives upon clearing final interview.\n" +
          "- 💸 **Program Fee**: ₹ 35,000 + 18% GST.\n\n" +
          "🔗 [Apply for Aurix Program Screening](https://aubankaurixprogram.trueknack.in/)",
          [
            { text: "Program Journey 🚀", reply: "aurix_journey" },
            { text: "How to Apply 📝", reply: "apply" },
            { text: "Main Menu 🏠", reply: "menu" }
          ]
        );
      }
      else if (query.includes('aurix_journey') || query.includes('journey') || query.includes('steps')) {
        addBotMessage(
          "Here is your structured 8-step path to start your career in **AU Small Finance Bank**:\n\n" +
          "1️⃣ **Application & Screening** by TrueKnack Team\n" +
          "2️⃣ **Enrollment**: Program Fee (₹35,000 + 18% GST)\n" +
          "3️⃣ **1-Month Online Training** by TrueKnack (Banking fundamentals, sales readiness & workplace skills)\n" +
          "4️⃣ **2-Month Paid Internship (OJT)** in an AU Bank Branch\n" +
          "5️⃣ **OJT Stipend**: INR 12,000 total stipend from AU Bank\n" +
          "6️⃣ **Final Bank Interview** by AU Small Finance Bank\n" +
          "7️⃣ **Offer / Joining Letter** as Bank Officer (₹ 3,50,000 P.A. + Variable Incentives)\n" +
          "8️⃣ **Start Your Career** in AU Bank! 🏦\n\n" +
          "🔗 [Click here to Book Your Screening](https://aubankaurixprogram.trueknack.in/)",
          [
            { text: "How to Apply", reply: "apply" },
            { text: "Main Menu", reply: "menu" }
          ]
        );
      } 
      else if (query.includes('placement') || query.includes('job') || query.includes('hiring') || query.includes('recruit')) {
        addBotMessage(
          "Our placement record is something we are incredibly proud of! 🎉\n\n" +
          "We have successfully helped over **6,000+ graduates** kickstart their careers! 🚀 Our students are placed in top private sector banks like Axis Bank, HDFC Bank, Kotak Mahindra, IDFC First Bank, and AU Small Finance Bank, with packages up to **4.5 LPA**! 💸\n\n" +
          "Want to see where our graduates work?",
          [
            { text: "View Recruiters", reply: "recruiters" },
            { text: "Main Menu", reply: "menu" }
          ]
        );
      } 
      else if (query.includes('fee') || query.includes('cost') || query.includes('duration') || query === 'fees') {
        addBotMessage(
          "Here are the fee and duration details for our banking programs:\n\n" +
          "1️⃣ **Smart Banker Program**:\n" +
          "- ⏱️ **Duration**: 3 Months (Online Training)\n" +
          "- 💸 **Fee**: ₹ 50,000 + GST (Installment & 0% interest loan options available)\n\n" +
          "2️⃣ **AURIX Bankers Program (AU Bank)**:\n" +
          "- ⏱️ **Duration**: 1 Month Online Training + 2 Months Paid Branch Internship\n" +
          "- 💸 **Program Fee**: ₹ 35,000 + 18% GST\n" +
          "- 💰 **Stipend**: INR 12,000 total stipend paid by AU Bank during internship\n\n" +
          "🔗 [Apply for Aurix Screening](https://aubankaurixprogram.trueknack.in/)",
          [
            { text: "Apply for Aurix", reply: "aurix" },
            { text: "Request Callback", reply: "contact" },
            { text: "Main Menu", reply: "menu" }
          ]
        );
      } 
      else if (query.includes('eligibility') || query.includes('eligible') || query.includes('qualification')) {
        addBotMessage(
          "Eligibility criteria for our programs:\n\n" +
          "🎓 **Aurix Bankers Program (AU Small Finance Bank)**:\n" +
          "- **Education**: Graduate with min. 50% marks from a recognized University\n" +
          "- **Age**: Up to 26 Years\n" +
          "- **Skills**: Basic English communication preferred\n" +
          "- **Gender & Location**: Male & Female candidates, Open Pan India\n\n" +
          "🎓 **Smart Banker Program**:\n" +
          "- **Education**: Graduation in regular mode with min. 50% marks\n" +
          "- **Age**: 21 to 28 Years\n\n" +
          "Ask me about a specific program to check your fit!",
          [
            { text: "Check Aurix Program", reply: "aurix" },
            { text: "Check Smart Banker", reply: "smartbanker" },
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
          "📞 **Admissions Helpline**: +91 91721 55613\n" +
          "📧 **Email**: info@trueknack.in\n" +
          "💬 **WhatsApp**: [Click here to Chat directly!](https://wa.me/919967049610)\n\n" +
          "Helpline hours: Mon - Sat, 9:00 AM - 7:00 PM. Talk soon! 😊",
          [
            { text: "Back to Menu", reply: "menu" }
          ]
        );
      }
      else if (query.includes('apply') || query.includes('register') || query.includes('admission')) {
        addBotMessage(
          "Fantastic choice! I'm so excited you're ready to start your journey! 🌟 Here are the easiest ways to apply:\n\n" +
          "1️⃣ Fill out the application form on the [Contact Us](#contact) page.\n" +
          "2️⃣ Call Admissions directly at **+91 91721 55613**.\n" +
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
