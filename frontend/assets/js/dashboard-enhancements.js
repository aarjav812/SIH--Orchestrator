// Enhanced Page Interactions and Animations for HRMS Dashboard
class DashboardEnhancer {
    constructor() {
        this.initializePageAnimations();
        this.enhanceSidebarInteractions();
        this.addScrollEffects();
        this.initializeKeyboardShortcuts();
        this.addVisualFeedback();
    }

    initializePageAnimations() {
        // Page entrance animation
        document.body.style.opacity = '0';
        document.body.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            document.body.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            document.body.style.opacity = '1';
            document.body.style.transform = 'translateY(0)';
        }, 100);

        // Add staggered animation to main content sections
        const sections = document.querySelectorAll('.main-content > *');
        sections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            setTimeout(() => {
                section.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, 200 + (index * 100));
        });
    }

    enhanceSidebarInteractions() {
        const sidebar = document.getElementById('sidebar');
        const menuBtn = document.getElementById('menuBtn');
        const overlay = document.getElementById('sidebarOverlay');

        if (!sidebar || !menuBtn) return;

        // Enhanced sidebar toggle
        const enhancedToggle = (e) => {
            e.preventDefault();
            sidebar.classList.add('active');
            if (overlay) {
                overlay.hidden = false;
                overlay.style.opacity = '0';
                overlay.style.transition = 'opacity 0.3s ease';
                setTimeout(() => overlay.style.opacity = '1', 10);
            }
        };

        // Remove any existing listeners and add enhanced one
        menuBtn.removeEventListener('click', enhancedToggle);
        menuBtn.addEventListener('click', enhancedToggle);

        // Enhanced close functionality
        const closeBtn = sidebar.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeSidebar();
            });
        }

        // Click overlay to close
        if (overlay) {
            overlay.addEventListener('click', () => {
                this.closeSidebar();
            });
        }

        // Escape key to close sidebar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar.classList.contains('active')) {
                this.closeSidebar();
            }
        });
    }

    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');

        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.hidden = true;
            }, 300);
        }

        sidebar.classList.remove('active');
    }

    addScrollEffects() {
        let ticking = false;

        const updateScrollEffects = () => {
            const scrolled = window.scrollY;
            const menuBtn = document.getElementById('menuBtn');
            
            if (menuBtn) {
                if (scrolled > 100) {
                    menuBtn.style.background = 'linear-gradient(135deg, rgba(14, 26, 47, 0.98), rgba(10, 19, 35, 0.98))';
                    menuBtn.style.backdropFilter = 'blur(20px)';
                } else {
                    menuBtn.style.background = 'linear-gradient(135deg, rgba(14, 26, 47, 0.95), rgba(10, 19, 35, 0.95))';
                    menuBtn.style.backdropFilter = 'blur(12px)';
                }
            }
            ticking = false;
        };

        const requestScrollUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    }

    initializeKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + M to toggle sidebar
            if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
                e.preventDefault();
                const sidebar = document.getElementById('sidebar');
                const menuBtn = document.getElementById('menuBtn');
                
                if (sidebar && sidebar.classList.contains('active')) {
                    this.closeSidebar();
                } else if (menuBtn) {
                    menuBtn.click();
                }
            }

            // Ctrl/Cmd + K for quick actions
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector('[data-search-input]');
                if (searchInput) {
                    searchInput.focus();
                }
            }
        });
    }

    addVisualFeedback() {
        // Add ripple effect to clickable elements
        const clickableElements = document.querySelectorAll('button, .btn, .project-card, .nav a');
        
        clickableElements.forEach(element => {
            element.addEventListener('click', function(e) {
                // Skip if already has loading animation
                if (this.classList.contains('project-card') && this.querySelector('.card-loading-overlay')) {
                    return;
                }

                const ripple = document.createElement('div');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: rippleEffect 0.6s linear;
                    pointer-events: none;
                    z-index: 1;
                `;
                
                // Ensure element has relative positioning for ripple
                const computedStyle = getComputedStyle(this);
                if (computedStyle.position === 'static') {
                    this.style.position = 'relative';
                }
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    if (ripple.parentNode) {
                        ripple.remove();
                    }
                }, 600);
            });
        });

        // Add ripple animation CSS if not exists
        this.addRippleStyles();
    }

    addRippleStyles() {
        if (document.querySelector('#enhanced-ripple-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'enhanced-ripple-styles';
        style.textContent = `
            @keyframes rippleEffect {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            /* Enhanced focus styles */
            .focus-visible {
                outline: 2px solid rgba(31,173,130,0.5) !important;
                outline-offset: 2px !important;
            }
            
            /* Smooth page transitions */
            .page-transition-enter {
                opacity: 0;
                transform: translateY(20px);
            }
            
            .page-transition-enter-active {
                opacity: 1;
                transform: translateY(0);
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
        `;
        document.head.appendChild(style);
    }

    // Add enhanced hover effects for nav items
    enhanceNavigation() {
        const navLinks = document.querySelectorAll('.nav a');
        
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                if (!this.classList.contains('active')) {
                    this.style.transform = 'translateX(8px)';
                    this.style.background = 'rgba(31,173,130,0.08)';
                }
            });
            
            link.addEventListener('mouseleave', function() {
                if (!this.classList.contains('active')) {
                    this.style.transform = 'translateX(0)';
                    this.style.background = 'rgba(255,255,255,0.03)';
                }
            });
        });
    }
}

// Initialize enhanced interactions
let dashboardEnhancer;

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        dashboardEnhancer = new DashboardEnhancer();
        console.log('✨ Dashboard enhancements loaded successfully');
    }, 300); // Wait for initial page load
});

// Enhanced focus management
document.addEventListener('focusin', (e) => {
    if (e.target.matches('button, input, select, textarea, [tabindex], a')) {
        e.target.classList.add('focus-visible');
    }
});

document.addEventListener('focusout', (e) => {
    e.target.classList.remove('focus-visible');
});

// Export for use in other modules if needed
window.DashboardEnhancer = DashboardEnhancer;