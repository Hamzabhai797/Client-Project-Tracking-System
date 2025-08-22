   document.addEventListener('DOMContentLoaded', () => {
            // Credentials with correct capitalization
            let companyCredentials = {
                name: 'fivoo',
                password: 'F3I4O6^^@fivoo.co',
                secretCode: 'cpts2025'
            };
            const companyNameDisplay = "Fivoo"; // For display purposes

            // DOM element references
            const loginPanel = document.getElementById('login-panel');
            const companyPanel = document.getElementById('company-panel');
            const clientPanel = document.getElementById('client-panel');
            const companyLoginBtn = document.getElementById('company-login-btn');
            const clientViewBtn = document.getElementById('client-view-btn');
            
            // Login form elements
            const companyLoginForm = document.getElementById('company-login-form');
            const companyAuthForm = document.getElementById('company-auth-form');
            const companyNameInput = document.getElementById('company-name');
            const companyPasswordInput = document.getElementById('company-password');
            const secretCodeInput = document.getElementById('secret-code');
            
            // New credentials update form elements
            const updateCredentialsForm = document.getElementById('update-credentials-form');
            const newCompanyNameInput = document.getElementById('new-company-name');
            const newCompanyPasswordInput = document.getElementById('new-company-password');
            const newSecretCodeInput = document.getElementById('new-secret-code');
            
            const logoutBtn = document.getElementById('logout-btn');
            const clientBackBtn = document.getElementById('client-back-btn');

            const addProjectForm = document.getElementById('add-project-form');
            const addProjectNameInput = document.getElementById('add-project-name');
            const addClientNameInput = document.getElementById('add-client-name');
            const addTrackingNumberInput = document.getElementById('add-tracking-number');
            const addStatusSelect = document.getElementById('add-project-status');
            const companyProjectTableBody = document.getElementById('company-project-table-body');
            const noProjectsMessageCompany = document.getElementById('no-projects-message-company');
            const projectListContainer = document.getElementById('project-list-container');


            const updateProjectForm = document.getElementById('update-project-form');
            const updateTrackingNumberInput = document.getElementById('update-tracking-number');
            const updateCompletionInput = document.getElementById('update-completion');
            const dailyProgressInputs = {
                mon: document.getElementById('mon'),
                tue: document.getElementById('tue'),
                wed: document.getElementById('wed'),
                thu: document.getElementById('thu'),
                fri: document.getElementById('fri'),
                sat: document.getElementById('sat'),
                sun: document.getElementById('sun')
            };

            const clientSearchInput = document.getElementById('client-search-input');
            const clientSearchButton = document.getElementById('client-search-button');
            const clientProjectDetails = document.getElementById('client-project-details');
            const clientNameDisplay = document.getElementById('client-name-display');
            const projectNameDisplay = document.getElementById('project-name-display');
            const trackingIdDisplay = document.getElementById('tracking-id-display');
            const completionChartContainer = document.getElementById('completion-chart-container');
            const completionText = document.getElementById('completion-text');
            const weeklyProgressChart = document.getElementById('weekly-progress-chart');
            const noClientProjectMessage = document.getElementById('no-client-project-message');

            const messageModal = document.getElementById('message-modal');
            const modalMessage = document.getElementById('modal-message');
            const closeButton = document.querySelector('.close-button');

            let projects = [];

            // --- Utility Functions ---

            /**
             * Shows the modal with a given message and automatically closes it after a delay.
             * @param {string} message The message to display.
             * @param {number} duration The time in milliseconds before the modal closes.
             */
            function showModal(message, duration = 3000) {
                modalMessage.textContent = message;
                messageModal.style.display = 'flex';
                setTimeout(() => {
                    closeModal();
                }, duration);
            }

            /**
             * Closes the modal.
             */
            function closeModal() {
                messageModal.style.display = 'none';
            }

            /**
             * Switches the active panel.
             * @param {string} panelId The ID of the panel to activate.
             */
            function switchPanel(panelId) {
                loginPanel.classList.remove('active');
                companyPanel.classList.remove('active');
                clientPanel.classList.remove('active');
                document.getElementById(panelId).classList.add('active');
            }

            // --- Local Storage Operations ---

            /**
             * Loads projects from local storage.
             */
            function loadData() {
                try {
                    const storedProjects = localStorage.getItem('cptsProjects');
                    if (storedProjects) {
                        projects = JSON.parse(storedProjects);
                    }
                    const storedCredentials = localStorage.getItem('cptsCredentials');
                    if (storedCredentials) {
                        companyCredentials = JSON.parse(storedCredentials);
                    }
                } catch (e) {
                    console.error("Could not load data from local storage", e);
                }
            }

            /**
             * Saves projects to local storage.
             */
            function saveProjects() {
                try {
                    localStorage.setItem('cptsProjects', JSON.stringify(projects));
                } catch (e) {
                    console.error("Could not save projects to local storage", e);
                }
            }
            
            /**
             * Saves credentials to local storage.
             */
            function saveCredentials() {
                try {
                    localStorage.setItem('cptsCredentials', JSON.stringify(companyCredentials));
                } catch (e) {
                    console.error("Could not save credentials to local storage", e);
                }
            }

            // --- Rendering and UI Logic ---

            /**
             * Renders the project list on the company panel.
             */
            function renderCompanyProjects() {
                companyProjectTableBody.innerHTML = '';
                if (projects.length === 0) {
                    noProjectsMessageCompany.style.display = 'block';
                } else {
                    noProjectsMessageCompany.style.display = 'none';
                    projects.forEach(project => {
                        const row = document.createElement('tr');
                        row.dataset.projectId = project.id;

                        const displayId = project.id.length > 10 ? `${project.id.slice(0, 8)}...` : project.id;
                        row.innerHTML = `
                            <td>${displayId}</td>
                            <td>${project.name}</td>
                            <td>${project.client}</td>
                            <td>
                                <select class="status-dropdown status-${project.status.replace('-', '')}" data-project-id="${project.id}">
                                    <option value="pending" ${project.status === 'pending' ? 'selected' : ''}>Pending</option>
                                    <option value="in-progress" ${project.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                                    <option value="completed" ${project.status === 'completed' ? 'selected' : ''}>Completed</option>
                                </select>
                            </td>
                            <td>
                                <button class="action-button" data-action="delete" data-project-id="${project.id}">Delete</button>
                            </td>
                        `;
                        companyProjectTableBody.appendChild(row);
                    });
                }
            }
            
            /**
             * Renders a single project's details on the client panel.
             * @param {Object} project The project object to display.
             */
            function renderClientProjectDetails(project) {
                if (!project) {
                    clientProjectDetails.style.display = 'none';
                    noClientProjectMessage.style.display = 'block';
                    return;
                }
                
                noClientProjectMessage.style.display = 'none';
                clientProjectDetails.style.display = 'block';

                clientNameDisplay.textContent = project.client;
                projectNameDisplay.textContent = project.name;
                trackingIdDisplay.textContent = project.id;
                
                renderCompletionChart(project.completion);
                renderWeeklyProgressChart(project.dailyProgress);
            }

            /**
             * Renders the circular completion chart with a colorful, professional style.
             * @param {number} completion The completion percentage (0-100).
             */
            function renderCompletionChart(completion) {
                const percentage = Math.max(0, Math.min(100, completion));
                completionText.textContent = `${percentage}%`;
                
                // Define colors for the chart segments
                const color1 = '#4A90E2'; // Blue
                const color2 = '#50E3C2'; // Green
                const color3 = '#F5A623'; // Orange
                const color4 = '#9013FE'; // Purple
                
                let gradient = '';
                if (percentage === 100) {
                    gradient = `${color2} 100%`;
                } else if (percentage > 75) {
                    gradient = `${color2} ${percentage}%, ${color3} 0%`;
                } else if (percentage > 50) {
                    gradient = `${color3} ${percentage}%, ${color4} 0%`;
                } else {
                    gradient = `${color1} ${percentage}%, var(--secondary-color) 0%`;
                }

                completionChartContainer.style.background = `conic-gradient(${gradient})`;
            }

            /**
             * Renders the weekly progress bar chart in percentages with colorful bars.
             * @param {Object} progress An object with daily progress values (in hours).
             */
            function renderWeeklyProgressChart(progress) {
                weeklyProgressChart.innerHTML = '';
                const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                const maxHoursPerDay = 8;
                const colors = ['#2ECC71', '#3498DB', '#9B59B6', '#E74C3C', '#F39C12', '#1ABC9C', '#34495E'];
                
                days.forEach((day, index) => {
                    const dayKey = day.toLowerCase().slice(0, 3);
                    const hours = progress[dayKey] || 0;
                    const percentage = Math.round((hours / maxHoursPerDay) * 100);
                    
                    const barRow = document.createElement('div');
                    barRow.className = 'bar-chart-row';
                    barRow.innerHTML = `
                        <span class="bar-chart-label">${day}</span>
                        <div class="bar-chart-bar-bg">
                            <div class="bar-chart-bar" style="width: ${percentage}%; background-color: ${colors[index]}"></div>
                        </div>
                        <span class="bar-chart-value">${percentage}%</span>
                    `;
                    weeklyProgressChart.appendChild(barRow);
                });
            }

            // --- Event Handlers ---

            // Handles revealing the company login form
            companyLoginBtn.addEventListener('click', () => {
                companyLoginForm.style.display = 'block';
            });

            // Handles form submission for company login
            companyAuthForm.addEventListener('submit', (event) => {
                event.preventDefault();
                const companyName = companyNameInput.value.trim().toLowerCase();
                const password = companyPasswordInput.value.trim();
                const secretCode = secretCodeInput.value.trim().toLowerCase();

                if (companyName === companyCredentials.name &&
                    password === companyCredentials.password &&
                    secretCode === companyCredentials.secretCode) {
                    
                    switchPanel('company-panel');
                    renderCompanyProjects();
                    showModal(`Logged in to ${companyNameDisplay}.`);
                    companyAuthForm.reset();
                    companyLoginForm.style.display = 'none';
                } else {
                    showModal("Invalid credentials. Please try again.");
                }
            });

            // Handles form submission for updating credentials
            updateCredentialsForm.addEventListener('submit', (event) => {
                event.preventDefault();
                const newName = newCompanyNameInput.value.trim().toLowerCase();
                const newPassword = newCompanyPasswordInput.value.trim();
                const newSecretCode = newSecretCodeInput.value.trim().toLowerCase();
                
                companyCredentials = {
                    name: newName,
                    password: newPassword,
                    secretCode: newSecretCode
                };
                
                saveCredentials();
                showModal("Credentials updated successfully! Please remember these for your next login.");
                updateCredentialsForm.reset();
            });

            clientViewBtn.addEventListener('click', () => {
                switchPanel('client-panel');
            });
            
            logoutBtn.addEventListener('click', () => {
                switchPanel('login-panel');
                showModal("Logged out successfully.");
            });

            clientBackBtn.addEventListener('click', () => {
                switchPanel('login-panel');
                // Clear any displayed client info
                clientProjectDetails.style.display = 'none';
                noClientProjectMessage.style.display = 'none';
                clientSearchInput.value = '';
            });

            // Handles the form submission for adding a new project (Company Panel)
            addProjectForm.addEventListener('submit', (event) => {
                event.preventDefault();

                const projectName = addProjectNameInput.value.trim();
                const clientName = addClientNameInput.value.trim();
                const trackingNumber = addTrackingNumberInput.value.trim();
                const status = addStatusSelect.value;
                const projectId = trackingNumber || crypto.randomUUID();

                if (!projectName || !clientName) {
                    showModal("Please fill out all fields.");
                    return;
                }

                if (trackingNumber && projects.some(p => p.id === trackingNumber)) {
                    showModal(`The tracking number "${trackingNumber}" already exists.`);
                    return;
                }

                const newProject = {
                    id: projectId,
                    name: projectName,
                    client: clientName,
                    status: status,
                    completion: 0,
                    dailyProgress: { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 }
                };

                projects.push(newProject);
                saveProjects();
                renderCompanyProjects();
                
                addProjectForm.reset();
                showModal("Project added successfully!");
            });

            // Handles the form submission for updating a project (Company Panel)
            updateProjectForm.addEventListener('submit', (event) => {
                event.preventDefault();

                const trackingNumber = updateTrackingNumberInput.value.trim();
                let completion = parseInt(updateCompletionInput.value, 10);
                
                // Ensure completion is within 0-100
                completion = Math.max(0, Math.min(100, completion));
                
                const dailyProgress = {
                    mon: parseInt(dailyProgressInputs.mon.value, 10) || 0,
                    tue: parseInt(dailyProgressInputs.tue.value, 10) || 0,
                    wed: parseInt(dailyProgressInputs.wed.value, 10) || 0,
                    thu: parseInt(dailyProgressInputs.thu.value, 10) || 0,
                    fri: parseInt(dailyProgressInputs.fri.value, 10) || 0,
                    sat: parseInt(dailyProgressInputs.sat.value, 10) || 0,
                    sun: parseInt(dailyProgressInputs.sun.value, 10) || 0
                };

                const projectToUpdate = projects.find(p => p.id === trackingNumber);

                if (!projectToUpdate) {
                    showModal("No project found with that tracking number.");
                    return;
                }
                
                projectToUpdate.completion = completion;
                projectToUpdate.dailyProgress = dailyProgress;
                
                // Automatically update status based on completion
                if (completion === 100) {
                    projectToUpdate.status = 'completed';
                } else if (completion > 0) {
                    projectToUpdate.status = 'in-progress';
                } else {
                    projectToUpdate.status = 'pending';
                }

                saveProjects();
                renderCompanyProjects(); // Re-render to show updated status
                showModal(`Project "${projectToUpdate.name}" updated successfully!`);
            });

            // Handles delete and status change actions for the company table
            companyProjectTableBody.addEventListener('click', (event) => {
                const target = event.target;
                const projectId = target.dataset.projectId;

                if (target.dataset.action === 'delete') {
                    if (projectId) {
                        try {
                            const initialProjectCount = projects.length;
                            projects = projects.filter(project => project.id !== projectId);
                            saveProjects();
                            if (projects.length < initialProjectCount) {
                                renderCompanyProjects();
                                showModal("Project deleted successfully.");
                            } else {
                                // This block will run if the project was not found by the filter.
                                showModal("Could not find project to delete.");
                            }
                        } catch (e) {
                            showModal("An error occurred during deletion. Please try again.");
                            console.error("Deletion error:", e);
                        }
                    }
                }
            });
            
            companyProjectTableBody.addEventListener('change', (event) => {
                const target = event.target;
                if (!target.classList.contains('status-dropdown')) return;

                const projectId = target.dataset.projectId;
                const newStatus = target.value;
                
                const projectToUpdate = projects.find(p => p.id === projectId);
                if (projectToUpdate) {
                    projectToUpdate.status = newStatus;
                    saveProjects();
                    showModal(`Status updated for project "${projectToUpdate.name}"`);
                }
            });

            // Handles the search button click (Client Panel)
            clientSearchButton.addEventListener('click', () => {
                const searchTerm = clientSearchInput.value.trim();
                const foundProject = projects.find(p => p.id === searchTerm);
                renderClientProjectDetails(foundProject);
            });
            
            // Allow searching on enter key press
            clientSearchInput.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    clientSearchButton.click();
                }
            });

            // Handle modal close events
            closeButton.addEventListener('click', closeModal);
            window.addEventListener('click', (event) => {
                if (event.target === messageModal) {
                    closeModal();
                }
            });
            
            // Initial load
            loadData();
        });