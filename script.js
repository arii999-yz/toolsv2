// ---------- LOGIN LOGIC ----------
        const correctUsername = 'ngl';
        const correctPassword = '12';
        const loginOverlay = document.getElementById('loginOverlay');
        const loginCard = document.getElementById('loginCard');
        const loginUsername = document.getElementById('loginUsername');
        const loginPassword = document.getElementById('loginPassword');
        const btnLogin = document.getElementById('btnLogin');
        const loginFeedback = document.getElementById('loginFeedback');
        const appContainer = document.getElementById('appContainer');
        
        // Input validation indicators
        loginUsername.addEventListener('input', validateUsername);
        loginPassword.addEventListener('input', validatePassword);
        
        function validateUsername() {
            const checkIcon = loginUsername.nextElementSibling;
            if (loginUsername.value.trim() === correctUsername) {
                checkIcon.style.display = 'block';
                checkIcon.style.color = '#4caf50';
            } else {
                checkIcon.style.display = 'none';
            }
        }
        
        function validatePassword() {
            const checkIcon = loginPassword.nextElementSibling;
            if (loginPassword.value.trim() === correctPassword) {
                checkIcon.style.display = 'block';
                checkIcon.style.color = '#4caf50';
            } else {
                checkIcon.style.display = 'none';
            }
        }
        
        // Small helper to show message
        function flashMessage(text, type) {
            loginFeedback.innerHTML = text;
            loginFeedback.classList.remove('feedback-success','feedback-error');
            if (type === 'success') {
                loginFeedback.classList.add('feedback-success');
            } else if (type === 'error') {
                loginFeedback.classList.add('feedback-error');
            }
        }
        
        // Login flow
        btnLogin.addEventListener('click', tryLogin);
        
        // Enter to submit
        [loginUsername, loginPassword].forEach(el => {
            el.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') tryLogin();
            });
        });
        
        function tryLogin() {
            // read values (trim)
            const user = loginUsername.value.trim();
            const pass = loginPassword.value.trim();
            
            // simple validation
            if (!user || !pass) {
                flashMessage('⚠️ Isi username dan password dulu', 'error');
                shakeCard();
                return;
            }
            
            // simulate small delay for UX
            btnLogin.disabled = true;
            btnLogin.innerHTML = '<span class="spinner"></span> Memeriksa...';
            flashMessage('Memeriksa kredensial ... ⏳', 'success');
            
            setTimeout(() => {
                if (user === correctUsername && pass === correctPassword) {
                    // success
                    flashMessage('✔️ Akses diterima — Selamat datang! 🎉', 'success');
                    animateSuccessThenEnter();
                } else {
                    // fail
                    flashMessage('❌ Akses ditolak — username atau password salah', 'error');
                    shakeCard();
                    btnLogin.disabled = false;
                    btnLogin.innerHTML = '<i class="fas fa-sign-in-alt"></i> Masuk';
                }
            }, 1200);
        }
        
        function shakeCard() {
            loginCard.classList.remove('shake');
            // trigger reflow to restart animation
            void loginCard.offsetWidth;
            loginCard.classList.add('shake');
        }
        
        function animateSuccessThenEnter() {
            // small celebration effect then hide overlay and show app
            loginCard.style.transform = 'scale(0.98)';
            setTimeout(() => {
                loginCard.style.transform = 'scale(.8) translateY(-20px)';
                loginCard.style.opacity = '0';
                
                setTimeout(() => {
                    loginOverlay.classList.add('login-hidden');
                    appContainer.style.display = 'flex';
                    
                    // Initialize floating icons for the main app
                    initializeFloatingIcons();
                    
                    // Initialize traffic chart
                    initTrafficChart();
                    
                    // Initialize stats
                    updateStats();
                    
                    // Initialize templates
                    loadTemplates();
                    
                    // Focus first input in the app for convenience
                    const firstInput = document.querySelector('#nglLink');
                    if (firstInput) firstInput.focus();
                }, 380);
            }, 500);
        }
        
        // ensure focus on username initially
        loginUsername.focus();
        
        // ---------- SETTINGS MENU ----------
        const settingsToggle = document.getElementById('settingsToggle');
        const settingsDropdown = document.getElementById('settingsDropdown');
        const templatesMenu = document.getElementById('templatesMenu');
        const clearHistoryMenu = document.getElementById('clearHistoryMenu');
        const importLogMenu = document.getElementById('importLogMenu');
        const shortcutMenu = document.getElementById('shortcutMenu');
        
        settingsToggle.addEventListener('click', () => {
            settingsDropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!settingsToggle.contains(e.target) && !settingsDropdown.contains(e.target)) {
                settingsDropdown.classList.remove('active');
            }
        });
        
        // Templates menu
        templatesMenu.addEventListener('click', () => {
            settingsDropdown.classList.remove('active');
            document.getElementById('templatesModal').classList.add('active');
        });
        
        // Clear history menu
        clearHistoryMenu.addEventListener('click', () => {
            settingsDropdown.classList.remove('active');
            if (confirm('Apakah Anda yakin ingin menghapus semua history?')) {
                document.getElementById('results').innerHTML = '';
                showNotification('History berhasil dihapus', 'success');
            }
        });
        
        // Import log menu
        importLogMenu.addEventListener('click', () => {
            settingsDropdown.classList.remove('active');
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json,.txt,.log';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        try {
                            const content = event.target.result;
                            document.getElementById('results').innerHTML += `<div class="message"><i class="fas fa-file-import"></i> Log diimpor: ${file.name}</div>`;
                            showNotification('Log berhasil diimpor', 'success');
                        } catch (error) {
                            showNotification('Gagal mengimpor log: ' + error.message, 'error');
                        }
                    };
                    reader.readAsText(file);
                }
            };
            input.click();
        });
        
        // Keyboard shortcut menu
        shortcutMenu.addEventListener('click', () => {
            settingsDropdown.classList.remove('active');
            document.getElementById('shortcutsModal').classList.add('active');
        });
        
        // Close modals
        document.getElementById('closeTemplatesModal').addEventListener('click', () => {
            document.getElementById('templatesModal').classList.remove('active');
        });
        
        document.getElementById('closeShortcutsModal').addEventListener('click', () => {
            document.getElementById('shortcutsModal').classList.remove('active');
        });
        
        // Close modals when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
        
        // Templates functionality
        let templates = JSON.parse(localStorage.getItem('nglTemplates')) || [
            "Hai, apa kabar?",
            "Kamu cantik hari ini",
            "Mau berteman?",
            "Ada yang ingin aku tanyakan"
        ];
        
        function loadTemplates() {
            const templateList = document.getElementById('templateList');
            templateList.innerHTML = '';
            
            templates.forEach((template, index) => {
                const templateItem = document.createElement('div');
                templateItem.className = 'template-item';
                templateItem.innerHTML = `
                    <div class="template-text">${template}</div>
                    <div class="template-actions">
                        <button class="btn-small use" data-index="${index}">Gunakan</button>
                        <button class="btn-small delete" data-index="${index}">Hapus</button>
                    </div>
                `;
                templateList.appendChild(templateItem);
            });
            
            // Add event listeners
            document.querySelectorAll('.btn-small.use').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = e.target.getAttribute('data-index');
                    document.getElementById('message').value = templates[index];
                    document.getElementById('templatesModal').classList.remove('active');
                    showNotification('Template digunakan', 'success');
                });
            });
            
            document.querySelectorAll('.btn-small.delete').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = e.target.getAttribute('data-index');
                    if (confirm('Apakah Anda yakin ingin menghapus template ini?')) {
                        templates.splice(index, 1);
                        localStorage.setItem('nglTemplates', JSON.stringify(templates));
                        loadTemplates();
                        showNotification('Template dihapus', 'success');
                    }
                });
            });
        }
        
        document.getElementById('addTemplateBtn').addEventListener('click', () => {
            const newTemplate = document.getElementById('newTemplate').value.trim();
            if (newTemplate) {
                templates.push(newTemplate);
                localStorage.setItem('nglTemplates', JSON.stringify(templates));
                document.getElementById('newTemplate').value = '';
                loadTemplates();
                showNotification('Template ditambahkan', 'success');
            }
        });
        
        // Notification helper
        function showNotification(message, type) {
            const notification = document.createElement('div');
            notification.className = `message ${type}`;
            notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
            document.getElementById('results').appendChild(notification);
            document.getElementById('results').scrollTop = document.getElementById('results').scrollHeight;
            
            // Auto remove after 3 seconds
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl + Enter: Start sending
            if (e.ctrlKey && e.key === 'Enter' && !document.getElementById('startBtn').disabled) {
                e.preventDefault();
                startSpamming();
            }
            
            // Ctrl + .: Stop sending
            if (e.ctrlKey && e.key === '.' && !document.getElementById('stopBtn').disabled) {
                e.preventDefault();
                stopSpamming();
            }
            
            // Ctrl + D: Clear results
            if (e.ctrlKey && e.key === 'd') {
                e.preventDefault();
                document.getElementById('results').innerHTML = '';
            }
            
            // Ctrl + ,: Open settings
            if (e.ctrlKey && e.key === ',') {
                e.preventDefault();
                settingsDropdown.classList.toggle('active');
            }
            
            // Ctrl + L: Focus NGL Link
            if (e.ctrlKey && e.key === 'l') {
                e.preventDefault();
                document.getElementById('nglLink').focus();
            }
            
            // Ctrl + M: Focus Message
            if (e.ctrlKey && e.key === 'm') {
                e.preventDefault();
                document.getElementById('message').focus();
            }
        });
        
        // ---------- MAIN APP FUNCTIONALITY ----------
        
        // Floating icons background
        const icons = [
            '<svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M20 2H4C2.9 2 2,2.9 2 4V22L6 18H20C21.1 18 22,17.1 22 16V4C22,2.9 21.1,2 20 2ZM20 16H6L4 18V4H20V16Z"/><path d="M6 8H18V10H6V8Z"/><path d="M6 12H16V14H6V12Z"/></svg>',
            '<svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>',
            '<svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2,6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22,17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4,16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20,7.58 20 12C20 16.42 16.42 20 12 20Z"/><path d="M12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z"/></svg>',
            '<svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2,6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22,17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L16.59 7.58L19 8L10 17Z"/></svg>',
            '<svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7V12C2 16.5 4.23 20.68 7.62 23.15L12 25L16.38 23.15C19.77 20.68 22 16.5 22 12V7L12 2ZM12 23L9 21.5C6.03 19.32 4 15.67 4 12V8.5L12 4.5L20 8.5V12C20 15.67 17.97 19.32 15 21.5L12 23Z"/><path d="M10 17L5 12L6.41 10.59L10 14.17L16.59 7.58L18 9L10 17Z"/></svg>',
            '<svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V9H19V20Z"/></svg>',
            '<svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2,6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22,17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z"/></svg>',
            '<svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2,6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22,17.52 22 12C22 6.48 17.52 2 12 2ZM17 13H7V11H17V13Z"/></svg>',
            '<svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.2L4.8 12L3.4 13.4L9 19L21 7L19.6 5.6L9 16.2Z"/></svg>',
            '<svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2,6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L16.59 7.58L18 9L10 17Z"/></svg>'
        ];
        
        function initializeFloatingIcons() {
            const floatingIconsContainer = document.getElementById('floatingIcons');
            
            function createFloatingIcon() {
                const icon = document.createElement('div');
                icon.className = 'floating-icon';
                icon.innerHTML = icons[Math.floor(Math.random() * icons.length)];
                icon.style.left = Math.random() * 100 + '%';
                icon.style.animationDuration = (Math.random() * 20 + 10) + 's';
                icon.style.animationDelay = Math.random() * 5 + 's';
                floatingIconsContainer.appendChild(icon);
                
                // Remove icon after animation completes
                setTimeout(() => {
                    icon.remove();
                }, 30000);
            }
            
            // Create initial floating icons
            for (let i = 0; i < 15; i++) {
                setTimeout(() => createFloatingIcon(), i * 300);
            }
            
            // Continue creating floating icons
            setInterval(createFloatingIcon, 2000);
        }
        
        // Traffic chart functionality
        const maxBars = 50;
        let trafficData = [];
        let trafficBars = [];
        let trafficInterval;
        let peakRate = 0;
        let totalMessages = 0;
        let startTime;
        
        function initTrafficChart() {
            const chart = document.getElementById('trafficChart');
            
            // Create initial bars
            for (let i = 0; i < maxBars; i++) {
                const bar = document.createElement('div');
                bar.className = 'traffic-bar';
                bar.style.left = `${i * (100 / maxBars)}%`;
                bar.style.height = '0%';
                chart.appendChild(bar);
                trafficBars.push(bar);
                trafficData.push(0);
            }
        }
        
        function updateTrafficChart() {
            if (!isRunning) return;
            
            // Shift data to the left
            trafficData.shift();
            trafficData.push(0);
            
            // Update bars
            for (let i = 0; i < maxBars; i++) {
                const height = Math.min(100, trafficData[i] * 20); // Scale for visibility
                trafficBars[i].style.height = `${height}%`;
            }
        }
        
        function recordMessageSent() {
            if (!isRunning) return;
            
            // Increment the current bar
            trafficData[trafficData.length - 1]++;
            
            // Calculate current rate (messages per second)
            const currentTime = Date.now();
            const elapsedSeconds = (currentTime - startTime) / 1000;
            const currentRate = elapsedSeconds > 0 ? Math.round(totalMessages / elapsedSeconds) : 0;
            
            // Update peak rate
            if (currentRate > peakRate) {
                peakRate = currentRate;
                document.getElementById('peakRate').textContent = peakRate;
            }
            
            // Update current rate
            document.getElementById('currentRate').textContent = currentRate;
            
            // Calculate and update average rate
            const avgRate = elapsedSeconds > 0 ? Math.round(totalMessages / elapsedSeconds) : 0;
            document.getElementById('avgRate').textContent = avgRate;
        }
        
        function startTrafficMonitoring() {
            // Reset data
            trafficData = new Array(maxBars).fill(0);
            peakRate = 0;
            totalMessages = 0;
            startTime = Date.now();
            
            // Reset UI
            document.getElementById('currentRate').textContent = '0';
            document.getElementById('peakRate').textContent = '0';
            document.getElementById('avgRate').textContent = '0';
            
            // Show traffic container
            document.getElementById('trafficContainer').style.display = 'block';
            
            // Start updating chart
            trafficInterval = setInterval(updateTrafficChart, 100);
        }
        
        function stopTrafficMonitoring() {
            if (trafficInterval) {
                clearInterval(trafficInterval);
                trafficInterval = null;
            }
        }
        
        // Stats functionality
        let stats = JSON.parse(localStorage.getItem('nglStats')) || {
            totalMessages: 0,
            totalSessions: 0,
            successfulMessages: 0
        };
        
        function updateStats() {
            document.getElementById('totalMessages').textContent = stats.totalMessages;
            document.getElementById('totalSessions').textContent = stats.totalSessions;
            
            const avgMessages = stats.totalSessions > 0 ? Math.round(stats.totalMessages / stats.totalSessions) : 0;
            document.getElementById('avgMessages').textContent = avgMessages;
            
            const successRate = stats.totalMessages > 0 ? Math.round((stats.successfulMessages / stats.totalMessages) * 100) : 0;
            document.getElementById('successRate').textContent = successRate + '%';
        }
        
        function saveStats() {
            localStorage.setItem('nglStats', JSON.stringify(stats));
            updateStats();
        }
        
        // Main functionality
        let isRunning = false;
        let stopRequested = false;
        let counter = 0;
        let totalSent = 0;
        
        document.getElementById('startBtn').addEventListener('click', startSpamming);
        document.getElementById('stopBtn').addEventListener('click', stopSpamming);
        
        async function startSpamming() {
            const nglLink = document.getElementById('nglLink').value.trim();
            const message = document.getElementById('message').value.trim();
            const delay = parseInt(document.getElementById('delay').value);
            const count = parseInt(document.getElementById('count').value);
            const mode = document.getElementById('mode').value;
            
            if (!nglLink || !message || isNaN(delay) || delay < 100 || isNaN(count) || count < 1) {
                alert('⚠️ Mohon isi semua bidang dengan benar!\nMinimum delay: 100ms\nMinimum count: 1');
                return;
            }
            
            let username;
            try {
                const url = new URL(nglLink);
                username = url.pathname.split('/')[1];
                if (!username) throw new Error();
            } catch (e) {
                alert('❌ Link NGL tidak valid!\nFormat yang benar: https://ngl.link/username');
                return;
            }
            
            // Update stats
            stats.totalSessions++;
            saveStats();
            
            // UI Setup
            isRunning = true;
            stopRequested = false;
            counter = 0;
            totalSent = 0;
            document.getElementById('startBtn').disabled = true;
            document.getElementById('stopBtn').disabled = false;
            document.getElementById('actionStatus').textContent = 'Mengirim pesan...';
            
            // Update message info
            document.getElementById('targetValue').textContent = username;
            document.getElementById('messageValue').textContent = message.length > 30 ? 
                message.substring(0, 30) + '...' : message;
            
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '<div class="message"><svg class="message-icon" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7V12C2 16.5 4.23 20.68 7.62 23.15L12 25L16.38 23.15C19.77 20.68 22 16.5 22 12V7L12 2ZM12 23L9 21.5C6.03 19.32 4 15.67 4 12V8.5L12 4.5L20 8.5V12C20 15.67 17.97 19.32 15 21.5L12 23Z"/><path d="M10 17L5 12L6.41 10.59L10 14.17L16.59 7.58L18 9L10 17Z"/></svg> Memulai spam ke ' + username + '...</div>';
            
            const previewArea = document.getElementById('previewArea');
            previewArea.classList.add('active');
            
            // Start traffic monitoring
            startTrafficMonitoring();
            
            while (isRunning && !stopRequested && counter < count) {
                counter++;
                try {
                    const timestamp = new Date().toLocaleTimeString();
                    
                    // Create message element
                    const msgElement = document.createElement('div');
                    msgElement.className = 'message';
                    msgElement.innerHTML = `<svg class="message-icon" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M11.99 2C6.47 2 2,6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22,17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4,16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20,7.58 20 12C20 16.42 16.42 20 12 20Z"/><path d="M12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z"/></svg> ${counter} - ${timestamp} - Mengirim...`;
                    resultsDiv.appendChild(msgElement);
                    
                    // Generate unique device ID
                    const deviceId = 'anon-' + Math.random().toString(36).substr(2, 9) + Date.now();
                    
                    // Send request
                    if (mode === 'real') {
                        const response = await fetch('https://ngl.link/api/submit', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                            body: `username=${encodeURIComponent(username)}&question=${encodeURIComponent(message)}&deviceId=${deviceId}&gameSlug=&referrer=`
                        });
                        
                        const data = await response.json();
                        
                        if (response.ok && data.success) {
                            msgElement.classList.add('success');
                            msgElement.innerHTML = `<svg class="message-icon" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.2L4.8 12L3.4 13.4L9 19L21 7L19.6 5.6L9 16.2Z"/></svg> ${counter} - ${timestamp} - Berhasil terkirim!`;
                            totalSent++;
                            totalMessages++;
                            stats.totalMessages++;
                            stats.successfulMessages++;
                            saveStats();
                            recordMessageSent();
                        } else {
                            throw new Error(data.message || 'Gagal mengirim');
                        }
                    } else {
                        // Simulation mode
                        await new Promise(resolve => setTimeout(resolve, 500));
                        msgElement.classList.add('success');
                        msgElement.innerHTML = `<svg class="message-icon" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.2L4.8 12L3.4 13.4L9 19L21 7L19.6 5.6L9 16.2Z"/></svg> ${counter} - ${timestamp} - Simulasi berhasil!`;
                        totalSent++;
                        totalMessages++;
                        stats.totalMessages++;
                        stats.successfulMessages++;
                        saveStats();
                        recordMessageSent();
                    }
                } catch (error) {
                    const errorElement = document.querySelector('#results div:last-child');
                    errorElement.classList.add('error');
                    errorElement.innerHTML = `<svg class="message-icon" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2,6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22,17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z"/></svg> ${counter} - Error: ${error.message || 'Kesalahan tidak diketahui'}`;
                    stats.totalMessages++;
                    saveStats();
                }
                
                // Update progress
                document.getElementById('progressSent').textContent = totalSent;
                
                // Add counter
                const counterElement = document.createElement('div');
                counterElement.className = 'counter';
                counterElement.innerHTML = `<svg class="label-icon" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M16 6L18.29 8.29L13.41 13.17L9.41 9.17L2 16.59L3.41 18L9.41 12L13.41 16L19.71 9.71L22 12V6H16Z"/></svg> Terkirim: ${totalSent} pesan dari ${counter} percobaan`;
                resultsDiv.appendChild(counterElement);
                
                // Scroll to bottom
                resultsDiv.scrollTop = resultsDiv.scrollHeight;
                
                // Delay
                if (!stopRequested && counter < count) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
            
            // Final status
            const finalElement = document.createElement('div');
            finalElement.className = 'message';
            if (stopRequested) {
                finalElement.innerHTML = `<svg class="message-icon" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M6 6H18V18H6V6Z"/></svg> DIHENTIKAN - Total: ${totalSent} pesan terkirim dari ${counter} percobaan`;
            } else {
                finalElement.innerHTML = `<svg class="message-icon" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7V12C2 16.5 4.23 20.68 7.62 23.15L12 25L16.38 23.15C19.77 20.68 22 16.5 22 12V7L12 2ZM12 23L9 21.5C6.03 19.32 4 15.67 4 12V8.5L12 4.5L20 8.5V12C20 15.67 17.97 19.32 15 21.5L12 23Z"/><path d="M10 17L5 12L6.41 10.59L10 14.17L16.59 7.58L18 9L10 17Z"/></svg> SELESAI - Total: ${totalSent} pesan terkirim dari ${counter} percobaan`;
            }
            resultsDiv.appendChild(finalElement);
            resultsDiv.scrollTop = resultsDiv.scrollHeight;
            
            // Update status
            document.getElementById('actionStatus').textContent = stopRequested ? 'Dihentikan' : 'Selesai';
            
            // Reset UI
            isRunning = false;
            document.getElementById('startBtn').disabled = false;
            document.getElementById('stopBtn').disabled = true;
            
            // Stop traffic monitoring
            stopTrafficMonitoring();
            
            // Remove active class from preview area
            setTimeout(() => {
                previewArea.classList.remove('active');
            }, 2000);
        }
        
        function stopSpamming() {
            if (isRunning) {
                stopRequested = true;
                document.getElementById('stopBtn').disabled = true;
                document.getElementById('actionStatus').textContent = 'Menghentikan...';
                const resultsDiv = document.getElementById('results');
                resultsDiv.innerHTML += '<div class="message"><svg class="message-icon" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M6 6H18V18H6V6Z"/></svg> Menghentikan setelah ' + counter + ' percobaan...</div>';
            }
        }