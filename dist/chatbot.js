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
        <i class="fa-solid fa-comments"></i>
      </div>
      <div class="chatbot-window">
        <div class="chatbot-header">
          <div class="chatbot-avatar">
            <i class="fa-solid fa-user-tie"></i>
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
          "Fantastic choice! Banking is one of the most stable and rewarding careers out there. 📈 At TrueKnack, we have two flagship programs custom-designed to get you job-ready in no time:\n\n" +
          "1. **PGCRBF** (Post Graduate Certificate in Retail Banking & Finance): Perfect if you love interacting with people, managing relations, and driving sales! 🤝\n" +
          "2. **PGCRBO** (Post Graduate Certificate in Retail Banking Operations): Ideal if you prefer operations, support, and keeping the banking machinery running smoothly behind the scenes! ⚙️\n\n" +
          "Which path sounds more exciting to you?",
          [
            { text: "About PGCRBF", reply: "pgcrbf" },
            { text: "About PGCRBO", reply: "pgcrbo" },
            { text: "Check Eligibility", reply: "eligibility" }
          ]
        );
      } 
      else if (query.includes('pgcrbf')) {
        addBotMessage(
          "Awesome! The **PGCRBF (Retail Banking & Finance)** program is an absolute game-changer! Here's the details:\n\n" +
          "- ⏱️ **Duration**: A fast-track **2-Month** intensive program.\n" +
          "- 💻 **Delivery**: Live interactive online classes + branch simulation practice to build confidence.\n" +
          "- 🎯 **Focus Areas**: Retail bank products, customer relationship management, mock interviews, and grooming.\n" +
          "- 💼 **Placements**: You get **100% placement support** with top private banks. We prepare you to ace every interview!",
          [
            { text: "How to Apply", reply: "apply" },
            { text: "Main Menu", reply: "menu" }
          ]
        );
      } 
      else if (query.includes('pgcrbo')) {
        addBotMessage(
          "Superb! Operations is the backbone of any banking institution. 🏢 The **PGCRBO (Retail Banking Operations)** program is designed to make you a star ops specialist:\n\n" +
          "- ⏱️ **Duration**: **2 Months** of dedicated training.\n" +
          "- 🏫 **Delivery**: Interactive classroom & online training.\n" +
          "- 🎯 **Focus Areas**: Back-office operations, clearing house tasks, KYC audits, and compliance.\n" +
          "- 💼 **Job Role Target**: Non-sales core operation executive in private sector banks. No sales pressure!",
          [
            { text: "How to Apply", reply: "apply" },
            { text: "Main Menu", reply: "menu" }
          ]
        );
      } 
      else if (query.includes('placement') || query.includes('job') || query.includes('hiring') || query.includes('recruit')) {
        addBotMessage(
          "Our placement record is something we are incredibly proud of! 🎉\n\n" +
          "We have successfully helped over **6,000+ graduates** kickstart their careers! 🚀 Our students are placed in top private sector banks like Axis Bank, HDFC Bank, Kotak Mahindra, and ICICI, with average packages starting from **3.0 LPA+**! 💸\n\n" +
          "Want to see where our graduates work?",
          [
            { text: "View Recruiters", reply: "recruiters" },
            { text: "Main Menu", reply: "menu" }
          ]
        );
      } 
      else if (query.includes('fee') || query.includes('cost') || query.includes('duration') || query === 'fees') {
        addBotMessage(
          "Investing in yourself is the best decision you can make! 💡 Both PGCRBF and PGCRBO programs are just **2 Months** long—meaning you can be trained and placed in just 60 days!\n\n" +
          "We also offer easy **EMI (monthly installment) plans** and scholarships to make it stress-free. Would you like our admissions advisor to contact you with the fee structure?",
          [
            { text: "Yes, Request Callback", reply: "contact" },
            { text: "Main Menu", reply: "menu" }
          ]
        );
      } 
      else if (query.includes('eligibility') || query.includes('eligible') || query.includes('qualification')) {
        addBotMessage(
          "Let's see if we're a match! Here is the eligibility criteria for our courses:\n\n" +
          "- 🎓 **Education**: Graduates in any stream (B.Com, BBA, BA, B.Sc, etc.)\n" +
          "- 👶 **Age**: Fresh graduates up to **28 years** old.\n" +
          "- 📍 **Location**: Resident of Maharashtra (with centers in Thane, Pune, Mumbai, Nashik, etc.).\n\n" +
          "If you meet these, you are ready to roll! Let's get your application started! 🌟",
          [
            { text: "Apply Now", reply: "apply" },
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
          "📧 **Email**: info@trueknack.com\n" +
          "💬 **WhatsApp**: [Click here to Chat directly!](https://wa.me/919172155613)\n\n" +
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
          "🏦 Axis Bank, HDFC Bank, Kotak Mahindra, IndusInd Bank, Yes Bank, ICICI Bank, AU Small Finance Bank, Federal Bank, and Bandhan Bank.",
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
