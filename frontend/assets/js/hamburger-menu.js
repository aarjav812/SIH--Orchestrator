// Universal Hamburger Menu Handler
class HamburgerMenu {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        this.bindEvents();
        console.log('🍔 Hamburger menu initialized');
    }

    bindEvents() {
        // Wait for DOM to be ready
        document.addEventListener('DOMContentLoaded', () => {
            this.setupMenuButton();
        });

        // Also setup immediately if DOM is already loaded
        if (document.readyState !== 'loading') {
            this.setupMenuButton();
        }
    }

    setupMenuButton() {
        const menuBtn = document.getElementById('menuBtn');
        if (menuBtn) {
            // Remove any existing listeners to avoid duplicates
            const newMenuBtn = menuBtn.cloneNode(true);
            menuBtn.parentNode.replaceChild(newMenuBtn, menuBtn);

            // Add the click event listener
            newMenuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggle();
            });

            console.log('✅ Menu button event listener attached');
        } else {
            console.warn('⚠️ Menu button not found');
        }

        // Setup overlay click to close
        const overlay = document.getElementById('sidebarOverlay');
        if (overlay) {
            overlay.addEventListener('click', () => {
                this.close();
            });
        }

        // Setup escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        const menuBtn = document.getElementById('menuBtn');

        if (sidebar) {
            sidebar.classList.add('active');
            this.isOpen = true;

            // Transform hamburger to X
            if (menuBtn) {
                menuBtn.classList.add('active');
                // Update icon to X
                const icon = menuBtn.querySelector('i');
                if (icon) {
                    icon.className = 'fa fa-times';
                }
            }

            // Show overlay
            if (overlay) {
                overlay.hidden = false;
                overlay.style.opacity = '1';
            }

            console.log('📂 Sidebar opened');
        }
    }

    close() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        const menuBtn = document.getElementById('menuBtn');

        if (sidebar) {
            sidebar.classList.remove('active');
            this.isOpen = false;

            // Transform X back to hamburger
            if (menuBtn) {
                menuBtn.classList.remove('active');
                // Update icon back to hamburger
                const icon = menuBtn.querySelector('i');
                if (icon) {
                    icon.className = 'fa fa-bars';
                }
            }

            // Hide overlay
            if (overlay) {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.hidden = true;
                }, 300);
            }

            console.log('📁 Sidebar closed');
        }
    }
}

// Initialize hamburger menu globally
window.hamburgerMenu = new HamburgerMenu();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HamburgerMenu;
}