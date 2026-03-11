import ModulMasehi from './modules/ModulMasehi.js';

class AppController {
    constructor() {
        // Inisialisasi Mesin Utama
        this.tikaEngine = new ModulMasehi();
        
        // Mulai aplikasi
        this.init();
    }

    init() {
        // Jalankan update pertama kali segera
        this.renderDashboard();
        
        // Set pembaruan setiap detik agar jam berjalan dan transisi fase dinamis
        setInterval(() => this.renderDashboard(), 1000);
    }

    formatWaktu(dateObj) {
        return dateObj.toLocaleTimeString('id-ID', { hour12: false });
    }

    renderDashboard() {
        const waktuSekarang = new Date();
        
        // Ambil data lengkap dari integrator
        const dataTika = this.tikaEngine.konversiKeTika(waktuSekarang);

        // --- UPDATE UI ASTRONOMI ---
        document.getElementById('waktu-masehi').innerText = waktuSekarang.toLocaleString('id-ID');
        document.getElementById('waktu-terbit').innerText = this.formatWaktu(dataTika.astronomi.matahariTerbit);
        document.getElementById('waktu-terbenam').innerText = this.formatWaktu(dataTika.astronomi.matahariTerbenam);
        
        // Render Fase (Misal: "Fase A (Malam)" atau "Fase B (Siang)")
        const teksFase = dataTika.astronomi.faseSaatIni === 'A' ? 'Fase A (Malam)' : 'Fase B (Siang)';
        document.getElementById('fase-dina').innerText = teksFase;

        // --- UPDATE UI WUKU & SASIH ---
        document.getElementById('wuku-teks').innerText = `${dataTika.wuku.nama} (${dataTika.wuku.urutan})`;
        document.getElementById('sasih-teks').innerText = `Sasih ${dataTika.sasih.nama} (${dataTika.sasih.urutanSasih})`;
        
        // Tampilkan fase sasih (misal: "Penanggal 10")
        document.getElementById('fase-sasih').innerText = `${dataTika.sasih.fase} ${dataTika.sasih.angkaFase}`;
        
        // Jika sedang Purnama atau Tilem, teksnya akan muncul
        document.getElementById('puncak-sasih').innerText = dataTika.sasih.puncakCandra ? `🌟 ${dataTika.sasih.puncakCandra} 🌟` : '';

        // --- UPDATE UI WEWARAN ---
        const w = dataTika.wewaran;
        document.getElementById('eka-wara').innerText = w.eka;
        document.getElementById('dwi-wara').innerText = w.dwi;
        document.getElementById('tri-wara').innerText = w.tri;
        document.getElementById('catur-wara').innerText = w.catur;
        document.getElementById('panca-wara').innerText = w.panca;
        document.getElementById('sad-wara').innerText = w.sad;
        document.getElementById('sapta-wara').innerText = w.sapta;
        document.getElementById('asta-wara').innerText = w.asta;
        document.getElementById('sanga-wara').innerText = w.sanga;
        document.getElementById('dasa-wara').innerText = w.dasa;
    }
}

// Jalankan AppController saat DOM sudah siap
document.addEventListener('DOMContentLoaded', () => {
    new AppController();
});