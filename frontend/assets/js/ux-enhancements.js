// Lightweight UX Enhancements for HRMS
class UXEnhancer {
    constructor() {
        this.notifications = [];
        this.init();
    }

    init() {
        this.createNotificationContainer();
        this.addSimplePageTransitions();
        this.enhanceButtonInteractions();
    }

    // Advanced Notification System
    createNotificationContainer() {
        if (document.getElementById('notification-container')) return;

        const container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'notification-container';
        container.innerHTML = `
            <style>
                .notification-container {
                    position: fixed;
                    top: 2rem;
                    right: 2rem;
                    z-index: 10000;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    pointer-events: none;
                }
                
                .notification {
                    background: linear-gradient(135deg, 
                        rgba(17,24,39,0.98), 
                        rgba(15,23,42,0.98)
                    );
                    border-left: 4px solid var(--primary, #1fad82);
                    border-radius: 12px;
                    padding: 1rem 1.25rem;
                    box-shadow: 
                        0 8px 32px rgba(0,0,0,0.6),
                        0 2px 16px rgba(31,173,130,0.2);
                    backdrop-filter: blur(16px);
                    min-width: 320px;
                    max-width: 400px;
                    pointer-events: auto;
                    transform: translateX(100%);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }
                
                .notification.show {
                    transform: translateX(0);
                }
                
                .notification.success {
                    border-left-color: #22c55e;
                }
                
                .notification.error {
                    border-left-color: #ef4444;
                }
                
                .notification.warning {
                    border-left-color: #f59e0b;
                }
                
                .notification.info {
                    border-left-color: #3b82f6;
                }
                
                .notification-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 0.5rem;
                }
                
                .notification-title {
                    font-weight: 600;
                    color: #f8fafc;
                    font-size: 0.9rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: #94a3b8;
                    cursor: pointer;
                    padding: 0.25rem;
                    border-radius: 4px;
                    transition: all 0.2s ease;
                }
                
                .notification-close:hover {
                    color: #f8fafc;
                    background: rgba(255,255,255,0.1);
                }
                
                .notification-message {
                    color: #cbd5e1;
                    font-size: 0.85rem;
                    line-height: 1.5;
                }
                
                .notification-progress {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    height: 2px;
                    background: var(--primary, #1fad82);
                    transition: width 0.1s linear;
                }
            </style>
        `;
        document.body.appendChild(container);
    }

    showNotification(title, message, type = 'info', duration = 5000) {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-header">
                <div class="notification-title">
                    <i class="fas ${icons[type]}"></i>
                    ${title}
                </div>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="notification-message">${message}</div>
            <div class="notification-progress"></div>
        `;

        container.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);

        // Progress bar animation
        const progressBar = notification.querySelector('.notification-progress');
        let progress = 100;
        const interval = setInterval(() => {
            progress -= 100 / (duration / 100);
            progressBar.style.width = `${Math.max(0, progress)}%`;
            if (progress <= 0) {
                clearInterval(interval);
                this.removeNotification(notification);
            }
        }, 100);

        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearInterval(interval);
            this.removeNotification(notification);
        });

        // Store reference
        this.notifications.push({ element: notification, interval });
    }

    removeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 400);
    }

    // Simple Page Transitions
    addSimplePageTransitions() {
        // Add simple entrance animation to main content
        const mainContent = document.querySelector('.main-content, .center');
        if (mainContent && !mainContent.classList.contains('animated')) {
            mainContent.classList.add('animated');
            mainContent.style.opacity = '0';
            
            setTimeout(() => {
                mainContent.style.transition = 'opacity 0.3s ease';
                mainContent.style.opacity = '1';
            }, 100);
        }
    }

    // Simple Button Interactions
    enhanceButtonInteractions() {
        const buttons = document.querySelectorAll('button:not(.enhanced), .btn:not(.enhanced)');
        
        buttons.forEach(button => {
            button.classList.add('enhanced');
            
            // Simple hover effect
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-1px)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
            });
        });
    }


}

// Global notification function for easy access
window.showNotification = function(title, message, type = 'info', duration = 5000) {
    if (window.uxEnhancer) {
        window.uxEnhancer.showNotification(title, message, type, duration);
    }
};

// Initialize lightweight UX enhancements
document.addEventListener('DOMContentLoaded', () => {
    window.uxEnhancer = new UXEnhancer();
    console.log('✨ Lightweight UX enhancements loaded');
});

// Add minimal CSS for performance
const lightCSS = document.createElement('style');
lightCSS.textContent = `
    /* Simple transitions for buttons */
    button, .btn {
        transition: transform 0.2s ease !important;
    }
    
    /* Basic focus states */
    *:focus-visible {
        outline: 2px solid rgba(31,173,130,0.6) !important;
        outline-offset: 2px !important;
    }
`;

document.head.appendChild(lightCSS);

// Export for use in other modules
window.UXEnhancer = UXEnhancer;