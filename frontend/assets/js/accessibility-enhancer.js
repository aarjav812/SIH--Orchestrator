// Advanced Accessibility & Performance Enhancements
class AccessibilityEnhancer {
    constructor() {
        this.keyboardNavigation = true;
        this.focusTrapping = new Map();
        this.announcements = [];
        this.init();
    }

    init() {
        this.enhanceKeyboardNavigation();
        this.addFocusManagement();
        this.createLiveRegion();
        this.enhanceFormAccessibility();
        this.addSkipLinks();
        this.improveContrastRatios();
        this.addKeyboardShortcuts();
        this.setupPerformanceOptimizations();
    }

    // Enhanced Keyboard Navigation
    enhanceKeyboardNavigation() {
        // Improve focus indicators
        const style = document.createElement('style');
        style.textContent = `
            /* Enhanced focus indicators */
            *:focus-visible {
                outline: 2px solid var(--primary) !important;
                outline-offset: 2px !important;
                box-shadow: 0 0 0 4px rgba(31, 173, 130, 0.2) !important;
                border-radius: 4px !important;
            }

            /* Skip link */
            .skip-link {
                position: absolute;
                top: -40px;
                left: 6px;
                background: var(--primary);
                color: white;
                padding: 8px;
                text-decoration: none;
                border-radius: 4px;
                z-index: 10000;
                font-weight: bold;
                transition: top 0.3s;
            }

            .skip-link:focus {
                top: 6px;
            }

            /* Keyboard navigation helpers */
            .keyboard-nav .sidebar .nav-item:focus,
            .keyboard-nav .sidebar .nav-item:hover {
                background: rgba(31, 173, 130, 0.2);
                outline: 2px solid var(--primary);
                outline-offset: 2px;
            }

            /* High contrast mode support */
            @media (prefers-contrast: high) {
                .widget, .glass-card, .card {
                    border: 2px solid var(--primary) !important;
                }
                
                .btn, button {
                    border: 2px solid currentColor !important;
                }
            }

            /* Reduced motion support */
            @media (prefers-reduced-motion: reduce) {
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                    scroll-behavior: auto !important;
                }
            }

            /* Focus within improvements */
            .widget:focus-within,
            .card:focus-within {
                border-color: var(--primary);
                box-shadow: 0 0 0 3px rgba(31, 173, 130, 0.2);
            }
        `;
        document.head.appendChild(style);

        // Add keyboard event handlers
        document.addEventListener('keydown', this.handleKeyboardNavigation.bind(this));
        
        // Detect keyboard usage
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav');
        });
    }

    handleKeyboardNavigation(e) {
        // Escape key handling
        if (e.key === 'Escape') {
            this.handleEscape();
            return;
        }

        // Custom keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'k':
                    e.preventDefault();
                    this.toggleCommandPalette();
                    break;
                case '/':
                    e.preventDefault();
                    this.focusSearch();
                    break;
                case 'b':
                    e.preventDefault();
                    this.toggleSidebar();
                    break;
            }
        }

        // Arrow key navigation for widgets
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            this.handleArrowKeyNavigation(e);
        }
    }

    handleEscape() {
        // Close modals
        const modals = document.querySelectorAll('.modal.show, .theme-selector.show');
        modals.forEach(modal => {
            modal.classList.remove('show');
        });

        // Close sidebar on mobile
        if (window.innerWidth <= 768) {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebarOverlay');
            if (sidebar && overlay && !overlay.hidden) {
                sidebar.classList.remove('show');
                overlay.hidden = true;
            }
        }

        // Return focus to appropriate element
        const focusableElement = document.querySelector('[data-return-focus]');
        if (focusableElement) {
            focusableElement.focus();
            focusableElement.removeAttribute('data-return-focus');
        }
    }

    // Focus Management
    addFocusManagement() {
        // Trap focus in modals
        document.addEventListener('focusin', (e) => {
            const modal = e.target.closest('.modal, .theme-selector');
            if (modal && modal.classList.contains('show')) {
                this.trapFocus(modal, e);
            }
        });
    }

    trapFocus(container, e) {
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // If trying to tab out of the last element, focus the first
        if (e.target === lastElement && e.key === 'Tab' && !e.shiftKey) {
            e.preventDefault();
            firstElement.focus();
        }
        
        // If trying to shift+tab out of the first element, focus the last
        if (e.target === firstElement && e.key === 'Tab' && e.shiftKey) {
            e.preventDefault();
            lastElement.focus();
        }
    }

    // Live Region for Screen Readers
    createLiveRegion() {
        const liveRegion = document.createElement('div');
        liveRegion.id = 'live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        document.body.appendChild(liveRegion);

        // Override notification system to announce to screen readers
        const originalShowNotification = window.showNotification;
        if (originalShowNotification) {
            window.showNotification = (title, message, type, duration) => {
                // Call original function
                originalShowNotification(title, message, type, duration);
                
                // Announce to screen readers
                this.announce(`${title}: ${message}`);
            };
        }
    }

    announce(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            // Clear after a delay to allow for repeated announcements
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    // Form Accessibility Enhancements
    enhanceFormAccessibility() {
        // Add proper labels and descriptions
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            // Add aria-label if missing label
            if (!input.labels || input.labels.length === 0) {
                const placeholder = input.getAttribute('placeholder');
                const name = input.getAttribute('name');
                if (placeholder) {
                    input.setAttribute('aria-label', placeholder);
                } else if (name) {
                    input.setAttribute('aria-label', this.humanize(name));
                }
            }

            // Add required attribute announcement
            if (input.hasAttribute('required')) {
                const label = input.labels && input.labels[0];
                if (label && !label.textContent.includes('*')) {
                    label.innerHTML += ' <span aria-label="required">*</span>';
                }
                input.setAttribute('aria-required', 'true');
            }

            // Add validation messages
            input.addEventListener('invalid', (e) => {
                const errorId = input.id + '-error';
                let errorElement = document.getElementById(errorId);
                
                if (!errorElement) {
                    errorElement = document.createElement('div');
                    errorElement.id = errorId;
                    errorElement.className = 'error-message';
                    errorElement.style.cssText = `
                        color: #ef4444;
                        font-size: 0.85rem;
                        margin-top: 0.25rem;
                        display: block;
                    `;
                    input.parentNode.insertBefore(errorElement, input.nextSibling);
                }
                
                errorElement.textContent = input.validationMessage;
                input.setAttribute('aria-describedby', errorId);
                input.setAttribute('aria-invalid', 'true');
                
                this.announce(`Validation error: ${input.validationMessage}`);
            });

            input.addEventListener('input', () => {
                if (input.checkValidity()) {
                    input.removeAttribute('aria-invalid');
                    const errorElement = document.getElementById(input.id + '-error');
                    if (errorElement) {
                        errorElement.remove();
                    }
                }
            });
        });
    }

    // Skip Links
    addSkipLinks() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            const mainContent = document.querySelector('.main-content, main, #main-content');
            if (mainContent) {
                mainContent.focus();
                mainContent.scrollIntoView({ behavior: 'smooth' });
            }
        });

        document.body.insertBefore(skipLink, document.body.firstChild);

        // Ensure main content is focusable
        const mainContent = document.querySelector('.main-content, main');
        if (mainContent && !mainContent.hasAttribute('tabindex')) {
            mainContent.setAttribute('tabindex', '-1');
            mainContent.id = mainContent.id || 'main-content';
        }
    }

    // Contrast and Visual Enhancements
    improveContrastRatios() {
        // Check for and improve low contrast elements
        const style = document.createElement('style');
        style.textContent = `
            /* Improved contrast for better accessibility */
            .text-secondary, .metric-label, small {
                color: #cbd5e1 !important;
            }

            .widget-btn:hover, .theme-close-btn:hover {
                background: rgba(255, 255, 255, 0.15) !important;
            }

            /* Better button contrast */
            .btn:disabled, button:disabled {
                opacity: 0.6;
                background: #6b7280 !important;
                color: #f8fafc !important;
            }

            /* Loading state improvements */
            .loading-skeleton {
                background: linear-gradient(90deg, 
                    rgba(255,255,255,0.08) 25%, 
                    rgba(255,255,255,0.15) 50%, 
                    rgba(255,255,255,0.08) 75%
                );
            }

            /* Focus improvements for interactive elements */
            .nav-item:focus-visible,
            .widget:focus-visible,
            .card:focus-visible {
                outline: 2px solid var(--primary);
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);
    }

    // Global Keyboard Shortcuts
    addKeyboardShortcuts() {
        // Create keyboard shortcuts help
        const helpButton = document.createElement('button');
        helpButton.innerHTML = '<i class="fas fa-keyboard"></i>';
        helpButton.className = 'keyboard-help-btn';
        helpButton.style.cssText = `
            position: fixed;
            bottom: 2rem;
            left: 2rem;
            width: 48px;
            height: 48px;
            border: none;
            border-radius: 50%;
            background: rgba(30, 41, 59, 0.9);
            color: var(--primary);
            cursor: pointer;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 16px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            z-index: 999;
            font-size: 1.1rem;
        `;

        helpButton.addEventListener('click', this.showKeyboardHelp.bind(this));
        helpButton.addEventListener('mouseenter', () => {
            helpButton.style.transform = 'scale(1.1)';
            helpButton.style.boxShadow = '0 6px 24px rgba(0,0,0,0.4)';
        });
        helpButton.addEventListener('mouseleave', () => {
            helpButton.style.transform = 'scale(1)';
            helpButton.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)';
        });

        document.body.appendChild(helpButton);
    }

    showKeyboardHelp() {
        const helpModal = document.createElement('div');
        helpModal.className = 'keyboard-help-modal';
        helpModal.innerHTML = `
            <div class="help-content">
                <h3>Keyboard Shortcuts</h3>
                <div class="shortcuts-grid">
                    <div class="shortcut-item">
                        <kbd>Ctrl/Cmd</kbd> + <kbd>K</kbd>
                        <span>Command Palette</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Ctrl/Cmd</kbd> + <kbd>B</kbd>
                        <span>Toggle Sidebar</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Ctrl/Cmd</kbd> + <kbd>/</kbd>
                        <span>Focus Search</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Esc</kbd>
                        <span>Close Modal/Menu</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Tab</kbd>
                        <span>Navigate Elements</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Space/Enter</kbd>
                        <span>Activate Button</span>
                    </div>
                </div>
                <button class="close-help">Close</button>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            .keyboard-help-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                backdrop-filter: blur(8px);
            }

            .help-content {
                background: rgba(17,24,39,0.95);
                border-radius: 16px;
                padding: 2rem;
                max-width: 500px;
                width: 90%;
                border: 1px solid rgba(255,255,255,0.1);
            }

            .help-content h3 {
                color: #f8fafc;
                margin: 0 0 1.5rem 0;
                text-align: center;
            }

            .shortcuts-grid {
                display: grid;
                gap: 1rem;
                margin-bottom: 2rem;
            }

            .shortcut-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.75rem;
                background: rgba(255,255,255,0.05);
                border-radius: 8px;
            }

            .shortcut-item kbd {
                background: rgba(255,255,255,0.1);
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                font-size: 0.8rem;
                color: #f8fafc;
                margin: 0 0.25rem;
            }

            .shortcut-item span {
                color: #cbd5e1;
                font-size: 0.9rem;
            }

            .close-help {
                width: 100%;
                padding: 0.75rem;
                background: var(--primary);
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.2s ease;
            }

            .close-help:hover {
                background: var(--accent);
                transform: translateY(-1px);
            }
        `;
        
        helpModal.appendChild(style);
        document.body.appendChild(helpModal);

        // Close handlers
        const closeBtn = helpModal.querySelector('.close-help');
        closeBtn.addEventListener('click', () => helpModal.remove());
        
        helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal) helpModal.remove();
        });

        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                helpModal.remove();
                document.removeEventListener('keydown', escHandler);
            }
        });

        // Focus close button
        closeBtn.focus();
    }

    // Performance Optimizations
    setupPerformanceOptimizations() {
        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe widgets and cards for animation
        const animateElements = document.querySelectorAll('.widget, .glass-card, .card');
        animateElements.forEach(el => observer.observe(el));

        // Add animation styles
        const animationStyle = document.createElement('style');
        animationStyle.textContent = `
            .widget, .glass-card, .card {
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }

            /* Respect reduced motion preferences */
            @media (prefers-reduced-motion: reduce) {
                .widget, .glass-card, .card {
                    opacity: 1;
                    transform: none;
                    transition: none;
                }
            }
        `;
        document.head.appendChild(animationStyle);

        // Debounced resize handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                window.dispatchEvent(new CustomEvent('debouncedResize'));
            }, 250);
        });
    }

    // Utility functions
    humanize(str) {
        return str.replace(/[_-]/g, ' ')
                 .replace(/([a-z])([A-Z])/g, '$1 $2')
                 .toLowerCase()
                 .split(' ')
                 .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                 .join(' ');
    }

    toggleCommandPalette() {
        this.announce('Command palette feature coming soon');
        if (window.showNotification) {
            window.showNotification(
                'Coming Soon',
                'Command palette will be available in the next update',
                'info',
                3000
            );
        }
    }

    focusSearch() {
        const searchInput = document.querySelector('input[type="search"], input[placeholder*="search" i]');
        if (searchInput) {
            searchInput.focus();
            this.announce('Search focused');
        } else {
            this.announce('No search field found on this page');
        }
    }

    toggleSidebar() {
        const menuBtn = document.getElementById('menuBtn');
        if (menuBtn) {
            menuBtn.click();
            this.announce('Sidebar toggled');
        }
    }

    handleArrowKeyNavigation(e) {
        const focusedElement = document.activeElement;
        const widgets = Array.from(document.querySelectorAll('.widget'));
        const currentIndex = widgets.indexOf(focusedElement.closest('.widget'));
        
        if (currentIndex === -1) return;

        let nextIndex;
        switch (e.key) {
            case 'ArrowUp':
            case 'ArrowLeft':
                e.preventDefault();
                nextIndex = currentIndex > 0 ? currentIndex - 1 : widgets.length - 1;
                break;
            case 'ArrowDown':
            case 'ArrowRight':
                e.preventDefault();
                nextIndex = currentIndex < widgets.length - 1 ? currentIndex + 1 : 0;
                break;
        }

        if (nextIndex !== undefined && widgets[nextIndex]) {
            widgets[nextIndex].focus();
            widgets[nextIndex].scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
    }
}

// Initialize accessibility enhancements
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.accessibilityEnhancer = new AccessibilityEnhancer();
        console.log('♿ Advanced accessibility enhancements loaded');
    }, 1200);
});

// Export for use in other modules
window.AccessibilityEnhancer = AccessibilityEnhancer;