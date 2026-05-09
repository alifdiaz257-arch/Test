// Data storage
let currentUser = null;
let filesData = [];
let websitesData = [];
let theme = 'light';
let sidebarOpen = false;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadData();
    initEventListeners();
    updateUI();
});

function checkAuth() {
    currentUser = localStorage.getItem('lifx_user');
    if (!currentUser) {
        window.location.href = 'index.html';
    }
    document.getElementById('currentUser').innerText = currentUser;
}

function loadData() {
    // Load files from localStorage
    const storedFiles = localStorage.getItem('lifx_files');
    if (storedFiles) {
        filesData = JSON.parse(storedFiles);
    } else {
        // Demo data
        filesData = [
            { id: 1, name: 'Ebook_Koleksi.zip', size: 15.5, date: '2024-01-15', time: '14:30', description: 'Koleksi ebook programming', viewed: false },
            { id: 2, name: 'Dokumen_Perpustakaan.zip', size: 8.2, date: '2024-01-20', time: '09:15', description: 'Dokumen penting perpustakaan', viewed: true }
        ];
        saveFiles();
    }
    
    // Load websites from localStorage
    const storedWebsites = localStorage.getItem('lifx_websites');
    if (storedWebsites) {
        websitesData = JSON.parse(storedWebsites);
    } else {
        websitesData = [];
        saveWebsites();
    }
    
    // Load theme preference
    const savedTheme = localStorage.getItem('lifx_theme');
    if (savedTheme) {
        theme = savedTheme;
        document.body.className = `theme-${theme}`;
    }
}

function saveFiles() {
    localStorage.setItem('lifx_files', JSON.stringify(filesData));
}

function saveWebsites() {
    localStorage.setItem('lifx_websites', JSON.stringify(websitesData));
}

function initEventListeners() {
    // Hamburger menu
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    
    hamburgerBtn.addEventListener('click', () => {
        sidebarOpen = !sidebarOpen;
        hamburgerBtn.classList.toggle('active');
        sidebar.classList.toggle('active');
        mainContent.classList.toggle('shifted');
    });
    
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', () => {
        theme = theme === 'light' ? 'dark' : 'light';
        document.body.className = `theme-${theme}`;
        localStorage.setItem('lifx_theme', theme);
    });
    
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (item.id === 'logoutBtn') {
                logout();
                return;
            }
            const page = item.dataset.page;
            showPage(page);
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Close sidebar on mobile after click
            if (window.innerWidth < 768) {
                hamburgerBtn.click();
            }
        });
    });
    
    // Open ZIP modal
    document.getElementById('openZipModal')?.addEventListener('click', () => {
        showZipModal();
    });
    
    // Modal close
    document.querySelectorAll('.close, .close-info').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('zipModal').style.display = 'none';
            document.getElementById('infoModal').style.display = 'none';
        });
    });
    
    // Admin upload form
    document.getElementById('uploadForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        uploadFile();
    });
    
    // Add website form
    document.getElementById('addWebsiteForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        addWebsite();
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

function showPage(pageName) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(`${pageName}Page`).classList.add('active');
    
    // Refresh data when showing pages
    if (pageName === 'files') {
        renderFiles();
    } else if (pageName === 'websites') {
        renderWebsites();
    } else if (pageName === 'admin') {
        renderAdminStats();
    }
}

function showZipModal() {
    const modal = document.getElementById('zipModal');
    const modalBody = document.getElementById('zipModalBody');
    
    modalBody.innerHTML = `
        <div class="files-grid">
            ${filesData.map(file => `
                <div class="file-card ${!file.viewed ? 'new' : ''}">
                    <div class="file-icon">📦</div>
                    <div class="file-info">
                        <div class="file-name">${file.name}</div>
                        <div class="file-date">${file.date} ${file.time}</div>
                        <div class="file-actions">
                            <button class="download-btn" onclick="downloadFile(${file.id})">Download</button>
                            <button class="info-btn" onclick="showFileInfo(${file.id})">Informasi</button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    modal.style.display = 'block';
}

function renderFiles() {
    const grid = document.getElementById('filesGrid');
    grid.innerHTML = filesData.map(file => `
        <div class="file-card ${!file.viewed ? 'new' : ''}">
            <div class="file-icon">📦</div>
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-date">${file.date} ${file.time}</div>
                <div class="file-actions">
                    <button class="download-btn" onclick="downloadFile(${file.id})">Download</button>
                    <button class="info-btn" onclick="showFileInfo(${file.id})">Informasi</button>
                </div>
            </div>
        </div>
    `).join('');
    
    document.getElementById('totalFiles').innerText = filesData.length;
    const totalSize = filesData.reduce((sum, file) => sum + file.size, 0);
    document.getElementById('totalSize').innerText = totalSize.toFixed(1) + ' MB';
}

function renderWebsites() {
    const grid = document.getElementById('websitesGrid');
    if (websitesData.length === 0) {
        grid.innerHTML = '<div class="empty-state">Belum ada website tersimpan. Tambahkan melalui Admin Panel.</div>';
    } else {
        grid.innerHTML = websitesData.map(website => `
            <div class="website-card" onclick="window.open('${website.url}', '_blank')">
                <div class="website-icon">${website.icon}</div>
                <div class="website-name">${website.name}</div>
                <div class="website-url">${website.url}</div>
            </div>
        `).join('');
    }
}

function renderAdminStats() {
    document.getElementById('adminTotalFiles').innerText = filesData.length;
    const totalMB = filesData.reduce((sum, file) => sum + file.size, 0);
    document.getElementById('adminTotalMB').innerText = totalMB.toFixed(1) + ' MB';
    document.getElementById('adminTotalWebsites').innerText = websitesData.length;
}

function downloadFile(fileId) {
    const file = filesData.find(f => f.id === fileId);
    if (file) {
        file.viewed = true;
        saveFiles();
        
        // Simulate download
        alert(`Mengunduh file: ${file.name}\nUkuran: ${file.size} MB\nTerima kasih!`);
        renderFiles();
    }
}

function showFileInfo(fileId) {
    const file = filesData.find(f => f.id === fileId);
    if (file) {
        file.viewed = true;
        saveFiles();
        
        const modal = document.getElementById('infoModal');
        const modalBody = document.getElementById('infoModalBody');
        
        modalBody.innerHTML = `
            <div class="info-content">
                <p><strong>📄 Nama File:</strong> ${file.name}</p>
                <p><strong>📦 Ukuran:</strong> ${file.size} MB</p>
                <p><strong>📅 Tanggal Upload:</strong> ${file.date}</p>
                <p><strong>⏰ Jam Upload:</strong> ${file.time}</p>
                <p><strong>📝 Deskripsi:</strong> ${file.description || 'Tidak ada deskripsi'}</p>
                <p><strong>👁️ Status:</strong> ${file.viewed ? 'Sudah dilihat' : 'Belum dilihat'}</p>
            </div>
        `;
        
        modal.style.display = 'block';
        renderFiles();
    }
}

function uploadFile() {
    const fileInput = document.getElementById('zipFile');
    const desc = document.getElementById('fileDesc').value;
    
    if (fileInput.files.length === 0) {
        alert('Pilih file ZIP terlebih dahulu!');
        return;
    }
    
    const file = fileInput.files[0];
    if (!file.name.endsWith('.zip')) {
        alert('Hanya file ZIP yang diperbolehkan!');
        return;
    }
    
    const newFile = {
        id: Date.now(),
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2),
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        description: desc,
        viewed: false
    };
    
    filesData.push(newFile);
    saveFiles();
    
    alert('File berhasil diupload!');
    document.getElementById('uploadForm').reset();
    renderFiles();
    renderAdminStats();
}

function addWebsite() {
    const name = document.getElementById('websiteName').value;
    const url = document.getElementById('websiteUrl').value;
    const icon = document.getElementById('websiteIcon').value;
    
    const newWebsite = {
        id: Date.now(),
        name: name,
        url: url,
        icon: icon || '🌐'
    };
    
    websitesData.push(newWebsite);
    saveWebsites();
    
    alert('Website berhasil ditambahkan!');
    document.getElementById('addWebsiteForm').reset();
    renderWebsites();
    renderAdminStats();
}

function logout() {
    localStorage.removeItem('lifx_user');
    window.location.href = 'index.html';
}

function updateUI() {
    // Update stats bar if on files page
    if (document.getElementById('filesPage').classList.contains('active')) {
        renderFiles();
    }
}