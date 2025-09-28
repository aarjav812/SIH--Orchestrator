// Advanced Dashboard Widget System
class DashboardWidgets {
    constructor() {
        this.widgets = new Map();
        this.updateInterval = null;
        this.animationQueue = [];
        this.init();
    }

    init() {
        this.createWidgetContainer();
        this.loadWidgets();
        this.startUpdateCycle();
        this.addWidgetAnimations();
    }

    createWidgetContainer() {
        // Check if we're on the dashboard page
        if (!window.location.pathname.includes('dashboard.html')) return;

        const existingWidgets = document.querySelector('.dashboard-widgets');
        if (existingWidgets) return;

        const widgetContainer = document.createElement('div');
        widgetContainer.className = 'dashboard-widgets';
        widgetContainer.innerHTML = `
            <style>
                .dashboard-widgets {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1.5rem;
                    margin: 2rem 0;
                    opacity: 0;
                    transform: translateY(20px);
                    animation: slideInUp 0.6s ease-out 0.3s forwards;
                }

                .widget {
                    background: linear-gradient(135deg, 
                        rgba(30, 41, 59, 0.8), 
                        rgba(15, 23, 42, 0.9)
                    );
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    padding: 1.5rem;
                    backdrop-filter: blur(20px);
                    box-shadow: 
                        0 8px 32px rgba(0, 0, 0, 0.3),
                        0 2px 16px rgba(31, 173, 130, 0.1);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }

                .widget::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: var(--gradient);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .widget:hover {
                    transform: translateY(-5px);
                    box-shadow: 
                        0 16px 48px rgba(0, 0, 0, 0.4),
                        0 4px 24px rgba(31, 173, 130, 0.2);
                    border-color: rgba(31, 173, 130, 0.3);
                }

                .widget:hover::before {
                    opacity: 1;
                }

                .widget-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }

                .widget-title {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #f8fafc;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .widget-icon {
                    color: var(--primary);
                    font-size: 1.2rem;
                }

                .widget-actions {
                    display: flex;
                    gap: 0.5rem;
                }

                .widget-btn {
                    background: none;
                    border: none;
                    color: #94a3b8;
                    cursor: pointer;
                    padding: 0.25rem;
                    border-radius: 4px;
                    transition: all 0.2s ease;
                    font-size: 0.9rem;
                }

                .widget-btn:hover {
                    color: var(--primary);
                    background: rgba(31, 173, 130, 0.1);
                }

                .widget-content {
                    position: relative;
                }

                .widget-metric {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.75rem 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }

                .widget-metric:last-child {
                    border-bottom: none;
                }

                .metric-label {
                    color: #cbd5e1;
                    font-size: 0.9rem;
                }

                .metric-value {
                    color: #f8fafc;
                    font-weight: 600;
                    font-size: 1.1rem;
                }

                .metric-trend {
                    font-size: 0.8rem;
                    padding: 0.25rem 0.5rem;
                    border-radius: 12px;
                    margin-left: 0.5rem;
                }

                .trend-up {
                    background: rgba(34, 197, 94, 0.2);
                    color: #22c55e;
                }

                .trend-down {
                    background: rgba(239, 68, 68, 0.2);
                    color: #ef4444;
                }

                .trend-neutral {
                    background: rgba(156, 163, 175, 0.2);
                    color: #9ca3af;
                }

                .chart-container {
                    height: 200px;
                    position: relative;
                    margin-top: 1rem;
                }

                .mini-chart {
                    width: 100%;
                    height: 60px;
                    background: linear-gradient(90deg, 
                        rgba(31, 173, 130, 0.2) 0%, 
                        rgba(16, 185, 129, 0.1) 100%
                    );
                    border-radius: 8px;
                    position: relative;
                    overflow: hidden;
                }

                .chart-line {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: var(--primary);
                    animation: pulse 2s ease-in-out infinite;
                }

                @keyframes slideInUp {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.6; }
                }

                @keyframes countUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                .loading-skeleton {
                    background: linear-gradient(90deg, 
                        rgba(255,255,255,0.05) 25%, 
                        rgba(255,255,255,0.1) 50%, 
                        rgba(255,255,255,0.05) 75%
                    );
                    background-size: 200% 100%;
                    animation: loading 1.5s infinite;
                    border-radius: 4px;
                    height: 1rem;
                    margin: 0.25rem 0;
                }

                @keyframes loading {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }

                @media (max-width: 768px) {
                    .dashboard-widgets {
                        grid-template-columns: 1fr;
                        gap: 1rem;
                        margin: 1rem 0;
                    }
                    
                    .widget {
                        padding: 1rem;
                    }
                }
            </style>
        `;

        // Insert after the welcome section or at the beginning of main content
        const mainContent = document.querySelector('.main-content, .center');
        if (mainContent) {
            const welcomeCard = mainContent.querySelector('.welcome-card, .card, .glass-card');
            if (welcomeCard) {
                welcomeCard.insertAdjacentElement('afterend', widgetContainer);
            } else {
                mainContent.insertBefore(widgetContainer, mainContent.firstChild);
            }
        }
    }

    loadWidgets() {
        const container = document.querySelector('.dashboard-widgets');
        if (!container) return;

        // Load different widgets based on user role
        const userRole = this.getUserRole();
        const widgets = this.getWidgetsForRole(userRole);

        container.innerHTML += widgets.map(widget => this.renderWidget(widget)).join('');
        
        // Animate widgets in
        this.animateWidgetsIn();
    }

    getUserRole() {
        // Try to get role from localStorage or token
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                return payload.role || 'employee';
            } catch (e) {
                return 'employee';
            }
        }
        return 'employee';
    }

    getWidgetsForRole(role) {
        const commonWidgets = [
            {
                id: 'attendance',
                title: 'Today\'s Attendance',
                icon: 'fa-clock',
                type: 'metrics',
                data: this.getAttendanceData()
            },
            {
                id: 'tasks',
                title: 'Task Overview',
                icon: 'fa-tasks',
                type: 'progress',
                data: this.getTaskData()
            }
        ];

        const managerWidgets = [
            {
                id: 'team-performance',
                title: 'Team Performance',
                icon: 'fa-chart-line',
                type: 'chart',
                data: this.getTeamPerformanceData()
            },
            {
                id: 'project-status',
                title: 'Project Status',
                icon: 'fa-project-diagram',
                type: 'status',
                data: this.getProjectStatusData()
            }
        ];

        const adminWidgets = [
            {
                id: 'system-health',
                title: 'System Health',
                icon: 'fa-server',
                type: 'health',
                data: this.getSystemHealthData()
            },
            {
                id: 'user-activity',
                title: 'User Activity',
                icon: 'fa-users',
                type: 'activity',
                data: this.getUserActivityData()
            }
        ];

        switch (role) {
            case 'admin':
                return [...commonWidgets, ...managerWidgets, ...adminWidgets];
            case 'manager':
                return [...commonWidgets, ...managerWidgets];
            default:
                return commonWidgets;
        }
    }

    renderWidget(widget) {
        return `
            <div class="widget" data-widget-id="${widget.id}">
                <div class="widget-header">
                    <div class="widget-title">
                        <i class="fas ${widget.icon} widget-icon"></i>
                        ${widget.title}
                    </div>
                    <div class="widget-actions">
                        <button class="widget-btn" onclick="dashboardWidgets.refreshWidget('${widget.id}')">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                        <button class="widget-btn" onclick="dashboardWidgets.expandWidget('${widget.id}')">
                            <i class="fas fa-expand"></i>
                        </button>
                    </div>
                </div>
                <div class="widget-content">
                    ${this.renderWidgetContent(widget)}
                </div>
            </div>
        `;
    }

    renderWidgetContent(widget) {
        switch (widget.type) {
            case 'metrics':
                return this.renderMetricsWidget(widget.data);
            case 'progress':
                return this.renderProgressWidget(widget.data);
            case 'chart':
                return this.renderChartWidget(widget.data);
            case 'status':
                return this.renderStatusWidget(widget.data);
            case 'health':
                return this.renderHealthWidget(widget.data);
            case 'activity':
                return this.renderActivityWidget(widget.data);
            default:
                return '<div class="loading-skeleton"></div>';
        }
    }

    renderMetricsWidget(data) {
        return data.metrics.map(metric => `
            <div class="widget-metric">
                <span class="metric-label">${metric.label}</span>
                <div style="display: flex; align-items: center;">
                    <span class="metric-value">${metric.value}</span>
                    ${metric.trend ? `
                        <span class="metric-trend trend-${metric.trend.type}">
                            <i class="fas fa-arrow-${metric.trend.type === 'up' ? 'up' : metric.trend.type === 'down' ? 'down' : 'right'}"></i>
                            ${metric.trend.value}
                        </span>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    renderProgressWidget(data) {
        return `
            ${data.items.map(item => `
                <div class="widget-metric">
                    <div style="flex: 1;">
                        <div class="metric-label">${item.name}</div>
                        <div style="background: rgba(255,255,255,0.1); height: 6px; border-radius: 3px; margin-top: 0.5rem;">
                            <div style="
                                width: ${item.progress}%; 
                                height: 100%; 
                                background: var(--primary); 
                                border-radius: 3px;
                                transition: width 0.6s ease;
                            "></div>
                        </div>
                    </div>
                    <span class="metric-value">${item.progress}%</span>
                </div>
            `).join('')}
        `;
    }

    renderChartWidget(data) {
        return `
            <div class="chart-container">
                <div class="mini-chart">
                    <div class="chart-line"></div>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 1rem;">
                    ${data.summary.map(item => `
                        <div style="text-align: center;">
                            <div class="metric-value">${item.value}</div>
                            <div class="metric-label" style="font-size: 0.8rem;">${item.label}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderStatusWidget(data) {
        return data.projects.map(project => `
            <div class="widget-metric">
                <div style="flex: 1;">
                    <div class="metric-label">${project.name}</div>
                    <div style="margin-top: 0.25rem;">
                        <span style="
                            padding: 0.25rem 0.5rem;
                            border-radius: 12px;
                            font-size: 0.75rem;
                            background: ${project.status === 'active' ? 'rgba(34, 197, 94, 0.2)' : 
                                        project.status === 'warning' ? 'rgba(245, 158, 11, 0.2)' : 
                                        'rgba(239, 68, 68, 0.2)'};
                            color: ${project.status === 'active' ? '#22c55e' : 
                                    project.status === 'warning' ? '#f59e0b' : 
                                    '#ef4444'};
                        ">${project.status.toUpperCase()}</span>
                    </div>
                </div>
                <span class="metric-value">${project.completion}%</span>
            </div>
        `).join('');
    }

    renderHealthWidget(data) {
        return `
            <div class="widget-metric">
                <span class="metric-label">CPU Usage</span>
                <span class="metric-value">${data.cpu}%</span>
            </div>
            <div class="widget-metric">
                <span class="metric-label">Memory</span>
                <span class="metric-value">${data.memory}%</span>
            </div>
            <div class="widget-metric">
                <span class="metric-label">Active Users</span>
                <span class="metric-value">${data.activeUsers}</span>
            </div>
        `;
    }

    renderActivityWidget(data) {
        return data.activities.map(activity => `
            <div class="widget-metric">
                <div style="flex: 1;">
                    <div class="metric-label">${activity.action}</div>
                    <div style="color: #64748b; font-size: 0.8rem; margin-top: 0.25rem;">
                        ${activity.time}
                    </div>
                </div>
                <span class="metric-value">${activity.count}</span>
            </div>
        `).join('');
    }

    // Mock data generators
    getAttendanceData() {
        return {
            metrics: [
                { 
                    label: 'Check-in Time', 
                    value: '9:15 AM',
                    trend: { type: 'down', value: '15 min late' }
                },
                { 
                    label: 'Hours Today', 
                    value: '6.5h',
                    trend: { type: 'up', value: '+0.5h' }
                },
                { 
                    label: 'This Week', 
                    value: '32.5h',
                    trend: { type: 'up', value: '+2.5h' }
                }
            ]
        };
    }

    getTaskData() {
        return {
            items: [
                { name: 'Dashboard Updates', progress: 85 },
                { name: 'Code Review', progress: 60 },
                { name: 'Documentation', progress: 30 },
                { name: 'Testing', progress: 95 }
            ]
        };
    }

    getTeamPerformanceData() {
        return {
            summary: [
                { label: 'Avg Score', value: '8.4' },
                { label: 'Completed', value: '23' },
                { label: 'In Progress', value: '7' }
            ]
        };
    }

    getProjectStatusData() {
        return {
            projects: [
                { name: 'HRMS Dashboard', status: 'active', completion: 85 },
                { name: 'Mobile App', status: 'warning', completion: 45 },
                { name: 'API Integration', status: 'active', completion: 90 }
            ]
        };
    }

    getSystemHealthData() {
        return {
            cpu: Math.floor(Math.random() * 30) + 20,
            memory: Math.floor(Math.random() * 40) + 30,
            activeUsers: Math.floor(Math.random() * 50) + 15
        };
    }

    getUserActivityData() {
        return {
            activities: [
                { action: 'User Logins', count: 45, time: 'Last hour' },
                { action: 'Tasks Created', count: 12, time: 'Today' },
                { action: 'Reports Generated', count: 8, time: 'Today' }
            ]
        };
    }

    animateWidgetsIn() {
        const widgets = document.querySelectorAll('.widget');
        widgets.forEach((widget, index) => {
            widget.style.opacity = '0';
            widget.style.transform = 'translateY(30px) scale(0.95)';
            
            setTimeout(() => {
                widget.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                widget.style.opacity = '1';
                widget.style.transform = 'translateY(0) scale(1)';
            }, index * 150 + 500);
        });
    }

    refreshWidget(widgetId) {
        const widget = document.querySelector(`[data-widget-id="${widgetId}"]`);
        if (!widget) return;

        const content = widget.querySelector('.widget-content');
        const refreshBtn = widget.querySelector('.fa-sync-alt');
        
        // Animate refresh button
        refreshBtn.style.animation = 'spin 1s linear infinite';
        
        // Add loading state
        content.style.opacity = '0.5';
        
        setTimeout(() => {
            // Simulate data refresh
            content.style.opacity = '1';
            refreshBtn.style.animation = '';
            
            if (window.showNotification) {
                window.showNotification(
                    'Widget Updated', 
                    `${widget.querySelector('.widget-title').textContent.trim()} has been refreshed`,
                    'success',
                    2000
                );
            }
        }, 1000);
    }

    expandWidget(widgetId) {
        if (window.showNotification) {
            window.showNotification(
                'Coming Soon', 
                'Widget expansion feature will be available in the next update',
                'info',
                3000
            );
        }
    }

    startUpdateCycle() {
        // Update widgets every 30 seconds
        this.updateInterval = setInterval(() => {
            this.updateDynamicWidgets();
        }, 30000);
    }

    updateDynamicWidgets() {
        // Update system health widget if present
        const healthWidget = document.querySelector('[data-widget-id="system-health"]');
        if (healthWidget) {
            const newData = this.getSystemHealthData();
            const content = healthWidget.querySelector('.widget-content');
            content.innerHTML = this.renderHealthWidget(newData);
        }
    }

    addWidgetAnimations() {
        // Add CSS for smooth animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

// Initialize dashboard widgets
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('dashboard.html')) {
        setTimeout(() => {
            window.dashboardWidgets = new DashboardWidgets();
            console.log('📊 Advanced dashboard widgets loaded');
        }, 1000);
    }
});

// Export for use in other modules
window.DashboardWidgets = DashboardWidgets;