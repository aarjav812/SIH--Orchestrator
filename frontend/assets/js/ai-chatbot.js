// Universal AI Chatbot Component
class AIChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.init();
    }

    init() {
        this.createChatbotHTML();
        this.bindEvents();
        console.log('🤖 AI Chatbot initialized');
    }

    createChatbotHTML() {
        // Check if chatbot already exists
        if (document.getElementById('aiChatbot')) return;

        const chatbotHTML = `
            <div id="aiChatbot" class="ai-chatbot-widget">
                <button id="aiChatbotToggle" class="ai-chatbot-toggle" title="AI Assistant">
                    <i class="fas fa-robot"></i>
                </button>
                
                <div id="aiChatbotPanel" class="ai-chatbot-panel" style="display: none;">
                    <div class="ai-chatbot-header">
                        <div class="ai-chatbot-title">
                            <i class="fas fa-robot"></i>
                            <span>AI Assistant</span>
                        </div>
                        <button id="aiChatbotClose" class="ai-chatbot-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="ai-chatbot-messages" id="aiChatbotMessages">
                        <div class="ai-message">
                            <div class="message-avatar">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div class="message-content">
                                <p>Hello! I'm your AI assistant. How can I help you today?</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="ai-chatbot-input">
                        <input type="text" id="aiChatbotInput" placeholder="Ask me anything..." maxlength="500">
                        <button id="aiChatbotSend" class="ai-chatbot-send">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Create styles
        const styles = `
            <style id="aiChatbotStyles">
                .ai-chatbot-widget {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 10000;
                    font-family: 'Montserrat', system-ui, sans-serif;
                }

                .ai-chatbot-toggle {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #1fad82, #16a574);
                    border: none;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                    box-shadow: 0 8px 24px rgba(31, 173, 130, 0.3);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    backdrop-filter: blur(8px);
                }

                .ai-chatbot-toggle:hover {
                    transform: translateY(-2px) scale(1.05);
                    box-shadow: 0 12px 32px rgba(31, 173, 130, 0.4);
                    background: linear-gradient(135deg, #16a574, #14a568);
                }

                .ai-chatbot-toggle:active {
                    transform: translateY(0) scale(0.95);
                }

                .ai-chatbot-panel {
                    position: absolute;
                    bottom: 80px;
                    right: 0;
                    width: 350px;
                    height: 500px;
                    background: linear-gradient(135deg, rgba(17, 24, 39, 0.98), rgba(15, 23, 42, 0.98));
                    border: 1px solid rgba(31, 173, 130, 0.2);
                    border-radius: 16px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(20px);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    animation: slideUp 0.3s ease-out;
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px) scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                .ai-chatbot-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 1.25rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    background: linear-gradient(135deg, rgba(31, 173, 130, 0.1), rgba(22, 165, 116, 0.05));
                }

                .ai-chatbot-title {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #f8fafc;
                    font-weight: 600;
                    font-size: 1rem;
                }

                .ai-chatbot-title i {
                    color: #1fad82;
                    font-size: 1.1rem;
                }

                .ai-chatbot-close {
                    background: none;
                    border: none;
                    color: #94a3b8;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 6px;
                    transition: all 0.2s ease;
                }

                .ai-chatbot-close:hover {
                    color: #f8fafc;
                    background: rgba(255, 255, 255, 0.1);
                }

                .ai-chatbot-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    scrollbar-width: thin;
                    scrollbar-color: rgba(31, 173, 130, 0.3) transparent;
                }

                .ai-chatbot-messages::-webkit-scrollbar {
                    width: 4px;
                }

                .ai-chatbot-messages::-webkit-scrollbar-thumb {
                    background: rgba(31, 173, 130, 0.3);
                    border-radius: 2px;
                }

                .ai-message, .user-message {
                    display: flex;
                    gap: 0.75rem;
                    align-items: flex-start;
                }

                .user-message {
                    flex-direction: row-reverse;
                }

                .message-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.9rem;
                    flex-shrink: 0;
                }

                .ai-message .message-avatar {
                    background: linear-gradient(135deg, #1fad82, #16a574);
                    color: white;
                }

                .user-message .message-avatar {
                    background: linear-gradient(135deg, #3b82f6, #2563eb);
                    color: white;
                }

                .message-content {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 0.75rem 1rem;
                    border-radius: 12px;
                    max-width: 250px;
                    word-wrap: break-word;
                }

                .user-message .message-content {
                    background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.1));
                    border: 1px solid rgba(59, 130, 246, 0.2);
                }

                .message-content p {
                    margin: 0;
                    color: #e2e8f0;
                    font-size: 0.9rem;
                    line-height: 1.4;
                }

                .ai-chatbot-input {
                    display: flex;
                    gap: 0.5rem;
                    padding: 1rem 1.25rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    background: rgba(255, 255, 255, 0.02);
                }

                .ai-chatbot-input input {
                    flex: 1;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    padding: 0.75rem 1rem;
                    color: #f8fafc;
                    font-size: 0.9rem;
                    outline: none;
                    transition: all 0.2s ease;
                }

                .ai-chatbot-input input:focus {
                    border-color: #1fad82;
                    box-shadow: 0 0 0 3px rgba(31, 173, 130, 0.1);
                }

                .ai-chatbot-input input::placeholder {
                    color: #64748b;
                }

                .ai-chatbot-send {
                    background: linear-gradient(135deg, #1fad82, #16a574);
                    border: none;
                    border-radius: 8px;
                    color: white;
                    padding: 0.75rem 1rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .ai-chatbot-send:hover {
                    background: linear-gradient(135deg, #16a574, #14a568);
                    transform: translateY(-1px);
                }

                .ai-chatbot-send:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }

                /* Mobile responsive */
                @media (max-width: 768px) {
                    .ai-chatbot-panel {
                        width: calc(100vw - 40px);
                        max-width: 350px;
                        right: -10px;
                    }
                    
                    .ai-chatbot-widget {
                        right: 15px;
                        bottom: 15px;
                    }
                    
                    .ai-chatbot-toggle {
                        width: 55px;
                        height: 55px;
                        font-size: 22px;
                    }
                }
            </style>
        `;

        // Add styles to head
        document.head.insertAdjacentHTML('beforeend', styles);
        
        // Add chatbot to body
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    bindEvents() {
        const toggle = document.getElementById('aiChatbotToggle');
        const close = document.getElementById('aiChatbotClose');
        const panel = document.getElementById('aiChatbotPanel');
        const input = document.getElementById('aiChatbotInput');
        const send = document.getElementById('aiChatbotSend');

        if (toggle) {
            toggle.addEventListener('click', () => this.togglePanel());
        }

        if (close) {
            close.addEventListener('click', () => this.closePanel());
        }

        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }

        if (send) {
            send.addEventListener('click', () => this.sendMessage());
        }

        // Close on outside click
        document.addEventListener('click', (e) => {
            const widget = document.getElementById('aiChatbot');
            if (widget && !widget.contains(e.target) && this.isOpen) {
                this.closePanel();
            }
        });
    }

    togglePanel() {
        if (this.isOpen) {
            this.closePanel();
        } else {
            this.openPanel();
        }
    }

    openPanel() {
        const panel = document.getElementById('aiChatbotPanel');
        const toggle = document.getElementById('aiChatbotToggle');
        
        if (panel && toggle) {
            panel.style.display = 'flex';
            this.isOpen = true;
            toggle.style.transform = 'rotate(180deg)';
            
            // Focus input
            const input = document.getElementById('aiChatbotInput');
            if (input) {
                setTimeout(() => input.focus(), 100);
            }
        }
    }

    closePanel() {
        const panel = document.getElementById('aiChatbotPanel');
        const toggle = document.getElementById('aiChatbotToggle');
        
        if (panel && toggle) {
            panel.style.display = 'none';
            this.isOpen = false;
            toggle.style.transform = 'rotate(0deg)';
        }
    }

    async sendMessage() {
        const input = document.getElementById('aiChatbotInput');
        const messagesContainer = document.getElementById('aiChatbotMessages');
        const sendBtn = document.getElementById('aiChatbotSend');
        
        if (!input || !messagesContainer) return;
        
        const message = input.value.trim();
        if (!message) return;
        
        // Add user message
        this.addMessage(message, 'user');
        input.value = '';
        
        // Disable send button
        if (sendBtn) sendBtn.disabled = true;
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Simulate AI response (replace with actual API call)
            await this.simulateAIResponse(message);
        } catch (error) {
            this.addMessage('Sorry, I encountered an error. Please try again.', 'ai');
        } finally {
            // Re-enable send button
            if (sendBtn) sendBtn.disabled = false;
            this.hideTypingIndicator();
        }
    }

    addMessage(text, sender = 'ai') {
        const messagesContainer = document.getElementById('aiChatbotMessages');
        if (!messagesContainer) return;
        
        const messageHTML = `
            <div class="${sender}-message">
                <div class="message-avatar">
                    <i class="fas ${sender === 'ai' ? 'fa-robot' : 'fa-user'}"></i>
                </div>
                <div class="message-content">
                    <p>${text}</p>
                </div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('aiChatbotMessages');
        if (!messagesContainer) return;
        
        const typingHTML = `
            <div class="ai-message typing-indicator" id="typingIndicator">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <p>Thinking...</p>
                </div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }

    async simulateAIResponse(userMessage) {
        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        // Simple response logic (replace with actual AI API)
        let response = "I understand you said: " + userMessage + ". How can I help you further?";
        
        // Add some basic responses
        const lowerMessage = userMessage.toLowerCase();
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            response = "Hello! I'm here to help you with your HRMS tasks. What would you like to know?";
        } else if (lowerMessage.includes('project')) {
            response = "I can help you with project management tasks. You can create projects, join teams, or analyze project data. What specific help do you need?";
        } else if (lowerMessage.includes('help')) {
            response = "I'm your AI assistant for the HRMS system. I can help with projects, team management, profile settings, and general navigation. What would you like assistance with?";
        } else if (lowerMessage.includes('thank')) {
            response = "You're welcome! I'm always here to help. Feel free to ask me anything else!";
        }
        
        this.addMessage(response, 'ai');
    }
}

// Initialize AI Chatbot globally
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure page is fully loaded
    setTimeout(() => {
        if (!window.aiChatbot) {
            window.aiChatbot = new AIChatbot();
        }
    }, 500);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIChatbot;
}