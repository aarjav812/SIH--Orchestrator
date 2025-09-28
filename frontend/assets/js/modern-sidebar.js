// Modern Sidebar Component for HRMS
class ModernSidebar {
    constructor(currentPage = '') {
        this.currentPage = currentPage;
        this.isOpen = false;
        this.init();
    }

    init() {
        this.createSidebarHTML();
        this.bindEvents();
        this.loadUserInfo();
    }

    createSidebarHTML() {
        const sidebarContainer = document.getElementById('sidebar');
        if (!sidebarContainer) return;

        sidebarContainer.innerHTML = `
            <div class="sidebar-header">
                <div class="brand">
                    <div class="logo">
                        <i class="fa-solid fa-building-user"></i>
                    </div>
                    <div class="brand-text">
                        <span class="title">HRMS</span>
                        <span class="subtitle">Management</span>
                    </div>
                </div>
            </div>

            <nav class="nav modern-nav">
                ${this.generateNavItems()}
            </nav>

            <div class="sidebar-footer">
                <div class="userbox modern-userbox">
                    <div class="user-avatar">
                        <i class="fa-solid fa-user"></i>
                    </div>
                    <div class="user-details">
                        <div class="user-name">Loading...</div>
                        <div class="user-role">Loading...</div>
                    </div>
                    <div class="user-status">
                        <div class="status-indicator online"></div>
                    </div>
                </div>
                
                <div class="nav-footer">
                    <a href="#" class="logout-btn modern-logout-btn" title="Sign Out">
                        <span class="icon"><i class="fa fa-right-from-bracket"></i></span>
                        <span class="text">Logout</span>
                        <div class="logout-animation"></div>
                    </a>
                </div>
            </div>
        `;
    }

    generateNavItems() {
        const navItems = [
            { href: 'dashboard.html', icon: 'fa-solid fa-house', text: 'Dashboard', key: 'dashboard' },
            { href: 'profile.html', icon: 'fa-solid fa-user', text: 'Profile', key: 'profile' }
        ];

        return navItems.map(item => {
            const isActive = this.currentPage === item.key;
            return `
                <a href="${item.href}" class="nav-item ${isActive ? 'active' : ''}" data-page="${item.key}">
                    <div class="nav-icon">
                        <i class="${item.icon}"></i>
                    </div>
                    <span class="nav-text">${item.text}</span>
                    <div class="nav-indicator"></div>
                    <div class="hover-effect"></div>
                </a>
            `;
        }).join('');
    }

    bindEvents() {
        // Logout functionality
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }

        // Simple nav item interactions
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                if (!item.classList.contains('active')) {
                    item.style.backgroundColor = 'rgba(31, 173, 130, 0.1)';
                }
            });

            item.addEventListener('mouseleave', () => {
                if (!item.classList.contains('active')) {
                    item.style.backgroundColor = '';
                }
            });
        });

    }

    loadUserInfo() {
        // Load user information if Auth is available
        if (typeof Auth !== 'undefined' && Auth.isAuthenticated()) {
            const user = Auth.getUser();
            if (user) {
                const userNameEl = document.querySelector('.user-name');
                const userRoleEl = document.querySelector('.user-role');
                
                if (userNameEl) userNameEl.textContent = user.username || 'User';
                if (userRoleEl) userRoleEl.textContent = user.role || 'Member';
            }
        }
    }

    handleLogout() {
        // Add loading animation to logout button
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.classList.add('loading');
            
            // Simulate logout process
            setTimeout(() => {
                if (typeof Auth !== 'undefined') {
                    Auth.logout();
                }
                window.location.href = 'login.html';
            }, 1000);
        }
    }
}

// Initialize the modern sidebar
document.addEventListener('DOMContentLoaded', () => {
    // Determine current page from URL
    const path = window.location.pathname;
    let currentPage = '';
    
    if (path.includes('dashboard.html')) currentPage = 'dashboard';
    else if (path.includes('profile.html')) currentPage = 'profile';
    
    // Initialize sidebar
    setTimeout(() => {
        window.modernSidebar = new ModernSidebar(currentPage);
        console.log('✨ Modern sidebar initialized');
    }, 100);
});

// Export for use in other modules
window.ModernSidebar = ModernSidebar;