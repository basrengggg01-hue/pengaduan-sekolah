/**
 * SIMDIK — Aplikasi Web Pengaduan & Aspirasi Sekolah
 * Menggunakan Vanilla JavaScript & LocalStorage sesuai PRD.
 */

// Global State
let currentUser = null;
let currentRole = 'pelapor'; // 'pelapor' | 'petugas' | 'pimpinan'
let currentPage = 'dashboard';
let currentAttachedPhoto = null;
let currentModalTicketId = null;

// ============================================================================
// 1. DATA STORAGE & INITIALIZATION
// ============================================================================

function initData() {
    // Check & initialize users
    if (!localStorage.getItem('simdik_users')) {
        localStorage.setItem('simdik_users', JSON.stringify(DEFAULT_USERS));
    }
    // Check & initialize reports
    if (!localStorage.getItem('simdik_reports')) {
        localStorage.setItem('simdik_reports', JSON.stringify(DEFAULT_REPORTS));
    }
    // Check & initialize current user
    const savedUserId = localStorage.getItem('simdik_current_user_id');
    const users = getStoredUsers();
    if (savedUserId && users[savedUserId]) {
        currentUser = users[savedUserId];
    } else {
        currentUser = users['user_siswa_1'];
        localStorage.setItem('simdik_current_user_id', currentUser.id);
    }
    currentRole = currentUser.roleType;
}

function getStoredUsers() {
    try {
        return JSON.parse(localStorage.getItem('simdik_users')) || DEFAULT_USERS;
    } catch (e) {
        return DEFAULT_USERS;
    }
}

function getStoredReports() {
    try {
        return JSON.parse(localStorage.getItem('simdik_reports')) || DEFAULT_REPORTS;
    } catch (e) {
        return DEFAULT_REPORTS;
    }
}

function saveReports(reports) {
    localStorage.setItem('simdik_reports', JSON.stringify(reports));
}

function resetDataToDefault() {
    if (confirm('Apakah Anda yakin ingin mengembalikan data ke data contoh bawaan? Seluruh laporan yang baru dibuat akan direset.')) {
        localStorage.setItem('simdik_reports', JSON.stringify(DEFAULT_REPORTS));
        localStorage.setItem('simdik_users', JSON.stringify(DEFAULT_USERS));
        localStorage.setItem('simdik_current_user_id', 'user_siswa_1');
        showToast('Data berhasil dikembalikan ke default.');
        setTimeout(() => {
            window.location.reload();
        }, 800);
    }
}

// ============================================================================
// 2. AUTHENTICATION & ROLE SWITCHING
// ============================================================================

function switchRole(roleOrUserId) {
    const users = getStoredUsers();
    
    // Check if passed a specific userId or a role alias
    if (users[roleOrUserId]) {
        currentUser = users[roleOrUserId];
    } else if (roleOrUserId === 'pelapor') {
        currentUser = users['user_siswa_1'];
    } else if (roleOrUserId === 'petugas') {
        currentUser = users['user_guru_bk'];
    } else if (roleOrUserId === 'pimpinan') {
        currentUser = users['user_kepsek'];
    }

    currentRole = currentUser.roleType;
    localStorage.setItem('simdik_current_user_id', currentUser.id);

    // Update Role Switcher Pills at Top Banner
    document.querySelectorAll('.role-pill').forEach(btn => {
        btn.classList.remove('bg-white', 'text-navy-900');
        btn.classList.add('text-navy-200', 'hover:bg-navy-800');
    });

    const activePillId = currentRole === 'pelapor' ? 'role-btn-pelapor' : (currentRole === 'petugas' ? 'role-btn-petugas' : 'role-btn-pimpinan');
    const activePill = document.getElementById(activePillId);
    if (activePill) {
        activePill.classList.add('bg-white', 'text-navy-900');
        activePill.classList.remove('text-navy-200', 'hover:bg-navy-800');
    }

    // Update User Info in Sidebar & Profile Page
    if (document.getElementById('user-name')) document.getElementById('user-name').textContent = currentUser.name;
    if (document.getElementById('user-avatar')) document.getElementById('user-avatar').textContent = currentUser.initials;
    if (document.getElementById('user-role-label')) document.getElementById('user-role-label').textContent = currentUser.label;
    if (document.getElementById('mobile-role-badge')) document.getElementById('mobile-role-badge').textContent = currentUser.badge;

    if (document.getElementById('profile-name-lg')) document.getElementById('profile-name-lg').textContent = currentUser.name;
    if (document.getElementById('profile-avatar-lg')) document.getElementById('profile-avatar-lg').textContent = currentUser.initials;
    if (document.getElementById('profile-detail-lg')) document.getElementById('profile-detail-lg').textContent = currentUser.detail;
    if (document.getElementById('profile-role-badge-lg')) document.getElementById('profile-role-badge-lg').textContent = currentUser.badge;

    // Update Dashboard Texts
    if (document.getElementById('dash-greeting')) document.getElementById('dash-greeting').textContent = currentUser.greeting;
    if (document.getElementById('dash-subtitle')) document.getElementById('dash-subtitle').textContent = currentUser.subtitle;

    // Toggle Role-Specific Menus & CTAs
    document.querySelectorAll('.role-pelapor').forEach(el => el.classList.toggle('hidden', currentRole !== 'pelapor'));
    document.querySelectorAll('.role-petugas').forEach(el => el.classList.toggle('hidden', currentRole === 'pelapor'));
    document.querySelectorAll('.role-pimpinan').forEach(el => {
        if (currentRole === 'pimpinan' || currentRole === 'petugas') {
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
    });

    const ctaPelapor = document.getElementById('dash-cta-pelapor');
    const ctaPetugas = document.getElementById('dash-cta-petugas');
    if (ctaPelapor) ctaPelapor.classList.toggle('hidden', currentRole !== 'pelapor');
    if (ctaPetugas) ctaPetugas.classList.toggle('hidden', currentRole === 'pelapor');

    // Update Login select if visible
    const loginSelect = document.getElementById('login-role-select');
    if (loginSelect) loginSelect.value = currentUser.id;

    // Redirect to valid page for role if needed
    if (currentPage === 'login') {
        navigateTo('dashboard');
    } else if (currentRole === 'pelapor' && (currentPage === 'daftar-laporan' || currentPage === 'rekap-laporan')) {
        navigateTo('dashboard');
    } else if (currentRole !== 'pelapor' && (currentPage === 'buat-laporan' || currentPage === 'status-laporan')) {
        navigateTo('dashboard');
    } else {
        renderCurrentPage();
    }

    updateDashboardStats();
    if (window.lucide) lucide.createIcons();
}

function selectDemoAccount(userId) {
    const users = getStoredUsers();
    const user = users[userId];
    if (!user) return;

    const select = document.getElementById('login-role-select');
    if (select) select.value = userId;

    const usernameInput = document.getElementById('login-username');
    if (usernameInput) usernameInput.value = user.username;

    const passwordInput = document.getElementById('login-password');
    if (passwordInput) passwordInput.value = user.password;

    showToast(`Akun dipilih: ${user.name} (${user.label})`);
}

function handleLoginRoleChange(userId) {
    const users = getStoredUsers();
    const user = users[userId];
    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');
    if (user) {
        if (usernameInput) usernameInput.value = user.username;
        if (passwordInput) passwordInput.value = user.password;
    }
}

function handleLogin(e) {
    e.preventDefault();
    const selectedUserId = document.getElementById('login-role-select').value;
    switchRole(selectedUserId);
    navigateTo('dashboard');
    showToast(`Berhasil masuk sebagai ${currentUser.name} (${currentUser.label})`);
}

function handleLogout() {
    navigateTo('login');
    showToast('Anda telah keluar dari akun.');
}

// ============================================================================
// 3. NAVIGATION SYSTEM
// ============================================================================

function navigateTo(pageId) {
    currentPage = pageId;
    const loginPage = document.getElementById('page-login');
    const appShell = document.getElementById('app-shell');

    if (pageId === 'login') {
        loginPage.classList.remove('hidden');
        appShell.classList.add('hidden');
        if (window.lucide) lucide.createIcons();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    } else {
        loginPage.classList.add('hidden');
        appShell.classList.remove('hidden');
    }

    // Hide all page sections
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.add('hidden'));

    // Show target section
    const target = document.getElementById(`page-${pageId}`);
    if (target) {
        target.classList.remove('hidden');
    }

    // Update active state in sidebar and bottom navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        if (item.dataset.page === pageId) {
            item.classList.add('active');
            item.classList.remove('text-slate-600', 'text-slate-500');
        } else {
            item.classList.remove('active');
            item.classList.add('text-slate-600');
        }
    });

    // Render contents of the active page
    renderCurrentPage();

    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.lucide) lucide.createIcons();
}

function renderCurrentPage() {
    if (currentPage === 'dashboard') {
        renderDashboard();
    } else if (currentPage === 'status-laporan') {
        renderPelaporTickets();
    } else if (currentPage === 'daftar-laporan') {
        renderPetugasTickets();
    } else if (currentPage === 'rekap-laporan') {
        renderRekapPage();
    }
}

// ============================================================================
// 4. BUAT LAPORAN (F2, F3, F4, F8)
// ============================================================================

function checkPriorityCategory() {
    const val = document.getElementById('form-kategori').value;
    const alertBox = document.getElementById('priority-alert');
    if (val.includes('Prioritas Tinggi') || val.includes('Bullying') || val.includes('Keselamatan')) {
        alertBox.classList.remove('hidden');
    } else {
        alertBox.classList.add('hidden');
    }
}

function handleFileSelect(input) {
    const previewContainer = document.getElementById('file-preview-container');
    const previewImage = document.getElementById('file-preview-image');
    const label = document.getElementById('file-label');

    if (input.files && input.files[0]) {
        const file = input.files[0];
        
        // Check size (< 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Ukuran file terlalu besar. Maksimal 5MB.');
            input.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            currentAttachedPhoto = e.target.result;
            if (previewImage) previewImage.src = currentAttachedPhoto;
            if (previewContainer) previewContainer.classList.remove('hidden');
            if (label) label.textContent = `Foto terpilih: ${file.name}`;
        };
        reader.readAsDataURL(file);
    }
}

function removeAttachedFile() {
    currentAttachedPhoto = null;
    const fileInput = document.getElementById('file-upload');
    if (fileInput) fileInput.value = '';
    const previewContainer = document.getElementById('file-preview-container');
    if (previewContainer) previewContainer.classList.add('hidden');
    const label = document.getElementById('file-label');
    if (label) label.textContent = 'Klik untuk unggah foto bukti';
}

function submitLaporan(e) {
    e.preventDefault();

    const form = e.target;
    const jenis = form.querySelector('input[name="jenis"]:checked')?.value || 'Pengaduan';
    const kategori = document.getElementById('form-kategori').value;
    const judul = document.getElementById('form-judul').value.trim();
    const isi = document.getElementById('form-isi').value.trim();
    const isAnonim = document.getElementById('form-anonim').checked;

    if (!judul || !isi) {
        showToast('Harap lengkapi judul dan uraian laporan.');
        return;
    }

    const isPriority = kategori.includes('Prioritas Tinggi') || kategori.includes('Bullying') || kategori.includes('Keselamatan');

    // Generate unique sequential ticket number: #TIK-2026-XXX
    const reports = getStoredReports();
    let maxNum = 89;
    reports.forEach(r => {
        const match = r.nomorTiket.match(/#TIK-2026-(\d+)/);
        if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) maxNum = num;
        }
    });
    const nextNum = (maxNum + 1).toString().padStart(3, '0');
    const newTicketId = `#TIK-2026-${nextNum}`;

    // Format current date
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const formattedDate = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()} · ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`;

    // Assign appropriate unit
    let penanggungJawab = 'Tata Usaha';
    if (kategori.includes('Bullying') || kategori.includes('Perundungan')) {
        penanggungJawab = 'Guru BK';
    } else if (kategori.includes('Keselamatan')) {
        penanggungJawab = 'Satpam & Sarpras';
    } else if (kategori.includes('Akademik')) {
        penanggungJawab = 'Kurikulum & Guru Mapel';
    } else if (kategori.includes('Kesiswaan') || kategori.includes('OSIS')) {
        penanggungJawab = 'Pembina OSIS';
    }

    const newReport = {
        id: `TIK-2026-${nextNum}`,
        nomorTiket: newTicketId,
        jenis: jenis,
        kategori: kategori,
        judul: judul,
        isi: isi,
        lampiran: currentAttachedPhoto,
        isAnonim: isAnonim,
        prioritas: isPriority,
        status: 'Diterima',
        isTerlambat: false,
        pelaporId: currentUser.id,
        pelaporNama: currentUser.name,
        pelaporRole: currentUser.label,
        tanggal: formattedDate,
        batasRespons: isPriority ? 'Maks. 1 hari kerja (Prioritas Tinggi)' : 'Target maks. 3 hari kerja',
        penanggungJawab: penanggungJawab,
        tanggapan: []
    };

    // Prepend to storage
    reports.unshift(newReport);
    saveReports(reports);

    // Reset Form
    form.reset();
    removeAttachedFile();
    document.getElementById('priority-alert').classList.add('hidden');

    // Update Stats and UI
    updateDashboardStats();
    showToast(`Laporan terkirim! Nomor Tiket Anda: ${newTicketId}`);

    // Navigate to Status Laporan page to see the new ticket
    navigateTo('status-laporan');
}

// ============================================================================
// 5. PELACAKAN STATUS LAPORAN (PELAPOR) (F5)
// ============================================================================

function renderPelaporTickets(searchQuery = '') {
    const container = document.getElementById('pelapor-tickets-container');
    if (!container) return;

    const reports = getStoredReports();
    // PRD: Siswa dan Orang Tua HANYA melihat laporan miliknya sendiri
    const myReports = reports.filter(r => r.pelaporId === currentUser.id);

    // Filter by search query if any
    const query = (searchQuery || document.getElementById('search-ticket-pelapor')?.value || '').toLowerCase().trim();
    const filteredReports = myReports.filter(r => {
        if (!query) return true;
        return r.nomorTiket.toLowerCase().includes(query) ||
               r.judul.toLowerCase().includes(query) ||
               r.kategori.toLowerCase().includes(query) ||
               r.isi.toLowerCase().includes(query);
    });

    if (filteredReports.length === 0) {
        container.innerHTML = `
            <div class="glass-card rounded-3xl p-10 text-center">
                <div class="w-16 h-16 bg-navy-50 text-navy-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <i data-lucide="search-x" class="w-8 h-8"></i>
                </div>
                <h3 class="text-lg font-bold text-navy-900">Belum Ada Laporan Ditemukan</h3>
                <p class="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                    ${query ? 'Tidak ada laporan yang sesuai dengan pencarian tiket Anda.' : 'Anda belum membuat pengaduan atau aspirasi. Klik tombol di bawah untuk menulis laporan baru.'}
                </p>
                ${!query ? `
                <button onclick="navigateTo('buat-laporan')" class="mt-5 bg-navy-700 hover:bg-navy-800 text-white font-semibold px-5 py-2.5 rounded-xl shadow text-xs inline-flex items-center gap-2">
                    <i data-lucide="file-plus-2" class="w-4 h-4"></i>
                    <span>Tulis Laporan Baru</span>
                </button>
                ` : ''}
            </div>
        `;
        if (window.lucide) lucide.createIcons();
        return;
    }

    container.innerHTML = filteredReports.map(ticket => {
        // Status Badge Styling
        let statusBadge = '';
        if (ticket.status === 'Diterima') {
            statusBadge = `<span class="px-3.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 flex items-center gap-1.5"><i data-lucide="inbox" class="w-3.5 h-3.5"></i> Diterima Sistem</span>`;
        } else if (ticket.status === 'Diproses') {
            statusBadge = `<span class="px-3.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span> Sedang Diproses</span>`;
        } else if (ticket.status === 'Selesai') {
            statusBadge = `<span class="px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1.5"><i data-lucide="check-circle-2" class="w-3.5 h-3.5"></i> Selesai</span>`;
        }

        // Stepper Progress Calculations
        const isStep1Done = true;
        const isStep2Active = ticket.status === 'Diproses';
        const isStep2Done = ticket.status === 'Selesai';
        const isStep3Done = ticket.status === 'Selesai';

        // Stepper HTML
        const stepperHtml = `
            <div class="my-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div class="grid grid-cols-3 gap-2 text-center relative">
                    <!-- Step 1 -->
                    <div class="flex flex-col items-center">
                        <div class="w-8 h-8 rounded-full ${isStep1Done ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-600'} flex items-center justify-center text-xs font-bold shadow-sm">
                            <i data-lucide="check" class="w-4 h-4"></i>
                        </div>
                        <span class="text-xs font-bold text-navy-900 mt-2">Diterima</span>
                        <span class="text-[11px] text-slate-400">${ticket.tanggal.split('·')[0].trim()}</span>
                    </div>

                    <!-- Step 2 -->
                    <div class="flex flex-col items-center">
                        <div class="w-8 h-8 rounded-full ${isStep2Done ? 'bg-emerald-600 text-white' : (isStep2Active ? 'bg-amber-500 text-white ring-4 ring-amber-100' : 'bg-slate-300 text-slate-600')} flex items-center justify-center text-xs font-bold shadow-sm">
                            ${isStep2Done ? '<i data-lucide="check" class="w-4 h-4"></i>' : '2'}
                        </div>
                        <span class="text-xs font-bold ${isStep2Active ? 'text-amber-700' : (isStep2Done ? 'text-navy-900' : 'text-slate-500')} mt-2">Diproses Petugas</span>
                        <span class="text-[11px] text-slate-400">${ticket.penanggungJawab || 'Petugas'}</span>
                    </div>

                    <!-- Step 3 -->
                    <div class="flex flex-col items-center ${isStep3Done ? '' : 'opacity-40'}">
                        <div class="w-8 h-8 rounded-full ${isStep3Done ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' : 'bg-slate-300 text-slate-600'} flex items-center justify-center text-xs font-bold shadow-sm">
                            ${isStep3Done ? '<i data-lucide="check" class="w-4 h-4"></i>' : '3'}
                        </div>
                        <span class="text-xs font-bold ${isStep3Done ? 'text-emerald-700' : 'text-slate-600'} mt-2">Selesai</span>
                        <span class="text-[11px] text-slate-400">${isStep3Done ? 'Tuntas' : 'Menunggu'}</span>
                    </div>
                </div>
            </div>
        `;

        // Responses list HTML
        let responsesHtml = '';
        if (ticket.tanggapan && ticket.tanggapan.length > 0) {
            responsesHtml = `
                <div class="space-y-3 mt-4">
                    <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500">Riwayat Tanggapan Petugas</h4>
                    ${ticket.tanggapan.map(t => `
                        <div class="${t.status === 'Selesai' ? 'bg-emerald-50/70 border-l-4 border-emerald-600' : 'bg-navy-50/70 border-l-4 border-navy-700'} p-4 rounded-r-xl">
                            <div class="flex items-center justify-between text-xs mb-1">
                                <span class="font-bold ${t.status === 'Selesai' ? 'text-emerald-900' : 'text-navy-900'}">${escapeHtml(t.petugas)}</span>
                                <span class="${t.status === 'Selesai' ? 'text-emerald-700/70' : 'text-slate-400'}">${escapeHtml(t.tanggal)}</span>
                            </div>
                            <p class="text-sm ${t.status === 'Selesai' ? 'text-emerald-950' : 'text-slate-700'}">${escapeHtml(t.isi)}</p>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            responsesHtml = `
                <div class="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 flex items-center gap-2">
                    <i data-lucide="clock" class="w-4 h-4 text-amber-500 shrink-0"></i>
                    <span>Belum ada tanggapan resmi dari petugas. Penanganan laporan ditargetkan: <strong>${ticket.batasRespons || 'Maksimal 3 hari kerja'}</strong>.</span>
                </div>
            `;
        }

        // Photo thumbnail if attached
        const photoHtml = ticket.lampiran ? `
            <div class="mt-3">
                <p class="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Lampiran Foto Bukti:</p>
                <img src="${ticket.lampiran}" alt="Lampiran" class="max-h-48 rounded-xl border border-slate-200 object-cover cursor-pointer hover:opacity-95 transition shadow-sm" onclick="viewPhotoModal('${ticket.lampiran}')">
            </div>
        ` : '';

        // Reopen ticket action if Selesai (PRD Section 8 Rule 5)
        const reopenHtml = ticket.status === 'Selesai' ? `
            <div class="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
                <span>Tidak puas dengan penyelesaian? Anda dapat membuka ulang tiket dalam 7 hari.</span>
                <button onclick="reopenTicket('${ticket.id}')" class="text-navy-700 font-bold hover:underline self-start sm:self-auto flex items-center gap-1">
                    <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i> Buka Ulang Tiket
                </button>
            </div>
        ` : '';

        return `
            <div class="glass-card rounded-3xl p-6 sm:p-7 fade-in" id="card-${ticket.id}">
                <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div class="flex items-center gap-2.5 flex-wrap">
                        <span class="font-mono text-sm font-extrabold text-navy-800 bg-navy-100 px-3 py-1 rounded-lg">${ticket.nomorTiket}</span>
                        <span class="text-xs font-medium text-slate-500">${ticket.tanggal}</span>
                        ${ticket.isAnonim ? `
                            <span class="inline-flex items-center gap-1 text-xs font-semibold text-navy-700 bg-slate-100 px-2.5 py-1 rounded-full">
                                <i data-lucide="eye-off" class="w-3.5 h-3.5 text-emerald-600"></i> Identitas Disembunyikan (Anonim)
                            </span>
                        ` : ''}
                        ${ticket.prioritas ? `
                            <span class="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full">
                                <i data-lucide="flame" class="w-3.5 h-3.5"></i> Prioritas Tinggi
                            </span>
                        ` : ''}
                    </div>
                    ${statusBadge}
                </div>

                <div class="mt-4">
                    <span class="text-xs font-bold uppercase tracking-wider text-navy-600">${ticket.jenis} · ${ticket.kategori}</span>
                    <h3 class="text-lg font-bold text-navy-900 mt-1">${escapeHtml(ticket.judul)}</h3>
                    <p class="text-sm text-slate-600 mt-2 leading-relaxed whitespace-pre-line">${escapeHtml(ticket.isi)}</p>
                    ${photoHtml}
                </div>

                ${stepperHtml}
                ${responsesHtml}
                ${reopenHtml}
            </div>
        `;
    }).join('');

    if (window.lucide) lucide.createIcons();
}

function reopenTicket(ticketId) {
    const reason = prompt('Sampaikan alasan Anda ingin membuka ulang laporan ini:');
    if (!reason || !reason.trim()) return;

    const reports = getStoredReports();
    const index = reports.findIndex(r => r.id === ticketId);
    if (index !== -1) {
        reports[index].status = 'Diproses';
        if (!reports[index].tanggapan) reports[index].tanggapan = [];
        
        const now = new Date();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const formattedDate = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()} · ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`;

        reports[index].tanggapan.push({
            id: 'reopen_' + Date.now(),
            petugas: `Pelapor (${currentUser.name}) — Membuka Ulang Tiket`,
            tanggal: formattedDate,
            status: 'Diproses',
            isi: `Tiket dibuka ulang oleh pelapor dengan alasan: "${reason.trim()}"`
        });

        saveReports(reports);
        updateDashboardStats();
        renderPelaporTickets();
        showToast(`Tiket ${reports[index].nomorTiket} berhasil dibuka ulang dan diteruskan ke petugas.`);
    }
}

// ============================================================================
// 6. DAFTAR LAPORAN MASUK (PETUGAS / GURU BK / ADMIN) (F6, F7, F8, F9)
// ============================================================================

function renderPetugasTickets() {
    const container = document.getElementById('petugas-tickets-container');
    if (!container) return;

    const filterStatus = document.getElementById('filter-status-petugas')?.value || 'Semua Status';
    const searchQuery = (document.getElementById('search-ticket-petugas')?.value || '').toLowerCase().trim();

    const reports = getStoredReports();

    const filtered = reports.filter(r => {
        // Status filter
        if (filterStatus === 'Prioritas Tinggi' && !r.prioritas) return false;
        if (filterStatus === 'Diterima (Baru)' && r.status !== 'Diterima') return false;
        if (filterStatus === 'Diproses' && r.status !== 'Diproses') return false;
        if (filterStatus === 'Selesai' && r.status !== 'Selesai') return false;

        // Search query
        if (searchQuery) {
            const matchQuery = r.nomorTiket.toLowerCase().includes(searchQuery) ||
                               r.judul.toLowerCase().includes(searchQuery) ||
                               r.kategori.toLowerCase().includes(searchQuery) ||
                               r.isi.toLowerCase().includes(searchQuery);
            if (!matchQuery) return false;
        }

        return true;
    });

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="glass-card rounded-2xl p-8 text-center">
                <i data-lucide="check-circle" class="w-10 h-10 text-emerald-500 mx-auto mb-2"></i>
                <h4 class="font-bold text-navy-900">Tidak Ada Laporan</h4>
                <p class="text-xs text-slate-500 mt-1">Semua laporan dalam kriteria ini telah diproses dengan baik.</p>
            </div>
        `;
        if (window.lucide) lucide.createIcons();
        return;
    }

    container.innerHTML = filtered.map(report => {
        const isPriority = report.prioritas;
        const isOverdue = report.isTerlambat;

        // Card Border style
        let cardBorder = '';
        if (isPriority) cardBorder = 'border-l-4 border-l-rose-600';
        else if (isOverdue) cardBorder = 'border-l-4 border-l-amber-500';

        // Badges
        let statusPill = '';
        if (isPriority) {
            statusPill = `
                <span class="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-rose-100 text-rose-700 uppercase tracking-wide flex items-center gap-1">
                    <i data-lucide="flame" class="w-3 h-3"></i> Prioritas Tinggi
                </span>
            `;
        } else if (isOverdue) {
            statusPill = `<span class="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-500 text-white">Terlambat (>3 Hari)</span>`;
        } else if (report.status === 'Diproses') {
            statusPill = `<span class="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800">Diproses</span>`;
        } else if (report.status === 'Selesai') {
            statusPill = `<span class="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800">Selesai</span>`;
        } else {
            statusPill = `<span class="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-100 text-blue-800">Diterima (Baru)</span>`;
        }

        // PRD F3 & Aturan Bisnis 2: Privasi Anonim
        // Jika isAnonim === true, identitas TIDAK DITAMPILKAN kepada petugas maupun admin
        const reporterBadge = report.isAnonim ? `
            <span class="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-800 text-white px-2.5 py-0.5 rounded-full" title="Identitas pelapor dirahasiakan oleh sistem demi keamanan pelapor.">
                <i data-lucide="eye-off" class="w-3 h-3 text-emerald-400"></i> Pelapor Anonim
            </span>
        ` : `
            <span class="text-xs font-medium text-navy-700">· Pelapor: ${escapeHtml(report.pelaporNama)} (${escapeHtml(report.pelaporRole)})</span>
        `;

        // Deadline / Info note
        let note = '';
        if (isPriority && report.status !== 'Selesai') {
            note = `<p class="text-[11px] text-rose-600 font-semibold pt-1">Batas respons pertama: Maksimal 1 hari kerja (Jalur Khusus Guru BK)</p>`;
        } else if (isOverdue && report.status !== 'Selesai') {
            note = `<p class="text-[11px] text-amber-600 font-semibold pt-1">Laporan melebihi 3 hari kerja tanpa penyelesaian. Dapat dieskalasi ke Kepala Sekolah.</p>`;
        } else {
            note = `<p class="text-[11px] text-slate-400 pt-1">Masuk: ${report.tanggal} · Penanggung Jawab: ${report.penanggungJawab || 'Petugas'}</p>`;
        }

        // Actions
        const responseBtn = `
            <button onclick="openResponseModal('${report.id}')" class="bg-navy-700 hover:bg-navy-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow transition flex items-center gap-1.5 shrink-0">
                <i data-lucide="message-square-plus" class="w-4 h-4"></i>
                <span>${report.status === 'Selesai' ? 'Lihat / Tambah Tanggapan' : 'Tanggapi & Proses'}</span>
            </button>
        `;

        const eskalasiBtn = isOverdue ? `
            <button onclick="escalateReport('${report.id}')" class="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold px-3.5 py-2.5 rounded-xl transition shrink-0">
                Eskalasi Pimpinan
            </button>
        ` : '';

        return `
            <div class="glass-card rounded-2xl p-5 ${cardBorder} fade-in">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div class="space-y-1.5 flex-1">
                        <div class="flex items-center gap-2 flex-wrap">
                            ${statusPill}
                            <span class="font-mono text-xs font-bold text-navy-700">${report.nomorTiket}</span>
                            <span class="text-xs text-slate-500">· ${report.kategori}</span>
                            ${reporterBadge}
                        </div>
                        <h3 class="font-bold text-base text-navy-900">${escapeHtml(report.judul)}</h3>
                        <p class="text-xs text-slate-600 max-w-2xl leading-relaxed">${escapeHtml(report.isi)}</p>
                        ${note}
                        ${report.lampiran ? `
                            <div class="pt-1">
                                <button onclick="viewPhotoModal('${report.lampiran}')" class="text-[11px] text-navy-700 font-semibold hover:underline flex items-center gap-1">
                                    <i data-lucide="image" class="w-3.5 h-3.5"></i> Lihat Lampiran Bukti
                                </button>
                            </div>
                        ` : ''}
                    </div>
                    <div class="flex items-center gap-2 shrink-0">
                        ${eskalasiBtn}
                        ${responseBtn}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    if (window.lucide) lucide.createIcons();
}

function escalateReport(ticketId) {
    const reports = getStoredReports();
    const index = reports.findIndex(r => r.id === ticketId);
    if (index !== -1) {
        reports[index].isEscalated = true;
        saveReports(reports);
        showToast(`Laporan ${reports[index].nomorTiket} telah dieskalasi ke Kepala Sekolah untuk tindak lanjut.`);
        renderPetugasTickets();
    }
}

// ============================================================================
// 7. RESPONSE MODAL (F7)
// ============================================================================

function openResponseModal(ticketId) {
    const reports = getStoredReports();
    const report = reports.find(r => r.id === ticketId);
    if (!report) return;

    currentModalTicketId = ticketId;
    document.getElementById('modal-ticket-id').textContent = report.nomorTiket;
    document.getElementById('modal-ticket-title').textContent = report.judul;

    const select = document.getElementById('modal-status-select');
    if (select) {
        select.value = report.status === 'Selesai' ? 'Selesai' : 'Diproses';
    }

    const modal = document.getElementById('response-modal');
    modal.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
}

function closeResponseModal() {
    const modal = document.getElementById('response-modal');
    modal.classList.add('hidden');
    document.getElementById('modal-response-text').value = '';
    currentModalTicketId = null;
}

function submitResponse(e) {
    e.preventDefault();
    if (!currentModalTicketId) return;

    const newStatus = document.getElementById('modal-status-select').value;
    const responseText = document.getElementById('modal-response-text').value.trim();

    if (!responseText) {
        showToast('Isi tanggapan resmi tidak boleh kosong.');
        return;
    }

    const reports = getStoredReports();
    const index = reports.findIndex(r => r.id === currentModalTicketId);
    if (index !== -1) {
        const report = reports[index];
        report.status = newStatus;
        if (newStatus === 'Selesai') {
            report.isTerlambat = false;
        }

        const now = new Date();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const formattedDate = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()} · ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`;

        if (!report.tanggapan) report.tanggapan = [];
        report.tanggapan.push({
            id: 'resp_' + Date.now(),
            petugas: `${currentUser.name} (${currentUser.label})`,
            tanggal: formattedDate,
            status: newStatus,
            isi: responseText
        });

        saveReports(reports);
        updateDashboardStats();
        closeResponseModal();
        showToast(`Tiket ${report.nomorTiket} diperbarui menjadi "${newStatus}" & tanggapan berhasil dikirim.`);

        renderCurrentPage();
    }
}

// ============================================================================
// 8. DASHBOARD & REKAPITULASI (F10)
// ============================================================================

function updateDashboardStats() {
    const reports = getStoredReports();
    const myReports = reports.filter(r => r.pelaporId === currentUser.id);

    let total = 0, proses = 0, selesai = 0, prioritas = 0;

    if (currentRole === 'pelapor') {
        total = myReports.length;
        proses = myReports.filter(r => r.status === 'Diproses').length;
        selesai = myReports.filter(r => r.status === 'Selesai').length;
        prioritas = myReports.filter(r => r.prioritas).length;
    } else {
        total = reports.length;
        proses = reports.filter(r => r.status === 'Diproses' || r.status === 'Diterima').length;
        selesai = reports.filter(r => r.status === 'Selesai').length;
        prioritas = reports.filter(r => r.prioritas && r.status !== 'Selesai').length;
    }

    if (document.getElementById('stat-total')) document.getElementById('stat-total').textContent = total;
    if (document.getElementById('stat-proses')) document.getElementById('stat-proses').textContent = proses;
    if (document.getElementById('stat-selesai')) document.getElementById('stat-selesai').textContent = selesai;
    if (document.getElementById('stat-prioritas')) document.getElementById('stat-prioritas').textContent = prioritas;

    // Update Sidebar Badges
    const statusBadge = document.getElementById('sidebar-status-count');
    if (statusBadge) statusBadge.textContent = myReports.length;

    const incomingBadge = document.getElementById('sidebar-incoming-count');
    if (incomingBadge) {
        const pendingCount = reports.filter(r => r.status !== 'Selesai').length;
        incomingBadge.textContent = pendingCount;
    }
}

function renderDashboard() {
    updateDashboardStats();
    const listContainer = document.getElementById('dashboard-recent-list');
    if (!listContainer) return;

    const reports = getStoredReports();
    // Pelapor sees recent from their own reports, officers see recent from all
    const relevantReports = currentRole === 'pelapor' 
        ? reports.filter(r => r.pelaporId === currentUser.id)
        : reports;

    const topReports = relevantReports.slice(0, 3);

    if (topReports.length === 0) {
        listContainer.innerHTML = `
            <div class="p-6 text-center text-slate-400 text-xs">
                Belum ada aktivitas laporan terbaru.
            </div>
        `;
        return;
    }

    listContainer.innerHTML = topReports.map(item => {
        let statusBadge = '';
        if (item.status === 'Diproses') {
            statusBadge = `<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 shrink-0">Diproses</span>`;
        } else if (item.status === 'Selesai') {
            statusBadge = `<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 shrink-0">Selesai</span>`;
        } else {
            statusBadge = `<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 shrink-0">Diterima</span>`;
        }

        const lastResponse = item.tanggapan && item.tanggapan.length > 0
            ? `${escapeHtml(item.tanggapan[item.tanggapan.length - 1].petugas)}: ${escapeHtml(item.tanggapan[item.tanggapan.length - 1].isi)}`
            : escapeHtml(item.isi);

        const targetPage = currentRole === 'pelapor' ? 'status-laporan' : 'daftar-laporan';

        return `
            <div onclick="navigateTo('${targetPage}')" class="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition cursor-pointer flex items-center justify-between gap-4">
                <div class="flex items-start gap-3">
                    <div class="w-8 h-8 rounded-xl ${item.status === 'Selesai' ? 'bg-emerald-100 text-emerald-600' : (item.prioritas ? 'bg-rose-100 text-rose-600' : 'bg-navy-100 text-navy-700')} flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                        <i data-lucide="${item.status === 'Selesai' ? 'check' : (item.prioritas ? 'alert-circle' : 'file-text')}" class="w-4 h-4"></i>
                    </div>
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="font-mono text-xs font-bold text-navy-700">${item.nomorTiket}</span>
                            <span class="text-xs text-slate-400">· ${item.kategori}</span>
                        </div>
                        <h4 class="font-bold text-sm text-navy-900 mt-0.5 line-clamp-1">${escapeHtml(item.judul)}</h4>
                        <p class="text-xs text-slate-500 mt-0.5 line-clamp-1">${lastResponse}</p>
                    </div>
                </div>
                ${statusBadge}
            </div>
        `;
    }).join('');

    if (window.lucide) lucide.createIcons();
}

function renderRekapPage() {
    const reports = getStoredReports();
    const total = reports.length || 1;
    const selesaiCount = reports.filter(r => r.status === 'Selesai').length;
    const completionRate = ((selesaiCount / total) * 100).toFixed(1);

    // Distribution per category
    const catCounts = {
        'Sarana & Prasarana': 0,
        'Akademik & Pembelajaran': 0,
        'Kegiatan Kesiswaan / OSIS': 0,
        'Perundungan & Keselamatan': 0
    };

    let pengaduanCount = 0;
    let aspirasiCount = 0;
    let anonimCount = 0;

    reports.forEach(r => {
        if (r.jenis === 'Pengaduan') pengaduanCount++;
        else aspirasiCount++;

        if (r.isAnonim) anonimCount++;

        if (r.kategori.includes('Sarana')) catCounts['Sarana & Prasarana']++;
        else if (r.kategori.includes('Akademik')) catCounts['Akademik & Pembelajaran']++;
        else if (r.kategori.includes('Kesiswaan') || r.kategori.includes('OSIS')) catCounts['Kegiatan Kesiswaan / OSIS']++;
        else catCounts['Perundungan & Keselamatan']++;
    });

    const anonimPercent = Math.round((anonimCount / total) * 100);

    // Update Executive Metrics
    if (document.getElementById('rekap-completion-rate')) document.getElementById('rekap-completion-rate').textContent = `${completionRate}%`;
    if (document.getElementById('rekap-completion-bar')) document.getElementById('rekap-completion-bar').style.width = `${completionRate}%`;
    if (document.getElementById('rekap-anonim-stat')) document.getElementById('rekap-anonim-stat').textContent = `${anonimPercent}% pelapor memilih mode anonim`;

    // Update Counts & Bars
    const saranaPct = Math.round((catCounts['Sarana & Prasarana'] / total) * 100);
    const akademikPct = Math.round((catCounts['Akademik & Pembelajaran'] / total) * 100);
    const kesiswaanPct = Math.round((catCounts['Kegiatan Kesiswaan / OSIS'] / total) * 100);
    const prioritasPct = Math.round((catCounts['Perundungan & Keselamatan'] / total) * 100);

    if (document.getElementById('rekap-count-sarana')) document.getElementById('rekap-count-sarana').textContent = `${catCounts['Sarana & Prasarana']} Laporan (${saranaPct}%)`;
    if (document.getElementById('rekap-bar-sarana')) document.getElementById('rekap-bar-sarana').style.width = `${saranaPct}%`;

    if (document.getElementById('rekap-count-akademik')) document.getElementById('rekap-count-akademik').textContent = `${catCounts['Akademik & Pembelajaran']} Laporan (${akademikPct}%)`;
    if (document.getElementById('rekap-bar-akademik')) document.getElementById('rekap-bar-akademik').style.width = `${akademikPct}%`;

    if (document.getElementById('rekap-count-kesiswaan')) document.getElementById('rekap-count-kesiswaan').textContent = `${catCounts['Kegiatan Kesiswaan / OSIS']} Laporan (${kesiswaanPct}%)`;
    if (document.getElementById('rekap-bar-kesiswaan')) document.getElementById('rekap-bar-kesiswaan').style.width = `${kesiswaanPct}%`;

    if (document.getElementById('rekap-count-prioritas')) document.getElementById('rekap-count-prioritas').textContent = `${catCounts['Perundungan & Keselamatan']} Laporan (${prioritasPct}%)`;
    if (document.getElementById('rekap-bar-prioritas')) document.getElementById('rekap-bar-prioritas').style.width = `${prioritasPct}%`;

    // Update Jenis Pengaduan vs Aspirasi
    if (document.getElementById('rekap-pengaduan-total')) document.getElementById('rekap-pengaduan-total').textContent = pengaduanCount;
    if (document.getElementById('rekap-aspirasi-total')) document.getElementById('rekap-aspirasi-total').textContent = aspirasiCount;
}

function downloadRekapPDF() {
    showToast('Mempersiapkan dokumen rekapitulasi sekolah...');
    setTimeout(() => {
        window.print();
    }, 500);
}

// ============================================================================
// 9. PHOTO LIGHTBOX MODAL & UTILS
// ============================================================================

function viewPhotoModal(src) {
    const modal = document.getElementById('photo-modal');
    const img = document.getElementById('photo-modal-img');
    if (modal && img) {
        img.src = src;
        modal.classList.remove('hidden');
    }
}

function closePhotoModal() {
    const modal = document.getElementById('photo-modal');
    if (modal) modal.classList.add('hidden');
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toast-message');
    if (!toast || !msgEl) return;

    msgEl.textContent = msg;
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3500);
}

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ============================================================================
// 10. INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    initData();
    switchRole(currentUser.id);
    navigateTo('dashboard');
    if (window.lucide) lucide.createIcons();
});
