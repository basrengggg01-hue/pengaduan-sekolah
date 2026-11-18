/**
 * SIMDIK — Data Awal Fiktif (Seed Data)
 * Disimpan di localStorage jika belum ada data.
 */

const DEFAULT_USERS = {
    'user_siswa_1': {
        id: 'user_siswa_1',
        username: '2400000001',
        password: 'siswa123',
        name: 'Ahmad Fauzi',
        role: 'siswa',
        roleType: 'pelapor',
        label: 'Siswa · XI IPA 2',
        detail: 'NISN: 2400000001 · Siswa Kelas XI IPA 2',
        badge: 'Siswa',
        initials: 'AF',
        greeting: 'Halo, Ahmad Fauzi!',
        subtitle: 'Sampaikan pengaduan atau aspirasi untuk sekolah yang lebih baik. Identitas Anda terlindungi.'
    },
    'user_ortu_1': {
        id: 'user_ortu_1',
        username: 'ortu_rina',
        password: 'ortu123',
        name: 'Ibu Rina Marlina',
        role: 'ortu',
        roleType: 'pelapor',
        label: 'Orang Tua · Kelas X-A',
        detail: 'Wali Murid dari Rizky Pratama (Kelas X-A)',
        badge: 'Orang Tua',
        initials: 'RM',
        greeting: 'Selamat Datang, Ibu Rina Marlina!',
        subtitle: 'Sampaikan masukan dan pantau tindak lanjut laporan demi kenyamanan belajar putra/putri di sekolah.'
    },
    'user_guru_bk': {
        id: 'user_guru_bk',
        username: '198501012010012001',
        password: 'guru123',
        name: 'Ibu Siti Aminah, S.Pd',
        role: 'guru_bk',
        roleType: 'petugas',
        label: 'Guru BK & Koordinator',
        detail: 'NIP: 198501012010012001 · Guru Bimbingan Konseling',
        badge: 'Guru / BK',
        initials: 'SA',
        greeting: 'Selamat Bertugas, Ibu Siti!',
        subtitle: 'Terdapat laporan prioritas tinggi (perundungan) yang memerlukan respons maksimal 1 hari kerja.'
    },
    'user_admin_tu': {
        id: 'user_admin_tu',
        username: '199001012015011001',
        password: 'admin123',
        name: 'Hendra Gunawan, S.Kom',
        role: 'admin',
        roleType: 'petugas',
        label: 'Staf Tata Usaha & Sarpras',
        detail: 'NIP: 199001012015011001 · Unit Tata Usaha & Sarpras',
        badge: 'Admin / TU',
        initials: 'HG',
        greeting: 'Selamat Bertugas, Pak Hendra!',
        subtitle: 'Kelola alur disposisi pengaduan fasilitas dan sarana prasarana sekolah.'
    },
    'user_kepsek': {
        id: 'user_kepsek',
        username: '197001011995011001',
        password: 'kepsek123',
        name: 'Drs. H. Mahmudin, M.Pd',
        role: 'pimpinan',
        roleType: 'pimpinan',
        label: 'Kepala Sekolah',
        detail: 'NIP: 197001011995011001 · Kepala Sekolah',
        badge: 'Kepala Sekolah',
        initials: 'HM',
        greeting: 'Selamat Datang, Bapak Kepala Sekolah',
        subtitle: 'Ringkasan kinerja penanganan pengaduan dan tingkat kepuasan layanan sekolah bulan ini.'
    }
};

const DEFAULT_REPORTS = [
    {
        id: 'TIK-2026-089',
        nomorTiket: '#TIK-2026-089',
        jenis: 'Pengaduan',
        kategori: 'Perundungan (Bullying)',
        judul: 'Laporan Intimidasi di Area Kantin Belakang',
        isi: 'Terjadi pemalakan dan ejekan berulang terhadap siswa kelas X saat jam pulang sekolah di dekat parkiran belakang.',
        lampiran: null,
        isAnonim: true,
        prioritas: true,
        status: 'Diterima',
        isTerlambat: false,
        pelaporId: 'user_siswa_1',
        pelaporNama: 'Ahmad Fauzi',
        pelaporRole: 'Siswa · XI IPA 2',
        tanggal: '16 Nov 2026 · 14:10 WIB',
        batasRespons: 'Hari ini, 16:00 WIB (Target 1 hari kerja)',
        penanggungJawab: 'Guru BK',
        tanggapan: []
    },
    {
        id: 'TIK-2026-084',
        nomorTiket: '#TIK-2026-084',
        jenis: 'Pengaduan',
        kategori: 'Sarana & Prasarana',
        judul: 'Proyektor di Ruang Kelas XI IPA 2 Mati Total',
        isi: 'Sudah dua hari proyektor di ruang XI IPA 2 tidak menyala sama sekali meskipun indikator listrik hidup. Menghambat presentasi kelompok mata pelajaran Biologi.',
        lampiran: null,
        isAnonim: true,
        prioritas: false,
        status: 'Diproses',
        isTerlambat: false,
        pelaporId: 'user_siswa_1',
        pelaporNama: 'Ahmad Fauzi',
        pelaporRole: 'Siswa · XI IPA 2',
        tanggal: '13 Nov 2026 · 09:40 WIB',
        batasRespons: 'Target maks. 3 hari kerja',
        penanggungJawab: 'Tata Usaha',
        tanggapan: [
            {
                id: 'resp_1',
                petugas: 'Staf Sarpras (Tata Usaha)',
                tanggal: '14 Nov 2026 · 10:15 WIB',
                status: 'Diproses',
                isi: 'Terima kasih atas laporannya. Teknisi sekolah sudah mengecek unit dan sedang mengganti modul lampu proyektor. Ditargetkan selesai besok pagi.'
            }
        ]
    },
    {
        id: 'TIK-2026-071',
        nomorTiket: '#TIK-2026-071',
        jenis: 'Aspirasi',
        kategori: 'Kegiatan Kesiswaan / OSIS',
        judul: 'Usulan Penambahan Jam Buka Perpustakaan Saat Istirahat',
        isi: 'Mohon agar perpustakaan tetap buka saat jam istirahat kedua sehingga siswa bisa membaca atau meminjam buku referensi.',
        lampiran: null,
        isAnonim: false,
        prioritas: false,
        status: 'Selesai',
        isTerlambat: false,
        pelaporId: 'user_siswa_1',
        pelaporNama: 'Ahmad Fauzi',
        pelaporRole: 'Siswa · XI IPA 2',
        tanggal: '08 Nov 2026 · 11:20 WIB',
        batasRespons: 'Selesai',
        penanggungJawab: 'Kepala Perpustakaan',
        tanggapan: [
            {
                id: 'resp_2',
                petugas: 'Kepala Perpustakaan (Tanggapan Akhir)',
                tanggal: '10 Nov 2026 · 14:00 WIB',
                status: 'Selesai',
                isi: 'Aspirasi diterima dengan baik. Mulai minggu ini jadwal piket pustakawan telah disesuaikan sehingga perpustakaan buka penuh pada jam istirahat pertama dan kedua.'
            }
        ]
    },
    {
        id: 'TIK-2026-065',
        nomorTiket: '#TIK-2026-065',
        jenis: 'Pengaduan',
        kategori: 'Akademik & Pembelajaran',
        judul: 'Jadwal Remedial Ujian Tengah Semester Belum Diumumkan',
        isi: 'Mohon kejelasan jadwal remedial mata pelajaran Fisika kelas X karena anak kami perlu mempersiapkan diri.',
        lampiran: null,
        isAnonim: false,
        prioritas: false,
        status: 'Diproses',
        isTerlambat: true,
        pelaporId: 'user_ortu_1',
        pelaporNama: 'Ibu Rina Marlina',
        pelaporRole: 'Orang Tua · Siswa Kelas X-A',
        tanggal: '05 Nov 2026 · 08:30 WIB',
        batasRespons: 'Terlambat (>3 Hari)',
        penanggungJawab: 'Kurikulum & Guru Fisika',
        tanggapan: []
    },
    {
        id: 'TIK-2026-060',
        nomorTiket: '#TIK-2026-060',
        jenis: 'Pengaduan',
        kategori: 'Keselamatan & Keamanan',
        judul: 'Pagar Belakang Dekat Lab Kimia Renggang dan Tajam',
        isi: 'Ujung pagar kawat di belakang lab kimia mencuat tajam dan membahayakan siswa saat jam olahraga.',
        lampiran: null,
        isAnonim: true,
        prioritas: true,
        status: 'Selesai',
        isTerlambat: false,
        pelaporId: 'user_siswa_2',
        pelaporNama: 'Siswa Fiktif',
        pelaporRole: 'Siswa · X-B',
        tanggal: '03 Nov 2026 · 13:15 WIB',
        batasRespons: 'Selesai',
        penanggungJawab: 'Satpam & Sarpras',
        tanggapan: [
            {
                id: 'resp_3',
                petugas: 'Koordinator Keamanan & Satpam',
                tanggal: '04 Nov 2026 · 09:00 WIB',
                status: 'Selesai',
                isi: 'Kawat pagar yang mencuat telah dipotong dan diperbaiki dengan pengaman karet. Area sudah aman dilalui.'
            }
        ]
    },
    {
        id: 'TIK-2026-055',
        nomorTiket: '#TIK-2026-055',
        jenis: 'Pengaduan',
        kategori: 'Sarana & Prasarana',
        judul: 'Kran Air Toilet Siswa Lantai 2 Bocor Terus Menerus',
        isi: 'Air terbuang cukup banyak karena drat kran aus di toilet laki-laki lantai 2 gedung utama.',
        lampiran: null,
        isAnonim: true,
        prioritas: false,
        status: 'Selesai',
        isTerlambat: false,
        pelaporId: 'user_siswa_1',
        pelaporNama: 'Ahmad Fauzi',
        pelaporRole: 'Siswa · XI IPA 2',
        tanggal: '01 Nov 2026 · 10:15 WIB',
        batasRespons: 'Selesai',
        penanggungJawab: 'Tata Usaha',
        tanggapan: [
            {
                id: 'resp_4',
                petugas: 'Teknisi Sarpras',
                tanggal: '02 Nov 2026 · 11:30 WIB',
                status: 'Selesai',
                isi: 'Kran air telah diganti dengan unit baru berbahan kuningan tahan karat.'
            }
        ]
    },
    {
        id: 'TIK-2026-050',
        nomorTiket: '#TIK-2026-050',
        jenis: 'Aspirasi',
        kategori: 'Kegiatan Kesiswaan / OSIS',
        judul: 'Usulan Pengadaan Pelatihan Desain Grafis & Public Speaking OSIS',
        isi: 'Mohon pertimbangan diadakannya workshop singkat mengenai Canva dan kemampuan bicara publik bagi perwakilan pengurus ekstrakurikuler.',
        lampiran: null,
        isAnonim: false,
        prioritas: false,
        status: 'Selesai',
        isTerlambat: false,
        pelaporId: 'user_siswa_3',
        pelaporNama: 'Rina Salsabila',
        pelaporRole: 'Siswa · XI IPS 1',
        tanggal: '29 Okt 2026 · 15:40 WIB',
        batasRespons: 'Selesai',
        penanggungJawab: 'Pembina OSIS',
        tanggapan: [
            {
                id: 'resp_5',
                petugas: 'Pembina OSIS',
                tanggal: '31 Okt 2026 · 13:00 WIB',
                status: 'Selesai',
                isi: 'Program kerja disetujui untuk dimasukkan dalam agenda LDKS bulan depan. Terima kasih usulannya!'
            }
        ]
    },
    {
        id: 'TIK-2026-048',
        nomorTiket: '#TIK-2026-048',
        jenis: 'Pengaduan',
        kategori: 'Sarana & Prasarana',
        judul: 'AC di Ruang Laboratorium Komputer 1 Kurang Dingin',
        isi: 'Suhu lab komputer sering terlalu panas saat praktikum 36 siswa sehingga komputer sering overheat.',
        lampiran: null,
        isAnonim: true,
        prioritas: false,
        status: 'Selesai',
        isTerlambat: false,
        pelaporId: 'user_siswa_4',
        pelaporNama: 'Budi Santoso',
        pelaporRole: 'Siswa · XII IPA 1',
        tanggal: '27 Okt 2026 · 09:00 WIB',
        batasRespons: 'Selesai',
        penanggungJawab: 'Tata Usaha',
        tanggapan: [
            {
                id: 'resp_6',
                petugas: 'Tim Sarpras',
                tanggal: '28 Okt 2026 · 16:00 WIB',
                status: 'Selesai',
                isi: 'Unit AC telah diservis dan freon telah diisi ulang oleh teknisi servis.'
            }
        ]
    },
    {
        id: 'TIK-2026-042',
        nomorTiket: '#TIK-2026-042',
        jenis: 'Pengaduan',
        kategori: 'Akademik & Pembelajaran',
        judul: 'Keterlambatan Pembagian Modul Pembelajaran Matematika Peminatan',
        isi: 'Sudah memasuki minggu ke-4 namun fotokopi modul pegangan belum dibagikan secara merata.',
        lampiran: null,
        isAnonim: false,
        prioritas: false,
        status: 'Selesai',
        isTerlambat: false,
        pelaporId: 'user_siswa_5',
        pelaporNama: 'Dimas Anggara',
        pelaporRole: 'Siswa · XI IPA 3',
        tanggal: '24 Okt 2026 · 11:00 WIB',
        batasRespons: 'Selesai',
        penanggungJawab: 'Kurikulum',
        tanggapan: [
            {
                id: 'resp_7',
                petugas: 'Waka Kurikulum',
                tanggal: '25 Okt 2026 · 14:00 WIB',
                status: 'Selesai',
                isi: 'Seluruh modul telah selesai dicetak dan didistribusikan ke ketua kelas XI IPA 3.'
            }
        ]
    },
    {
        id: 'TIK-2026-038',
        nomorTiket: '#TIK-2026-038',
        jenis: 'Pengaduan',
        kategori: 'Perundungan (Bullying)',
        judul: 'Penyebaran Foto dan Ejekan di Grup Chat Kelas Tanpa Izin',
        isi: 'Terdapat akun anonim di grup kelas yang mengunggah foto tidak pantas untuk mempermalukan teman sekelas.',
        lampiran: null,
        isAnonim: true,
        prioritas: true,
        status: 'Selesai',
        isTerlambat: false,
        pelaporId: 'user_siswa_6',
        pelaporNama: 'Anonim Siswa',
        pelaporRole: 'Siswa · X-C',
        tanggal: '20 Okt 2026 · 19:20 WIB',
        batasRespons: 'Selesai',
        penanggungJawab: 'Guru BK',
        tanggapan: [
            {
                id: 'resp_8',
                petugas: 'Guru BK & Wali Kelas X-C',
                tanggal: '21 Okt 2026 · 10:00 WIB',
                status: 'Selesai',
                isi: 'Pelaku telah dipanggil bersama wali murid untuk mediasi tertutup dan penandatanganan komitmen stop cyberbullying.'
            }
        ]
    },
    {
        id: 'TIK-2026-035',
        nomorTiket: '#TIK-2026-035',
        jenis: 'Aspirasi',
        kategori: 'Akademik & Pembelajaran',
        judul: 'Usulan Penyediaan Bank Soal Try Out Online di Web Sekolah',
        isi: 'Sangat membantu jika siswa kelas XII diberikan akses latihan soal UTBK/SNBT mandiri lewat portal sekolah.',
        lampiran: null,
        isAnonim: false,
        prioritas: false,
        status: 'Selesai',
        isTerlambat: false,
        pelaporId: 'user_siswa_7',
        pelaporNama: 'Nabila Putri',
        pelaporRole: 'Siswa · XII IPS 2',
        tanggal: '18 Okt 2026 · 14:15 WIB',
        batasRespons: 'Selesai',
        penanggungJawab: 'Kurikulum & IT',
        tanggapan: [
            {
                id: 'resp_9',
                petugas: 'Tim IT Sekolah',
                tanggal: '20 Okt 2026 · 11:00 WIB',
                status: 'Selesai',
                isi: 'Fitur bank soal CBT telah diaktifkan di portal e-learning sekolah dengan 5 paket latihan perdana.'
            }
        ]
    },
    {
        id: 'TIK-2026-030',
        nomorTiket: '#TIK-2026-030',
        jenis: 'Pengaduan',
        kategori: 'Sarana & Prasarana',
        judul: 'Pintu Kamar Mandi Siswi Lantai 1 Tidak Bisa Dikunci dari Dalam',
        isi: 'Kunci gerendel pintu bilik nomor 2 patah sehingga siswa cemas saat memakai toilet.',
        lampiran: null,
        isAnonim: true,
        prioritas: false,
        status: 'Selesai',
        isTerlambat: false,
        pelaporId: 'user_siswa_8',
        pelaporNama: 'Dewi Anjani',
        pelaporRole: 'Siswa · X-A',
        tanggal: '15 Okt 2026 · 08:10 WIB',
        batasRespons: 'Selesai',
        penanggungJawab: 'Tata Usaha',
        tanggapan: [
            {
                id: 'resp_10',
                petugas: 'Staf Sarpras',
                tanggal: '15 Okt 2026 · 14:00 WIB',
                status: 'Selesai',
                isi: 'Gerendel baru telah dipasang dan seluruh kunci bilik toilet sudah dicek ulang.'
            }
        ]
    }
];

// Seed additional realistic records to make exactly 35 reports for total school analytics
(function seedAdditionalReports() {
    const categories = [
        'Sarana & Prasarana',
        'Sarana & Prasarana',
        'Akademik & Pembelajaran',
        'Kegiatan Kesiswaan / OSIS',
        'Sarana & Prasarana',
        'Akademik & Pembelajaran',
        'Sarana & Prasarana',
        'Kegiatan Kesiswaan / OSIS',
        'Sarana & Prasarana',
        'Akademik & Pembelajaran',
        'Kegiatan Kesiswaan / OSIS',
        'Sarana & Prasarana',
        'Sarana & Prasarana',
        'Akademik & Pembelajaran',
        'Kegiatan Kesiswaan / OSIS',
        'Sarana & Prasarana',
        'Akademik & Pembelajaran',
        'Sarana & Prasarana',
        'Kegiatan Kesiswaan / OSIS',
        'Sarana & Prasarana',
        'Akademik & Pembelajaran',
        'Kegiatan Kesiswaan / OSIS',
        'Sarana & Prasarana'
    ];

    const startNum = 29;
    for (let i = 0; i < categories.length; i++) {
        const num = (startNum - i).toString().padStart(2, '0');
        const cat = categories[i];
        const isAspirasi = cat === 'Kegiatan Kesiswaan / OSIS' || (i % 3 === 0);
        DEFAULT_REPORTS.push({
            id: `TIK-2026-0${num}`,
            nomorTiket: `#TIK-2026-0${num}`,
            jenis: isAspirasi ? 'Aspirasi' : 'Pengaduan',
            kategori: cat,
            judul: isAspirasi ? `Saran Peningkatan Mutu ${cat} (#${num})` : `Perbaikan Fasilitas & Layanan ${cat} (#${num})`,
            isi: `Catatan evaluasi berkala mengenai ${cat.toLowerCase()} untuk peningkatan standar layanan di lingkungan sekolah.`,
            lampiran: null,
            isAnonim: i % 2 === 0,
            prioritas: false,
            status: 'Selesai',
            isTerlambat: false,
            pelaporId: `user_siswa_${(i % 5) + 2}`,
            pelaporNama: `Siswa Sekolah #${num}`,
            pelaporRole: 'Siswa',
            tanggal: `${Math.max(1, 28 - i)} Okt 2026 · 10:00 WIB`,
            batasRespons: 'Selesai',
            penanggungJawab: cat.includes('Sarana') ? 'Tata Usaha' : (cat.includes('Akademik') ? 'Kurikulum' : 'Kesiswaan'),
            tanggapan: [
                {
                    id: `resp_seed_${num}`,
                    petugas: 'Petugas Penanggung Jawab Unit',
                    tanggal: `${Math.max(2, 29 - i)} Okt 2026 · 14:00 WIB`,
                    status: 'Selesai',
                    isi: 'Telah ditindaklanjuti dan diselesaikan sesuai SOP sekolah.'
                }
            ]
        });
    }
})();
