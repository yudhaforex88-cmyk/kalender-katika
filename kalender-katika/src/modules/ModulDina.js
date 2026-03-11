import ModulDina from './modules/ModulDina.js';

class AppController {
    constructor() {
        // Menginisialisasi modul utama
        this.mesinDina = new ModulDina();
        this.displayElement = document.getElementById('output-dina');
        
        this.init();
    }

    init() {
        // Jalankan siklus pembaruan setiap detik
        this.updateDashboard();
        setInterval(() => this.updateDashboard(), 1000);
    }

    updateDashboard() {
        const waktuSekarang = new Date();
        const dataDina = this.mesinDina.getDinaIndex(waktuSekarang);

        // Format output untuk ditampilkan ke HTML
        this.displayElement.innerHTML = `
            <strong>Waktu Masehi:</strong> ${waktuSekarang.toLocaleString('id-ID')}<br><br>
            <strong>Indeks Dina:</strong> ${dataDina.dinaPenuh} / ${dataDina.cycle.reset_setelah}<br>
            <strong>Fase Aktif:</strong> ${dataDina.fase} <br>
            <strong>Sisa Siklus:</strong> ${dataDina.cycle.sisa_siklus} dina<br><br>
            <span class="text-gray-500 text-xs">
                Matahari Terbit: ${dataDina.markers.sunrise.toLocaleTimeString('id-ID')} | 
                Matahari Terbenam: ${dataDina.markers.sunset.toLocaleTimeString('id-ID')}
            </span>
        `;
    }
}

// Jalankan aplikasi saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
    new AppController();
});