// Advanced Page Transitions & Loading System
class PageTransitionManager {
    constructor() {
        this.isTransitioning = false;
        this.loadingOverlay = null;
        this.init();
    }

    init() {
        this.createLoadingOverlay();
        this.interceptNavigation();
        this.addPageLoadAnimations();
        this.setupProgressIndicators();
        this.addConnectionMonitoring();
    }

    createLoadingOverlay() {
        this.loadingOverlay = document.createElement('div');
        this.loadingOverlay.id = 'page-loading-overlay';
        this.loadingOverlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-logo">
                    <div class="pulse-ring"></div>
                    <div class="pulse-ring"></div>
                    <div class="pulse-ring"></div>
                    <i class="fas fa-briefcase"></i>
                </div>
                <div class="loading-text">
                    <h3 id="loading-title">Loading...</h3>
                    <p id="loading-subtitle">Please wait while we prepare your workspace</p>
                </div>
                <div class="loading-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" id="progress-fill"></div>
                    </div>
                    <div class="progress-text">
                        <span id="progress-percentage">0%</span>
                        <span id="progress-status">Initializing...</span>
                    </div>
                </div>
            </div>

            <style>
                #page-loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, 
                        rgba(15, 23, 42, 0.98), 
                        rgba(17, 24, 39, 0.98)
                    );
                    backdrop-filter: blur(20px);
                    z-index: 99999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }

                #page-loading-overlay.show {
                    opacity: 1;
                    visibility: visible;
                }

                .loading-content {
                    text-align: center;
                    max-width: 400px;
                    padding: 2rem;
                }

                .loading-logo {
                    position: relative;
                    display: inline-block;
                    margin-bottom: 2rem;
                }

                .loading-logo i {
                    font-size: 3rem;
                    color: var(--primary);
                    z-index: 2;
                    position: relative;
                    animation: float 3s ease-in-out infinite;
                }

                .pulse-ring {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 80px;
                    height: 80px;
                    border: 2px solid var(--primary);
                    border-radius: 50%;
                    opacity: 0;
                    animation: pulse-ring 2s ease-out infinite;
                }

                .pulse-ring:nth-child(2) {
                    animation-delay: 0.5s;
                }

                .pulse-ring:nth-child(3) {
                    animation-delay: 1s;
                }

                @keyframes pulse-ring {
                    0% {
                        transform: translate(-50%, -50%) scale(0.8);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(2);
                        opacity: 0;
                    }
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }

                .loading-text h3 {
                    color: #f8fafc;
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin: 0 0 0.5rem 0;
                    animation: fadeInUp 0.6s ease-out;
                }

                .loading-text p {
                    color: #cbd5e1;
                    font-size: 0.9rem;
                    margin: 0 0 2rem 0;
                    animation: fadeInUp 0.6s ease-out 0.2s both;
                }

                .loading-progress {
                    animation: fadeInUp 0.6s ease-out 0.4s both;
                }

                .progress-bar {
                    width: 100%;
                    height: 4px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 2px;
                    overflow: hidden;
                    margin-bottom: 1rem;
                }

                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, var(--primary), var(--accent));
                    border-radius: 2px;
                    width: 0%;
                    transition: width 0.3s ease;
                    position: relative;
                }

                .progress-fill::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(90deg, 
                        transparent, 
                        rgba(255,255,255,0.4), 
                        transparent
                    );
                    animation: shine 1.5s infinite;
                }

                @keyframes shine {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }

                .progress-text {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.8rem;
                    color: #94a3b8;
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* Connection status indicator */
                .connection-status {
                    position: fixed;
                    top: 1rem;
                    right: 1rem;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                }

                .connection-status.online {
                    background: rgba(34, 197, 94, 0.2);
                    color: #22c55e;
                    border: 1px solid rgba(34, 197, 94, 0.3);
                }

                .connection-status.offline {
                    background: rgba(239, 68, 68, 0.2);
                    color: #ef4444;
                    border: 1px solid rgba(239, 68, 68, 0.3);
                }

                .connection-status.slow {
                    background: rgba(245, 158, 11, 0.2);
                    color: #f59e0b;
                    border: 1px solid rgba(245, 158, 11, 0.3);
                }

                .status-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: currentColor;
                    animation: pulse-dot 2s infinite;
                }

                @keyframes pulse-dot {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }

                @media (max-width: 768px) {
                    .loading-content {
                        padding: 1rem;
                    }
                    
                    .loading-logo i {
                        font-size: 2.5rem;
                    }
                    
                    .connection-status {
                        top: 0.5rem;
                        right: 0.5rem;
                        font-size: 0.75rem;
                        padding: 0.4rem 0.8rem;
                    }
                }
            </style>
        `;

        document.body.appendChild(this.loadingOverlay);
    }

    show(options = {}) {
        const {
            title = 'Loading...',
            subtitle = 'Please wait while we prepare your workspace',
            duration = 2000
        } = options;

        document.getElementById('loading-title').textContent = title;
        document.getElementById('loading-subtitle').textContent = subtitle;
        
        this.loadingOverlay.classList.add('show');
        this.simulateProgress(duration);
    }

    hide() {
        this.loadingOverlay.classList.remove('show');
        // Reset progress
        setTimeout(() => {
            document.getElementById('progress-fill').style.width = '0%';
            document.getElementById('progress-percentage').textContent = '0%';
            document.getElementById('progress-status').textContent = 'Initializing...';
        }, 400);
    }

    simulateProgress(duration) {
        const progressFill = document.getElementById('progress-fill');
        const progressPercent = document.getElementById('progress-percentage');
        const progressStatus = document.getElementById('progress-status');
        
        const steps = [
            { percent: 20, status: 'Loading resources...', delay: 0.2 },
            { percent: 40, status: 'Authenticating...', delay: 0.4 },
            { percent: 60, status: 'Initializing interface...', delay: 0.6 },
            { percent: 80, status: 'Loading data...', delay: 0.8 },
            { percent: 100, status: 'Complete!', delay: 1.0 }
        ];

        steps.forEach((step, index) => {
            setTimeout(() => {
                progressFill.style.width = `${step.percent}%`;
                progressPercent.textContent = `${step.percent}%`;
                progressStatus.textContent = step.status;
                
                if (step.percent === 100) {
                    setTimeout(() => this.hide(), 500);
                }
            }, duration * step.delay);
        });
    }

    interceptNavigation() {
        // Intercept link clicks for smooth transitions
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (!link || this.isTransitioning) return;
            
            const href = link.getAttribute('href');
            
            // Only intercept internal links
            if (href.startsWith('./') || href.startsWith('../') || href.includes('.html')) {
                e.preventDefault();
                this.navigateToPage(href, link.textContent.trim());
            }
        });

        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.navigateToPage(e.state.page, 'Navigating...');
            }
        });
    }

    navigateToPage(href, linkText = 'Loading...') {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        // Show loading with context
        this.show({
            title: `Loading ${linkText}`,
            subtitle: 'Preparing your next workspace...',
            duration: 1500
        });

        // Navigate after a short delay for smooth transition
        setTimeout(() => {
            window.location.href = href;
        }, 800);
    }

    addPageLoadAnimations() {
        // Add entrance animations to page elements
        const animateOnLoad = () => {
            const elements = document.querySelectorAll(
                '.main-content, .sidebar, .page-title, .glass-card, .widget'
            );
            
            elements.forEach((element, index) => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 150 + 300);
            });
        };

        // Run animations after other scripts have loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(animateOnLoad, 500);
            });
        } else {
            setTimeout(animateOnLoad, 500);
        }
    }

    setupProgressIndicators() {
        // Create top loading bar for page navigations
        const progressBar = document.createElement('div');
        progressBar.id = 'top-progress-bar';
        progressBar.innerHTML = `
            <div class="progress-line"></div>
            <style>
                #top-progress-bar {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 3px;
                    z-index: 99999;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                #top-progress-bar.show {
                    opacity: 1;
                }

                .progress-line {
                    height: 100%;
                    background: linear-gradient(90deg, var(--primary), var(--accent));
                    width: 0%;
                    transition: width 0.3s ease;
                    box-shadow: 0 0 10px rgba(31, 173, 130, 0.5);
                }
            </style>
        `;
        document.body.appendChild(progressBar);
    }

    showTopProgress(duration = 2000) {
        const progressBar = document.getElementById('top-progress-bar');
        const progressLine = progressBar.querySelector('.progress-line');
        
        progressBar.classList.add('show');
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 90) progress = 90;
            
            progressLine.style.width = `${progress}%`;
            
            if (progress >= 90) {
                clearInterval(interval);
                setTimeout(() => {
                    progressLine.style.width = '100%';
                    setTimeout(() => {
                        progressBar.classList.remove('show');
                        setTimeout(() => {
                            progressLine.style.width = '0%';
                        }, 300);
                    }, 200);
                }, 100);
            }
        }, duration / 20);
    }

    addConnectionMonitoring() {
        // Create connection status indicator
        const connectionStatus = document.createElement('div');
        connectionStatus.className = 'connection-status online';
        connectionStatus.innerHTML = `
            <div class="status-dot"></div>
            <span>Online</span>
        `;
        document.body.appendChild(connectionStatus);

        // Monitor connection
        const updateConnectionStatus = () => {
            const isOnline = navigator.onLine;
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            
            if (!isOnline) {
                connectionStatus.className = 'connection-status offline';
                connectionStatus.innerHTML = '<div class="status-dot"></div><span>Offline</span>';
            } else if (connection && connection.effectiveType === 'slow-2g') {
                connectionStatus.className = 'connection-status slow';
                connectionStatus.innerHTML = '<div class="status-dot"></div><span>Slow Connection</span>';
            } else {
                connectionStatus.className = 'connection-status online';
                connectionStatus.innerHTML = '<div class="status-dot"></div><span>Online</span>';
            }
        };

        window.addEventListener('online', updateConnectionStatus);
        window.addEventListener('offline', updateConnectionStatus);
        
        if (navigator.connection) {
            navigator.connection.addEventListener('change', updateConnectionStatus);
        }

        // Hide after 5 seconds if online
        setTimeout(() => {
            if (navigator.onLine) {
                connectionStatus.style.opacity = '0';
                connectionStatus.style.transform = 'translateX(100%)';
            }
        }, 5000);
    }

    // Public methods for manual control
    startLoading(options) {
        this.show(options);
    }

    stopLoading() {
        this.hide();
    }

    showProgress(duration) {
        this.showTopProgress(duration);
    }
}

// Initialize page transition manager
document.addEventListener('DOMContentLoaded', () => {
    window.pageTransitions = new PageTransitionManager();
    console.log('🔄 Advanced page transitions loaded');
    
    // Show initial loading if this is a fresh page load
    if (performance.navigation.type === 1) { // Reload
        window.pageTransitions.show({
            title: 'Refreshing...',
            subtitle: 'Updating your workspace...',
            duration: 1500
        });
    }
});

// Show loading on page unload
window.addEventListener('beforeunload', () => {
    if (window.pageTransitions) {
        window.pageTransitions.showTopProgress(1000);
    }
});

// Export for use in other modules
window.PageTransitionManager = PageTransitionManager;