import ModulMasehi from './modules/ModulMasehi.js';

class AppController {
    constructor() {
        this.tikaEngine = new ModulMasehi();
        this.errorAktif = false;
        this.init();
    }

    init() {
        this.renderDashboard();
        setInterval(() => this.renderDashboard(), 1000);
    }

    formatWaktu(dateObj) {
        return dateObj.toLocaleTimeString('id-ID', { hour12: false });
    }

    setText(id, value) {
        const el = document.getElementById(id);
        if (!el) return;
        el.innerText = value;
    }

    renderStatusIntegrasi(statusIntegrasi) {
        const ringkas = Object.entries(statusIntegrasi)
            .map(([modul, status]) => `${modul}:${status}`)
            .join(' | ');

        this.setText('status-integrasi', ringkas);
        this.setText('status-error', this.errorAktif ? 'Terjadi gangguan modul.' : 'Semua modul terhubung normal.');
    }

    renderDashboard() {
        try {
            const waktuSekarang = new Date();
            const dataTika = this.tikaEngine.konversiKeTika(waktuSekarang);
            this.errorAktif = false;

            this.setText('waktu-masehi', waktuSekarang.toLocaleString('id-ID'));
            this.setText('waktu-terbit', this.formatWaktu(dataTika.astronomi.matahariTerbit));
            this.setText('waktu-terbenam', this.formatWaktu(dataTika.astronomi.matahariTerbenam));

            const teksFase = dataTika.astronomi.faseSaatIni === 'A' ? 'Fase A (Malam)' : 'Fase B (Siang)';
            this.setText('fase-dina', teksFase);

            this.setText('wuku-teks', `${dataTika.wuku.nama} (${dataTika.wuku.urutan})`);
            this.setText('sasih-teks', `Sasih ${dataTika.sasih.nama} (${dataTika.sasih.urutanSasih})`);
            this.setText('fase-sasih', `${dataTika.sasih.fase} ${dataTika.sasih.angkaFase}`);
            this.setText('puncak-sasih', dataTika.sasih.puncakCandra ? `🌟 ${dataTika.sasih.puncakCandra} 🌟` : '');

            const w = dataTika.wewaran;
            this.setText('eka-wara', w.eka);
            this.setText('dwi-wara', w.dwi);
            this.setText('tri-wara', w.tri);
            this.setText('catur-wara', w.catur);
            this.setText('panca-wara', w.panca);
            this.setText('sad-wara', w.sad);
            this.setText('sapta-wara', w.sapta);
            this.setText('asta-wara', w.asta);
            this.setText('sanga-wara', w.sanga);
            this.setText('dasa-wara', w.dasa);

            this.renderStatusIntegrasi(dataTika.statusIntegrasi);
        } catch (error) {
            this.errorAktif = true;
            this.setText('status-integrasi', 'sinkronisasi gagal');
            this.setText('status-error', error.message);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AppController();
});
