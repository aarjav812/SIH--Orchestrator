// API Configuration and Authentication Utils
const API_CONFIG = {
  BASE_URL: window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api' 
    : 'https://your-production-api.com/api',
  
  AUTH_ENDPOINTS: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me'
  },
  
  USER_ENDPOINTS: {
    LIST: '/users',
    PROFILE: '/users/',
    TEAM: '/users/team/my-team'
  },
  
  LEAVE_ENDPOINTS: {
    LIST: '/leaves',
    CREATE: '/leaves',
    UPDATE: '/leaves/'
  },
  
  PERFORMANCE_ENDPOINTS: {
    LIST: '/performance',
    CREATE: '/performance',
    GOALS: '/performance/goals'
  }
};

// Authentication utilities
const Auth = {
  // Get stored token
  getToken() {
    return localStorage.getItem('token');
  },
  
  // Get stored user data
  getUser() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  },
  
  // Check if user is logged in
  isAuthenticated() {
    return !!this.getToken();
  },
  
  // Login user
  async login(credentials) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.AUTH_ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('token', data.user.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },
  
  // Register user
  async register(userData) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.AUTH_ENDPOINTS.REGISTER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },
  
  // Logout user
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'home page.html';
  },
  
  // Redirect to login if not authenticated
  requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }
};

// API request helper with authentication
const API = {
  async request(endpoint, options = {}) {
    const token = Auth.getToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      ...options
    };
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, config);
      const data = await response.json();
      
      // If unauthorized, logout user
      if (response.status === 401) {
        Auth.logout();
        return;
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, error: 'Network error' };
    }
  },
  
  // GET request
  get(endpoint) {
    return this.request(endpoint);
  },
  
  // POST request
  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  // PUT request
  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  // DELETE request
  delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    });
  }
};

// UI Utilities
const UI = {
  // Show notification
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 10000;
      transition: all 0.3s ease;
      transform: translateX(100%);
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  },
  
  // Show loading spinner
  showLoading(element) {
    const originalText = element.textContent;
    element.textContent = 'Loading...';
    element.disabled = true;
    
    return () => {
      element.textContent = originalText;
      element.disabled = false;
    };
  }
};

// Navigation utilities
const Navigation = {
  // Update user info in navigation
  updateUserInfo() {
    const user = Auth.getUser();
    if (user) {
      // Update user name in sidebar or navigation
      const userNameElements = document.querySelectorAll('.user-name');
      userNameElements.forEach(el => {
        el.textContent = `${user.firstName} ${user.lastName}`;
      });
      
      // Update role display
      const roleElements = document.querySelectorAll('.user-role');
      roleElements.forEach(el => {
        el.textContent = user.role;
      });
    }
  },
  
  // Add logout functionality to logout buttons
  initializeLogout() {
    const logoutButtons = document.querySelectorAll('.logout-btn');
    logoutButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
          Auth.logout();
        }
      });
    });
  }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
  // Determine current page name (supports clean URLs without .html)
  const pathname = decodeURIComponent(window.location.pathname || '/');
  let page = pathname.substring(pathname.lastIndexOf('/') + 1);
  if (!page) page = 'index';
  page = page.toLowerCase();

  // Public pages that must NOT trigger auth redirects
  const isPublic = (p) => [
    'index', 'index.html',
    'login', 'login.html',
    'home page', 'home page.html'
  ].includes(p);

  // Only enforce auth on non-public pages
  if (!isPublic(page)) {
    // Check authentication for protected pages (dashboard, ai-assistant, etc.)
    if (!Auth.requireAuth()) return;

    // Update navigation with user info (temporarily disabled to prevent errors)
    // Navigation.updateUserInfo();
    // Navigation.initializeLogout();
  }
});