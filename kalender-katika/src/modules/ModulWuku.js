class ModulWuku {
    constructor(anchorOffset = 0) {
        // Offset kalibrasi untuk mencocokkan titik nol dengan Anchor Date (1940-06-20)
        // Diisi angka 0-209 untuk menyelaraskan Wuku pada tanggal tersebut
        this.offset = anchorOffset;
        
        // Panjang satu siklus penuh Pawukon (30 Wuku x 7 Dina)
        this.panjangSiklus = 210;

        // Database 30 Wuku standar Wariga Bali
        this.daftarWuku = [
            "Sinta", "Landep", "Ukir", "Kulantir", "Tolu", 
            "Gumbreg", "Wariga", "Warigadean", "Julungwangi", "Sungsang", 
            "Dungulan", "Kuningan", "Langkir", "Medangsia", "Pujut", 
            "Pahang", "Krulut", "Merakih", "Tambir", "Medangkungan", 
            "Matal", "Uye", "Menail", "Prangbakat", "Bala", 
            "Ugu", "Wayang", "Kelawu", "Dukut", "Watugunung"
        ];
    }

    /**
     * Mengambil data Wuku berdasarkan Index Dina Utuh
     * @param {number} indexDina - Index dina linier dari Modul Masehi
     * @returns {object} - Nama Wuku dan urutannya (1-30)
     */
    getWuku(indexDina) {
        // 1. Cari posisi dina dalam siklus 210 (0 - 209)
        let posisiSiklus = (indexDina + this.offset) % this.panjangSiklus;
        
        // Handle perhitungan mundur (sebelum tahun 1940)
        if (posisiSiklus < 0) posisiSiklus += this.panjangSiklus;

        // 2. Tentukan Index Wuku (0 - 29) dengan membagi 7
        // Math.floor digunakan agar selama 7 dina beruntun, indexnya tetap sama
        const indexWuku = Math.floor(posisiSiklus / 7);

        return {
            nama: this.daftarWuku[indexWuku],
            urutan: indexWuku + 1, // Untuk keperluan tampilan (Wuku ke-1 s.d 30)
            sisaDina: 6 - (posisiSiklus % 7) // (Opsional) Mengetahui sisa dina sebelum ganti Wuku
        };
    }
}

export default ModulWuku;