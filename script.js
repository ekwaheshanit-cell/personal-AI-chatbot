// ===== DOM Elements =====
const chatArea = document.getElementById('chatArea');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const themeToggle = document.getElementById('themeToggle');

// ===== Chat History =====
let chatHistory = [];

// ===== Bot Responses =====
// The bot picks a response based on keywords in your message.
// You can customize these to say whatever you want!
const responses = {
    greetings: {
        keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy'],
        replies: [
            "Hello! How can I help you today?",
            "Hi there! Nice to meet you. What's on your mind?",
            "Hey! I'm your AI assistant. How can I help?",
        ]
    },
    howAreYou: {
        keywords: ['how are you', 'how do you do', "what's up", 'how is it going'],
        replies: [
            "I'm doing great, thanks for asking! How about you?",
            "I'm wonderful! Ready to chat. How are you?",
            "All good here! What can I do for you today?",
        ]
    },
    name: {
        keywords: ['your name', 'who are you', 'what are you'],
        replies: [
            "I'm your personal AI chatbot assistant! You can call me ChatBot.",
            "I'm ChatBot, your friendly AI assistant. Nice to meet you!",
            "I'm an AI assistant built to help you. You can call me ChatBot!",
        ]
    },
    help: {
        keywords: ['help', 'can you help', 'assist', 'support'],
        replies: [
            "Of course! I'm here to help. What do you need assistance with?",
            "I'd love to help! Tell me what you need.",
            "Sure thing! Just let me know what you're looking for.",
        ]
    },
    thanks: {
        keywords: ['thank', 'thanks', 'thank you', 'appreciate'],
        replies: [
            "You're welcome! Happy to help.",
            "Anytime! Let me know if you need anything else.",
            "Glad I could help! Feel free to ask more questions.",
        ]
    },
    goodbye: {
        keywords: ['bye', 'goodbye', 'see you', 'take care', 'good night'],
        replies: [
            "Goodbye! Have a wonderful day!",
            "See you later! Take care!",
            "Bye! Come back anytime you want to chat!",
        ]
    },
    jokes: {
        keywords: ['joke', 'funny', 'laugh', 'humor'],
        replies: [
            "Why don't scientists trust atoms? Because they make up everything!",
            "What do you call a fake noodle? An impasta!",
            "Why did the scarecrow win an award? He was outstanding in his field!",
            "What do you call a bear with no teeth? A gummy bear!",
        ]
    },
    weather: {
        keywords: ['weather', 'temperature', 'rain', 'sunny', 'cold', 'hot'],
        replies: [
            "I can't check the real weather, but I hope it's lovely where you are!",
            "I don't have access to weather data, but I hope you're having a nice day!",
            "I wish I could tell you the weather! Try checking a weather app for the latest updates.",
        ]
    },
    time: {
        keywords: ['time', 'date', 'day', 'today'],
        replies: [
            `The current date and time on your device is: ${new Date().toLocaleString()}`,
            `Right now it's ${new Date().toLocaleString()} according to your device.`,
        ]
    },
    capabilities: {
        keywords: ['what can you do', 'features', 'abilities', 'capable'],
        replies: [
            "I can chat with you, tell jokes, answer basic questions, and keep you company! I'm a simple chatbot, so I work best with casual conversation.",
            "I'm great at casual conversation! I can greet you, tell jokes, and chat about various topics. Try asking me something!",
        ]
    }
};

// Default responses when no keyword matches
const defaultReplies = [
    "That's interesting! Tell me more about that.",
    "I see! Can you elaborate on that?",
    "Hmm, I'm not sure about that, but I'm happy to keep chatting!",
    "That's a great point! What else is on your mind?",
    "Interesting! I'd love to hear more of your thoughts.",
    "I'm still learning, but I appreciate you chatting with me!",
];

// ===== Functions =====

// Get a bot response based on the user's message
function getBotResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();

    // Check each category for keyword matches
    for (const category of Object.values(responses)) {
        for (const keyword of category.keywords) {
            if (lowerMessage.includes(keyword)) {
                const replies = category.replies;
                return replies[Math.floor(Math.random() * replies.length)];
            }
        }
    }

    // No keyword matched, use a default reply
    return defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
}

// Add a message bubble to the chat
function addMessage(text, sender) {
    // Remove welcome message if it exists
    const welcome = chatArea.querySelector('.welcome-message');
    if (welcome) {
        welcome.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);

    const avatar = document.createElement('div');
    avatar.classList.add('avatar');
    avatar.textContent = sender === 'user' ? 'You' : 'AI';

    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.textContent = text;

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(bubble);
    chatArea.appendChild(messageDiv);

    // Scroll to bottom
    chatArea.scrollTop = chatArea.scrollHeight;

    // Save to history
    chatHistory.push({ sender, text });
}

// Show typing indicator
function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('message', 'bot');
    typingDiv.id = 'typingIndicator';

    const avatar = document.createElement('div');
    avatar.classList.add('avatar');
    avatar.textContent = 'AI';

    const bubble = document.createElement('div');
    bubble.classList.add('bubble');

    const dots = document.createElement('div');
    dots.classList.add('typing-indicator');
    dots.innerHTML = '<span></span><span></span><span></span>';

    bubble.appendChild(dots);
    typingDiv.appendChild(avatar);
    typingDiv.appendChild(bubble);
    chatArea.appendChild(typingDiv);

    chatArea.scrollTop = chatArea.scrollHeight;
}

// Remove typing indicator
function removeTyping() {
    const typing = document.getElementById('typingIndicator');
    if (typing) {
        typing.remove();
    }
}

// Handle sending a message
function handleSend(event) {
    event.preventDefault();

    const text = messageInput.value.trim();
    if (!text) return;

    // Add user message
    addMessage(text, 'user');
    messageInput.value = '';

    // Show typing indicator, then respond after a short delay
    showTyping();

    const delay = 500 + Math.random() * 1000; // 0.5 - 1.5 seconds
    setTimeout(() => {
        removeTyping();
        const response = getBotResponse(text);
        addMessage(response, 'bot');
    }, delay);
}

// Toggle dark mode
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');

    if (currentTheme === 'dark') {
        html.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    } else {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
}

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
}

// ===== Event Listeners =====
chatForm.addEventListener('submit', handleSend);
themeToggle.addEventListener('click', toggleTheme);

// Allow pressing Enter to send (already handled by form submit)
// Focus the input on page load
window.addEventListener('load', () => {
    loadTheme();
    messageInput.focus();
});
