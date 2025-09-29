// Alert function for user feedback
function showAlert(message, type = 'info') {
    // Try to use existing notification system if available
    if (window.UI && typeof window.UI.showNotification === 'function') {
        const title = type === 'error' ? 'Error' : type === 'success' ? 'Success' : 'Info';
        window.UI.showNotification(title, message, type);
        return;
    }
    
    // Fallback to custom alert
    const alertDiv = document.createElement('div');
    alertDiv.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 10002;
        background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#1fad82' : '#3b82f6'};
        color: white; padding: 1rem 1.5rem; border-radius: 8px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.2); max-width: 300px;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add animation CSS
    if (!document.getElementById('alertStyles')) {
        const style = document.createElement('style');
        style.id = 'alertStyles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    alertDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        alertDiv.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.parentNode.removeChild(alertDiv);
            }
        }, 300);
    }, 5000);
    
    // Click to dismiss
    alertDiv.addEventListener('click', () => {
        alertDiv.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.parentNode.removeChild(alertDiv);
            }
        }, 300);
    });
}

// Project button functionality
document.addEventListener('DOMContentLoaded', function() {
    // Create Project button
    const createProjectBtn = document.getElementById('make_team');
    if (createProjectBtn) {
        createProjectBtn.addEventListener('click', function() {
            showCreateProjectDialog();
        });
    }

    // Join Project button
    const joinProjectBtn = document.getElementById('join_team');
    if (joinProjectBtn) {
        joinProjectBtn.addEventListener('click', function() {
            showJoinProjectDialog();
        });
    }
    
    // Add Deadline button
    const addDeadlineBtn = document.getElementById('addBtn');
    console.log('Add Deadline button found:', !!addDeadlineBtn); // Debug log
    if (addDeadlineBtn) {
        addDeadlineBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Add Deadline button clicked!'); // Debug log
            showAddDeadlinePopup();
        });
    }
    
    // Save Deadline button
    const saveDeadlineBtn = document.getElementById('saveBtn');
    console.log('Save Deadline button found:', !!saveDeadlineBtn); // Debug log
    if (saveDeadlineBtn) {
        // Remove any existing listeners first
        saveDeadlineBtn.onclick = null;
        
        saveDeadlineBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Save Deadline button clicked!'); // Debug log
            saveDeadline();
        });
    }
    
    // Initialize deadline system
    console.log('Initializing deadline system...'); // Debug log
    initializeDeadlineSystem();
});

function showCreateProjectDialog() {
    const dialog = document.createElement('div');
    dialog.innerHTML = `
        <div class="project-dialog">
            <div class="dialog-header">
                <h3>Create New Project</h3>
                <button class="close-dialog">&times;</button>
            </div>
            <div class="dialog-body">
                <form id="createProjectForm">
                    <div class="form-group">
                        <label for="projectName">Project Name</label>
                        <input type="text" id="projectName" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="projectDescription">Description</label>
                        <textarea id="projectDescription" name="description" rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="maxMembers">Max Members</label>
                        <input type="number" id="maxMembers" name="maxMembers" min="2" max="50" value="10">
                    </div>
                </form>
            </div>
            <div class="dialog-footer">
                <button class="btn-secondary cancel-btn">Cancel</button>
                <button class="btn-primary create-btn">Create Project</button>
            </div>
        </div>
    `;
    
    dialog.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center;
        z-index: 10001; backdrop-filter: blur(4px);
    `;
    
    const dialogBox = dialog.querySelector('.project-dialog');
    dialogBox.style.cssText = `
        background: #1e293b; border-radius: 16px; padding: 0; min-width: 400px; max-width: 500px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5); color: white;
        border: 1px solid rgba(31, 173, 130, 0.2);
    `;
    
    // Add styles for form elements
    const style = document.createElement('style');
    style.textContent = `
        .project-dialog .dialog-header {
            padding: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.1);
            display: flex; justify-content: space-between; align-items: center;
        }
        .project-dialog .dialog-body { padding: 1.5rem; }
        .project-dialog .dialog-footer {
            padding: 1rem 1.5rem; border-top: 1px solid rgba(255,255,255,0.1);
            display: flex; gap: 0.75rem; justify-content: flex-end;
        }
        .project-dialog .form-group { margin-bottom: 1rem; }
        .project-dialog label { display: block; margin-bottom: 0.5rem; color: #cbd5e1; font-weight: 500; }
        .project-dialog input, .project-dialog textarea {
            width: 100%; padding: 0.75rem; border: 1px solid rgba(255,255,255,0.2);
            background: rgba(255,255,255,0.05); border-radius: 8px; color: white;
            font-size: 0.9rem;
        }
        .project-dialog input:focus, .project-dialog textarea:focus {
            outline: none; border-color: #1fad82; box-shadow: 0 0 0 3px rgba(31, 173, 130, 0.1);
        }
        .close-dialog {
            background: none; border: none; color: #94a3b8; cursor: pointer;
            font-size: 1.5rem; padding: 0.25rem; border-radius: 4px;
        }
        .close-dialog:hover { color: white; background: rgba(255,255,255,0.1); }
        .btn-primary, .btn-secondary {
            padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 500;
            cursor: pointer; transition: all 0.2s ease; border: none;
        }
        .btn-primary { background: #1fad82; color: white; }
        .btn-primary:hover { background: #16a574; }
        .btn-secondary { background: rgba(255,255,255,0.1); color: #cbd5e1; }
        .btn-secondary:hover { background: rgba(255,255,255,0.2); }
    `;
    dialog.appendChild(style);
    
    document.body.appendChild(dialog);
    
    // Event listeners
    dialog.querySelector('.close-dialog').onclick = () => dialog.remove();
    dialog.querySelector('.cancel-btn').onclick = () => dialog.remove();
    dialog.onclick = (e) => { if (e.target === dialog) dialog.remove(); };
    
    // Create project handler
    dialog.querySelector('.create-btn').onclick = async () => {
        const form = dialog.querySelector('#createProjectForm');
        const formData = new FormData(form);
        const projectData = Object.fromEntries(formData);
        
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/teams/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Auth.getToken()}`
                },
                body: JSON.stringify(projectData)
            });
            
            if (response.ok) {
                const result = await response.json();
                dialog.remove();
                showAlert('Project created successfully! Project Code: ' + result.data.teamCode, 'success');
                if (typeof loadUserTeams === 'function') {
                    loadUserTeams(); // Reload projects
                }
            } else {
                const error = await response.json();
                showAlert('Error: ' + (error.error || 'Failed to create project'), 'error');
            }
        } catch (error) {
            console.error('Error creating project:', error);
            showAlert('Error: Failed to create project', 'error');
        }
    };
}

function showJoinProjectDialog() {
    const dialog = document.createElement('div');
    dialog.innerHTML = `
        <div class="project-dialog">
            <div class="dialog-header">
                <h3>Join Project</h3>
                <button class="close-dialog">&times;</button>
            </div>
            <div class="dialog-body">
                <form id="joinProjectForm">
                    <div class="form-group">
                        <label for="teamCode">Project Code</label>
                        <input type="text" id="teamCode" name="teamCode" placeholder="Enter project code" required 
                               style="text-transform: uppercase;" maxlength="8">
                        <small style="color: #94a3b8; margin-top: 0.5rem; display: block;">
                            Ask your project leader for the 8-character project code
                        </small>
                    </div>
                </form>
            </div>
            <div class="dialog-footer">
                <button class="btn-secondary cancel-btn">Cancel</button>
                <button class="btn-primary join-btn">Join Project</button>
            </div>
        </div>
    `;
    
    dialog.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center;
        z-index: 10001; backdrop-filter: blur(4px);
    `;
    
    const dialogBox = dialog.querySelector('.project-dialog');
    dialogBox.style.cssText = `
        background: #1e293b; border-radius: 16px; padding: 0; min-width: 400px; max-width: 500px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5); color: white;
        border: 1px solid rgba(31, 173, 130, 0.2);
    `;
    
    // Reuse the same styles
    const style = document.createElement('style');
    style.textContent = `
        .project-dialog .dialog-header {
            padding: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.1);
            display: flex; justify-content: space-between; align-items: center;
        }
        .project-dialog .dialog-body { padding: 1.5rem; }
        .project-dialog .dialog-footer {
            padding: 1rem 1.5rem; border-top: 1px solid rgba(255,255,255,0.1);
            display: flex; gap: 0.75rem; justify-content: flex-end;
        }
        .project-dialog .form-group { margin-bottom: 1rem; }
        .project-dialog label { display: block; margin-bottom: 0.5rem; color: #cbd5e1; font-weight: 500; }
        .project-dialog input {
            width: 100%; padding: 0.75rem; border: 1px solid rgba(255,255,255,0.2);
            background: rgba(255,255,255,0.05); border-radius: 8px; color: white;
            font-size: 0.9rem;
        }
        .project-dialog input:focus {
            outline: none; border-color: #1fad82; box-shadow: 0 0 0 3px rgba(31, 173, 130, 0.1);
        }
        .close-dialog {
            background: none; border: none; color: #94a3b8; cursor: pointer;
            font-size: 1.5rem; padding: 0.25rem; border-radius: 4px;
        }
        .close-dialog:hover { color: white; background: rgba(255,255,255,0.1); }
        .btn-primary, .btn-secondary {
            padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 500;
            cursor: cursor; transition: all 0.2s ease; border: none;
        }
        .btn-primary { background: #1fad82; color: white; }
        .btn-primary:hover { background: #16a574; }
        .btn-secondary { background: rgba(255,255,255,0.1); color: #cbd5e1; }
        .btn-secondary:hover { background: rgba(255,255,255,0.2); }
    `;
    dialog.appendChild(style);
    
    document.body.appendChild(dialog);
    
    // Event listeners
    dialog.querySelector('.close-dialog').onclick = () => dialog.remove();
    dialog.querySelector('.cancel-btn').onclick = () => dialog.remove();
    dialog.onclick = (e) => { if (e.target === dialog) dialog.remove(); };
    
    // Join project handler
    dialog.querySelector('.join-btn').onclick = async () => {
        const form = dialog.querySelector('#joinProjectForm');
        const formData = new FormData(form);
        const teamCode = formData.get('teamCode').toUpperCase().trim();
        
        if (!teamCode) {
            showAlert('Please enter a project code', 'warning');
            return;
        }
        
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/teams/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Auth.getToken()}`
                },
                body: JSON.stringify({ teamCode })
            });
            
            if (response.ok) {
                const result = await response.json();
                dialog.remove();
                showAlert('Successfully joined the project!', 'success');
                if (typeof loadUserTeams === 'function') {
                    loadUserTeams(); // Reload projects
                }
            } else {
                const error = await response.json();
                showAlert('Error: ' + (error.error || 'Failed to join project'), 'error');
            }
        } catch (error) {
            console.error('Error joining project:', error);
            showAlert('Error: Failed to join project', 'error');
        }
    };
}

// Deadline Management System
let deadlines = [];

function initializeDeadlineSystem() {
    console.log('initializeDeadlineSystem called'); // Debug log
    
    // Load existing deadlines from localStorage
    const savedDeadlines = localStorage.getItem('userDeadlines');
    if (savedDeadlines) {
        deadlines = JSON.parse(savedDeadlines);
        console.log('Loaded deadlines from localStorage:', deadlines); // Debug log
    } else {
        console.log('No saved deadlines found'); // Debug log
    }
    
    // Initialize calendar
    console.log('Updating calendar...'); // Debug log
    updateCalendar();
    
    // Set up calendar click handlers
    console.log('Setting up calendar handlers...'); // Debug log
    setupCalendarClickHandlers();
}

function showAddDeadlinePopup() {
    console.log('showAddDeadlinePopup called'); // Debug log
    const popup = document.getElementById('popup');
    console.log('Popup element found:', !!popup); // Debug log
    
    if (popup) {
        // Force the popup to be visible with aggressive styling
        popup.style.cssText = `
            display: block !important;
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            background: #1e293b !important;
            padding: 2rem !important;
            border-radius: 16px !important;
            box-shadow: 0 20px 60px rgba(0,0,0,0.8) !important;
            z-index: 999999999 !important;
            color: white !important;
            border: 2px solid #1fad82 !important;
            min-width: 350px !important;
            max-width: 500px !important;
            opacity: 1 !important;
            visibility: visible !important;
            pointer-events: auto !important;
        `;
        
        // Style the popup contents
        const popupInputs = popup.querySelectorAll('input, button');
        popupInputs.forEach(input => {
            if (input.type === 'text' || input.type === 'date') {
                input.style.cssText = `
                    width: 100% !important;
                    padding: 0.75rem !important;
                    margin: 0.5rem 0 !important;
                    border: 1px solid rgba(255,255,255,0.3) !important;
                    background: rgba(255,255,255,0.1) !important;
                    border-radius: 8px !important;
                    color: white !important;
                    font-size: 1rem !important;
                `;
            } else if (input.type === 'button' || input.tagName === 'BUTTON') {
                input.style.cssText = `
                    padding: 0.75rem 1.5rem !important;
                    margin: 0.5rem 0.25rem !important;
                    border: none !important;
                    border-radius: 8px !important;
                    cursor: pointer !important;
                    font-weight: 500 !important;
                    transition: all 0.2s ease !important;
                `;
                
                if (input.id === 'saveBtn') {
                    input.style.background = '#1fad82 !important';
                    input.style.color = 'white !important';
                } else {
                    input.style.background = 'rgba(255,255,255,0.2) !important';
                    input.style.color = 'white !important';
                }
            }
        });
        
        // Style the h3 title
        const title = popup.querySelector('h3');
        if (title) {
            title.style.cssText = `
                color: white !important;
                margin: 0 0 1rem 0 !important;
                font-size: 1.5rem !important;
                text-align: center !important;
            `;
        }
        
        // Clear previous inputs
        const taskInput = document.getElementById('task');
        const dateInput = document.getElementById('date');
        if (taskInput) {
            taskInput.value = '';
            console.log('Task input cleared'); // Debug log
        }
        if (dateInput) {
            dateInput.value = '';
            console.log('Date input cleared'); // Debug log
        }
        
        // Focus on task input
        setTimeout(() => {
            if (taskInput) {
                taskInput.focus();
                console.log('Task input focused'); // Debug log
            }
        }, 100);
        
        console.log('Popup should now be visible'); // Debug log
    } else {
        console.error('Popup element not found!'); // Debug log
        showAlert('Error: Popup element not found on page', 'error');
    }
}

function closePopup() {
    const popup = document.getElementById('popup');
    if (popup) {
        popup.style.display = 'none';
    }
}

function saveDeadline() {
    console.log('saveDeadline called'); // Debug log
    const taskInput = document.getElementById('task');
    const dateInput = document.getElementById('date');
    
    console.log('Task input found:', !!taskInput); // Debug log
    console.log('Date input found:', !!dateInput); // Debug log
    
    if (!taskInput || !dateInput) {
        console.error('Cannot find deadline form inputs'); // Debug log
        showAlert('Error: Cannot find deadline form inputs', 'error');
        return;
    }
    
    const task = taskInput.value.trim();
    const date = dateInput.value;
    
    console.log('Task value:', task); // Debug log
    console.log('Date value:', date); // Debug log
    
    if (!task) {
        showAlert('Please enter a task description', 'error');
        return;
    }
    
    if (!date) {
        showAlert('Please select a date', 'error');
        return;
    }
    
    // Create deadline object
    const deadline = {
        id: Date.now(),
        task: task,
        date: date,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    console.log('Creating deadline:', deadline); // Debug log
    
    // Add to deadlines array
    deadlines.push(deadline);
    
    // Save to localStorage
    localStorage.setItem('userDeadlines', JSON.stringify(deadlines));
    console.log('Saved to localStorage:', deadlines); // Debug log
    
    // Update calendar display
    updateCalendar();
    
    // Close popup
    closePopup();
    
    // Show success message
    showAlert(`Deadline "${task}" added for ${formatDate(date)}`, 'success');
}

function updateCalendar() {
    const calendarDays = document.getElementById('calendarDays');
    if (!calendarDays) return;
    
    // Get current date info
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    // Get first day of month and number of days
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();
    
    // Clear existing days
    calendarDays.innerHTML = '';
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarDays.appendChild(emptyDay);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        // Check if this day has deadlines
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayDeadlines = deadlines.filter(d => d.date === dateStr);
        
        if (dayDeadlines.length > 0) {
            dayElement.classList.add('has-deadline');
            dayElement.style.cssText = `
                background: rgba(31, 173, 130, 0.2);
                border: 2px solid #1fad82;
                color: #1fad82;
                font-weight: bold;
                cursor: pointer;
            `;
            
            // Add click handler to show deadlines
            dayElement.addEventListener('click', () => showDayDeadlines(dateStr, dayDeadlines));
        }
        
        // Highlight today
        if (day === now.getDate() && currentMonth === now.getMonth() && currentYear === now.getFullYear()) {
            dayElement.classList.add('today');
            if (!dayDeadlines.length) {
                dayElement.style.cssText = `
                    background: rgba(59, 130, 246, 0.2);
                    border: 2px solid #3b82f6;
                    color: #3b82f6;
                    font-weight: bold;
                `;
            }
        }
        
        calendarDays.appendChild(dayElement);
    }
}

function setupCalendarClickHandlers() {
    // Update calendar header with current month/year
    const calendarHeader = document.querySelector('.calendar header h3');
    if (calendarHeader) {
        const now = new Date();
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        calendarHeader.textContent = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
    }
}

function showDayDeadlines(date, dayDeadlines) {
    const modal = document.getElementById('modal');
    const taskDate = document.getElementById('taskDate');
    const taskDetail = document.getElementById('taskDetail');
    
    if (modal && taskDate && taskDetail) {
        taskDate.textContent = formatDate(date);
        
        let detailsHTML = '<div style="text-align: left;">';
        dayDeadlines.forEach((deadline, index) => {
            detailsHTML += `
                <div style="margin-bottom: 1rem; padding: 0.75rem; background: rgba(255,255,255,0.05); border-radius: 8px; border-left: 3px solid #1fad82;">
                    <div style="font-weight: bold; margin-bottom: 0.25rem;">${deadline.task}</div>
                    <div style="font-size: 0.85rem; color: #94a3b8;">
                        Added: ${formatDate(deadline.createdAt.split('T')[0])}
                        <button onclick="removeDeadline(${deadline.id})" style="
                            float: right; background: #ef4444; color: white; border: none; 
                            padding: 0.25rem 0.5rem; border-radius: 4px; cursor: pointer;
                            font-size: 0.75rem;
                        ">Remove</button>
                    </div>
                </div>
            `;
        });
        detailsHTML += '</div>';
        
        taskDetail.innerHTML = detailsHTML;
        modal.style.display = 'flex';
        
        // Close modal handler
        const closeModalBtn = document.getElementById('closeModal');
        if (closeModalBtn) {
            closeModalBtn.onclick = () => {
                modal.style.display = 'none';
            };
        }
        
        // Close on overlay click
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        };
    }
}

function removeDeadline(deadlineId) {
    deadlines = deadlines.filter(d => d.id !== deadlineId);
    localStorage.setItem('userDeadlines', JSON.stringify(deadlines));
    updateCalendar();
    
    // Close modal
    const modal = document.getElementById('modal');
    if (modal) {
        modal.style.display = 'none';
    }
    
    showAlert('Deadline removed successfully', 'success');
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
}

// Make closePopup and removeDeadline available globally
window.closePopup = closePopup;
window.removeDeadline = removeDeadline;