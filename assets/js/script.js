// Main entry point for login page
document.addEventListener('DOMContentLoaded', () => {
    // Tambahkan style fadeOut ke document
    if (!document.querySelector('#fadeOutStyle')) {
        const style = document.createElement('style');
        style.id = 'fadeOutStyle';
        style.textContent = `
            @keyframes fadeOut {
                from { 
                    opacity: 1; 
                    transform: translate(-50%, -50%) scale(1); 
                }
                to { 
                    opacity: 0; 
                    transform: translate(-50%, -50%) scale(0.8); 
                }
            }
            @keyframes fadeOutOverlay {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            .login-popup.fade-out {
                animation: fadeOut 0.5s ease forwards;
            }
            .login-overlay.fade-out {
                animation: fadeOutOverlay 0.5s ease forwards;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Cek apakah sudah login
    const loggedIn = localStorage.getItem('lifx_user');
    const currentPage = window.location.pathname;
    
    if (loggedIn && (currentPage.includes('index.html') || currentPage === '/' || currentPage.endsWith('/'))) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Login button handler
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
    
    // Enter key handler
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    if (usernameInput) {
        usernameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') handleLogin();
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') handleLogin();
        });
    }
});

// Fungsi login global
function handleLogin() {
    console.log('Login function called');
    
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    
    if (!username || !password) {
        console.error('Input elements not found');
        return;
    }
    
    const usernameValue = username.value.trim();
    const passwordValue = password.value;
    
    console.log('Username:', usernameValue);
    
    // Validasi input kosong
    if (!usernameValue || !passwordValue) {
        alert('❌ Username dan sandi tidak boleh kosong!');
        return;
    }
    
    // Data user valid
    const validUsers = {
        'admin': 'admin123',
        'user': 'user123',
        'lifx': 'library2024'
    };
    
    // Cek kredensial
    if (validUsers[usernameValue] && validUsers[usernameValue] === passwordValue) {
        console.log('Login successful!');
        
        // Simpan ke localStorage
        localStorage.setItem('lifx_user', usernameValue);
        
        // Ambil elemen untuk animasi fade
        const loginPopup = document.querySelector('.login-popup');
        const loginOverlay = document.querySelector('.login-overlay');
        const particlesContainer = document.querySelector('.particles-container');
        
        // Tambah class fade-out
        if (loginPopup) loginPopup.classList.add('fade-out');
        if (loginOverlay) loginOverlay.classList.add('fade-out');
        if (particlesContainer) particlesContainer.style.animation = 'fadeOutOverlay 0.5s ease forwards';
        
        // Redirect setelah animasi
        setTimeout(function() {
            window.location.href = 'dashboard.html';
        }, 500);
        
    } else {
        console.log('Login failed - wrong credentials');
        alert('❌ Username atau sandi salah!\n\n📝 Demo:\nUsername: admin\nPassword: admin123');
        
        // Efek shake jika salah
        const loginPopup = document.querySelector('.login-popup');
        if (loginPopup) {
            loginPopup.style.animation = 'shake 0.3s ease-in-out';
            setTimeout(() => {
                loginPopup.style.animation = '';
            }, 300);
        }
    }
}

// Tambahkan efek shake untuk error
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translate(-50%, -50%) translateX(0); }
        25% { transform: translate(-50%, -50%) translateX(-10px); }
        75% { transform: translate(-50%, -50%) translateX(10px); }
    }
`;
document.head.appendChild(shakeStyle);