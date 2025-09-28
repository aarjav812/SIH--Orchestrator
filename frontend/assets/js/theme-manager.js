// Advanced Theme System for HRMS
class ThemeManager {
    constructor() {
        this.themes = {
            dark: {
                name: 'Dark Professional',
                primary: '#1fad82',
                secondary: '#0f172a',
                background: '#0f172a',
                surface: '#1e293b',
                text: '#f8fafc',
                textSecondary: '#cbd5e1',
                accent: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444',
                success: '#22c55e',
                gradient: 'linear-gradient(135deg, #1fad82, #10b981)',
                glassmorphism: 'rgba(30, 41, 59, 0.7)'
            },
            midnight: {
                name: 'Midnight Blue',
                primary: '#3b82f6',
                secondary: '#0c1426',
                background: '#0c1426',
                surface: '#1e293b',
                text: '#f1f5f9',
                textSecondary: '#94a3b8',
                accent: '#60a5fa',
                warning: '#fbbf24',
                error: '#f87171',
                success: '#34d399',
                gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                glassmorphism: 'rgba(30, 41, 59, 0.8)'
            },
            purple: {
                name: 'Purple Haze',
                primary: '#8b5cf6',
                secondary: '#1a0933',
                background: '#1a0933',
                surface: '#2d1b4e',
                text: '#f3e8ff',
                textSecondary: '#c4b5fd',
                accent: '#a78bfa',
                warning: '#fcd34d',
                error: '#fb7185',
                success: '#4ade80',
                gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                glassmorphism: 'rgba(45, 27, 78, 0.8)'
            },
            ocean: {
                name: 'Deep Ocean',
                primary: '#06b6d4',
                secondary: '#0c2836',
                background: '#0c2836',
                surface: '#164e63',
                text: '#ecfeff',
                textSecondary: '#a5f3fc',
                accent: '#22d3ee',
                warning: '#fb923c',
                error: '#f472b6',
                success: '#16a34a',
                gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                glassmorphism: 'rgba(22, 78, 99, 0.8)'
            },
            forest: {
                name: 'Forest Green',
                primary: '#059669',
                secondary: '#0f2315',
                background: '#0f2315',
                surface: '#1f2937',
                text: '#f0fdf4',
                textSecondary: '#bbf7d0',
                accent: '#10b981',
                warning: '#f59e0b',
                error: '#dc2626',
                success: '#22c55e',
                gradient: 'linear-gradient(135deg, #059669, #047857)',
                glassmorphism: 'rgba(31, 41, 55, 0.8)'
            }
        };
        
        this.currentTheme = 'dark'; // Default theme
        this.init();
    }

    init() {
        this.loadSavedTheme();
        this.createThemeSelector();
        this.applyTheme(this.currentTheme);
        this.addThemeAnimations();
    }

    loadSavedTheme() {
        const saved = localStorage.getItem('hrms_theme');
        if (saved && this.themes[saved]) {
            this.currentTheme = saved;
        }
    }

    saveTheme(themeName) {
        localStorage.setItem('hrms_theme', themeName);
    }

    createThemeSelector() {
        // Check if theme selector already exists
        if (document.getElementById('theme-selector')) return;

        // Create floating theme selector button
        const themeButton = document.createElement('div');
        themeButton.id = 'theme-selector-btn';
        themeButton.innerHTML = `
            <button class="theme-toggle-btn">
                <i class="fas fa-palette"></i>
            </button>
        `;
        
        // Create theme selector panel
        const themePanel = document.createElement('div');
        themePanel.id = 'theme-selector';
        themePanel.className = 'theme-selector';
        
        const themesHTML = Object.keys(this.themes).map(key => {
            const theme = this.themes[key];
            return `
                <div class="theme-option ${key === this.currentTheme ? 'active' : ''}" 
                     data-theme="${key}">
                    <div class="theme-preview">
                        <div class="theme-color" style="background: ${theme.primary}"></div>
                        <div class="theme-color" style="background: ${theme.accent}"></div>
                        <div class="theme-color" style="background: ${theme.background}"></div>
                    </div>
                    <span class="theme-name">${theme.name}</span>
                    <i class="fas fa-check theme-check"></i>
                </div>
            `;
        }).join('');
        
        themePanel.innerHTML = `
            <div class="theme-panel-header">
                <h3>Choose Theme</h3>
                <button class="theme-close-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="theme-options">
                ${themesHTML}
            </div>
            <div class="theme-panel-footer">
                <small>Themes are automatically saved</small>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .theme-toggle-btn {
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                width: 56px;
                height: 56px;
                border: none;
                border-radius: 50%;
                background: linear-gradient(135deg, var(--primary), var(--accent));
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                box-shadow: 
                    0 8px 32px rgba(0,0,0,0.3),
                    0 2px 16px rgba(31,173,130,0.2);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                z-index: 1000;
                backdrop-filter: blur(10px);
            }
            
            .theme-toggle-btn:hover {
                transform: translateY(-2px) scale(1.05);
                box-shadow: 
                    0 12px 40px rgba(0,0,0,0.4),
                    0 4px 20px rgba(31,173,130,0.3);
            }
            
            .theme-selector {
                position: fixed;
                bottom: 6rem;
                right: 2rem;
                width: 320px;
                background: rgba(17,24,39,0.95);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 16px;
                backdrop-filter: blur(20px);
                box-shadow: 
                    0 20px 60px rgba(0,0,0,0.5),
                    0 8px 32px rgba(0,0,0,0.3);
                z-index: 1001;
                transform: translateY(20px) scale(0.9);
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                overflow: hidden;
            }
            
            .theme-selector.show {
                transform: translateY(0) scale(1);
                opacity: 1;
                visibility: visible;
            }
            
            .theme-panel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }
            
            .theme-panel-header h3 {
                margin: 0;
                color: #f8fafc;
                font-size: 1.1rem;
                font-weight: 600;
            }
            
            .theme-close-btn {
                background: none;
                border: none;
                color: #94a3b8;
                font-size: 1rem;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 6px;
                transition: all 0.2s ease;
            }
            
            .theme-close-btn:hover {
                color: #f8fafc;
                background: rgba(255,255,255,0.1);
            }
            
            .theme-options {
                padding: 1rem;
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                max-height: 300px;
                overflow-y: auto;
            }
            
            .theme-option {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 0.75rem;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
                position: relative;
            }
            
            .theme-option:hover {
                background: rgba(255,255,255,0.05);
            }
            
            .theme-option.active {
                background: rgba(31,173,130,0.2);
                border: 1px solid rgba(31,173,130,0.3);
            }
            
            .theme-preview {
                display: flex;
                gap: 4px;
                align-items: center;
            }
            
            .theme-color {
                width: 16px;
                height: 16px;
                border-radius: 50%;
                border: 2px solid rgba(255,255,255,0.2);
            }
            
            .theme-name {
                flex: 1;
                color: #f8fafc;
                font-size: 0.9rem;
                font-weight: 500;
            }
            
            .theme-check {
                color: var(--primary);
                opacity: 0;
                transition: opacity 0.2s ease;
            }
            
            .theme-option.active .theme-check {
                opacity: 1;
            }
            
            .theme-panel-footer {
                padding: 1rem 1.5rem;
                border-top: 1px solid rgba(255,255,255,0.1);
                text-align: center;
            }
            
            .theme-panel-footer small {
                color: #64748b;
                font-size: 0.8rem;
            }
            
            @media (max-width: 768px) {
                .theme-selector {
                    right: 1rem;
                    left: 1rem;
                    width: auto;
                }
                
                .theme-toggle-btn {
                    right: 1rem;
                    bottom: 1rem;
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(themeButton);
        document.body.appendChild(themePanel);
        
        // Add event listeners
        this.addThemeEventListeners();
    }

    addThemeEventListeners() {
        const toggleBtn = document.querySelector('.theme-toggle-btn');
        const panel = document.getElementById('theme-selector');
        const closeBtn = document.querySelector('.theme-close-btn');
        const options = document.querySelectorAll('.theme-option');
        
        toggleBtn.addEventListener('click', () => {
            panel.classList.toggle('show');
        });
        
        closeBtn.addEventListener('click', () => {
            panel.classList.remove('show');
        });
        
        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!panel.contains(e.target) && !toggleBtn.contains(e.target)) {
                panel.classList.remove('show');
            }
        });
        
        // Theme selection
        options.forEach(option => {
            option.addEventListener('click', () => {
                const themeName = option.dataset.theme;
                this.switchTheme(themeName);
                
                // Update active state
                options.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                
                // Close panel
                setTimeout(() => panel.classList.remove('show'), 500);
            });
        });
    }

    switchTheme(themeName) {
        if (!this.themes[themeName]) return;
        
        this.currentTheme = themeName;
        this.saveTheme(themeName);
        this.applyTheme(themeName);
        
        // Show notification
        if (window.showNotification) {
            window.showNotification(
                'Theme Changed',
                `Switched to ${this.themes[themeName].name} theme`,
                'success',
                3000
            );
        }
    }

    applyTheme(themeName) {
        const theme = this.themes[themeName];
        const root = document.documentElement;
        
        // Apply CSS variables
        Object.keys(theme).forEach(key => {
            if (key !== 'name') {
                root.style.setProperty(`--${key}`, theme[key]);
            }
        });
        
        // Update meta theme color
        let metaTheme = document.querySelector('meta[name="theme-color"]');
        if (!metaTheme) {
            metaTheme = document.createElement('meta');
            metaTheme.name = 'theme-color';
            document.head.appendChild(metaTheme);
        }
        metaTheme.content = theme.primary;
        
        // Trigger theme change event
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: themeName, colors: theme }
        }));
    }

    addThemeAnimations() {
        // Add smooth transitions for theme changes
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                transition: 
                    background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                    border-color 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                    color 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                    box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
            }
            
            /* Prevent transitions on page load */
            .preload * {
                transition: none !important;
            }
        `;
        document.head.appendChild(style);
        
        // Remove preload class after initial load
        document.body.classList.add('preload');
        setTimeout(() => {
            document.body.classList.remove('preload');
        }, 100);
    }

    // Get current theme colors
    getCurrentTheme() {
        return this.themes[this.currentTheme];
    }
    
    // Check if dark theme
    isDarkTheme() {
        return true; // All our themes are dark variants
    }
}

// Color utility functions
class ColorUtils {
    static hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    static rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        
        return { h: h * 360, s: s * 100, l: l * 100 };
    }
    
    static lighten(color, amount) {
        const rgb = this.hexToRgb(color);
        if (!rgb) return color;
        
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        hsl.l = Math.min(100, hsl.l + amount);
        
        return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    }
    
    static darken(color, amount) {
        return this.lighten(color, -amount);
    }
}

// Initialize theme manager
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
    window.ColorUtils = ColorUtils;
    console.log('🎨 Advanced theme system loaded');
});

// Export for use in other modules
window.ThemeManager = ThemeManager;