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