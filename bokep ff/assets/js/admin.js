// Admin Panel JavaScript
let filesData = [];
let websitesData = [];

document.addEventListener('DOMContentLoaded', () => {
    loadAdminData();
    initAdminEvents();
    renderAdminFiles();
    renderAdminWebsites();
});

function loadAdminData() {
    const storedFiles = localStorage.getItem('lifx_files');
    filesData = storedFiles ? JSON.parse(storedFiles) : [];
    
    const storedWebsites = localStorage.getItem('lifx_websites');
    websitesData = storedWebsites ? JSON.parse(storedWebsites) : [];
    
    updateStats();
}

function updateStats() {
    const totalFiles = filesData.length;
    const totalMB = filesData.reduce((sum, file) => sum + parseFloat(file.size), 0);
    
    document.getElementById('totalUploadedFiles').innerText = totalFiles;
    document.getElementById('totalUsedMB').innerText = totalMB.toFixed(1) + ' MB';
}

function initAdminEvents() {
    // Back to dashboard
    document.getElementById('backToDashboard')?.addEventListener('click', () => {
        window.location.href = 'dashboard.html';
    });
    
    // Upload form
    document.getElementById('adminUploadForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        adminUploadFile();
    });
    
    // Add website form
    document.getElementById('adminWebsiteForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        adminAddWebsite();
    });
}

function adminUploadFile() {
    const fileInput = document.getElementById('adminZipFile');
    const fileName = document.getElementById('adminFileName').value;
    const description = document.getElementById('adminFileDesc').value;
    
    if (fileInput.files.length === 0) {
        alert('Pilih file ZIP!');
        return;
    }
    
    const file = fileInput.files[0];
    if (!file.name.endsWith('.zip')) {
        alert('Hanya file ZIP!');
        return;
    }
    
    const newFile = {
        id: Date.now(),
        name: fileName || file.name,
        size: (file.size / (1024 * 1024)).toFixed(2),
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        description: description,
        viewed: false
    };
    
    filesData.push(newFile);
    localStorage.setItem('lifx_files', JSON.stringify(filesData));
    
    alert('File berhasil diupload!');
    document.getElementById('adminUploadForm').reset();
    renderAdminFiles();
    updateStats();
}

function adminAddWebsite() {
    const name = document.getElementById('adminWebsiteName').value;
    const url = document.getElementById('adminWebsiteUrl').value;
    const icon = document.getElementById('adminWebsiteIcon').value;
    
    const newWebsite = {
        id: Date.now(),
        name: name,
        url: url,
        icon: icon || '🌐'
    };
    
    websitesData.push(newWebsite);
    localStorage.setItem('lifx_websites', JSON.stringify(websitesData));
    
    alert('Website berhasil ditambahkan!');
    document.getElementById('adminWebsiteForm').reset();
    renderAdminWebsites();
    updateStats();
}

function renderAdminFiles() {
    const tbody = document.getElementById('filesTableBody');
    tbody.innerHTML = filesData.map(file => `
        <tr>
            <td>${file.name}</td>
            <td>${file.size} MB</td>
            <td>${file.date} ${file.time}</td>
            <td>
                <button onclick="deleteFile(${file.id})" class="delete-btn">Hapus</button>
            </td>
        </tr>
    `).join('');
}

function renderAdminWebsites() {
    const container = document.getElementById('adminWebsitesList');
    container.innerHTML = websitesData.map(website => `
        <div class="website-admin-item">
            <span class="website-icon-admin">${website.icon}</span>
            <span class="website-name-admin">${website.name}</span>
            <span class="website-url-admin">${website.url}</span>
            <button onclick="deleteWebsite(${website.id})" class="delete-btn">Hapus</button>
        </div>
    `).join('');
}

function deleteFile(id) {
    if (confirm('Hapus file ini?')) {
        filesData = filesData.filter(file => file.id !== id);
        localStorage.setItem('lifx_files', JSON.stringify(filesData));
        renderAdminFiles();
        updateStats();
    }
}

function deleteWebsite(id) {
    if (confirm('Hapus website ini?')) {
        websitesData = websitesData.filter(website => website.id !== id);
        localStorage.setItem('lifx_websites', JSON.stringify(websitesData));
        renderAdminWebsites();
        updateStats();
    }
}