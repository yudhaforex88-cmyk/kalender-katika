class ModulSasih {
    constructor(anchorOffset = 0) {
        // Offset kalibrasi untuk mencocokkan titik nol dengan Anchor Date (1940-06-20)
        // Diisi angka 0-359 untuk menyelaraskan jatuhnya sasih pada tanggal tersebut
        this.offset = anchorOffset;
        
        // Konstanta siklus Sasih Ka-Tika
        this.dinaPerSasih = 30;
        this.panjangSiklusTahun = 360; // 12 Sasih x 30 Dina

        // Database 12 Sasih Bali
        this.daftarSasih = [
            "Kasa", "Karo", "Katiga", "Kapat", "Kalima", "Kanem", 
            "Kapitu", "Kaulu", "Kasanga", "Kedasa", "Jyestha", "Sadha"
        ];
    }

    /**
     * Mengambil data Sasih dan Fase Bulan kustom (interval 10 dina)
     * @param {number} indexDina - Index dina linier dari Modul Masehi
     */
    getSasih(indexDina) {
        // 1. Cari posisi dalam siklus 1 tahun (0 - 359)
        let posisiTahun = (indexDina + this.offset) % this.panjangSiklusTahun;
        if (posisiTahun < 0) posisiTahun += this.panjangSiklusTahun;

        // 2. Tentukan Index Sasih (0 - 11)
        const indexSasih = Math.floor(posisiTahun / this.dinaPerSasih);
        
        // 3. Tentukan Dina ke-berapa di dalam Sasih tersebut (1 - 30)
        const dinaSasihKe = (posisiTahun % this.dinaPerSasih) + 1;

        // 4. Logika Pola A dan Pola B (Pola berganti setiap ganti sasih)
        // Jika Sasih Genap (Index 0, 2, 4...) = Pola A
        // Jika Sasih Ganjil (Index 1, 3, 5...) = Pola B
        const isPolaA = (indexSasih % 2 === 0);
        
        // 5. Penentuan Fase (Penanggal/Panglong) dengan interval 10 dina
        // intervalBlock akan bernilai 0 (dina 1-10), 1 (dina 11-20), atau 2 (dina 21-30)
        const intervalBlock = Math.floor((dinaSasihKe - 1) / 10);
        const angkaFase = ((dinaSasihKe - 1) % 10) + 1; // Akan selalu berputar 1-10

        let namaFase = "";
        let puncak = ""; // Menyimpan status Purnama atau Tilem

        if (isPolaA) {
            // Pola A: Tilem -> Purnama -> Tilem -> Purnama
            if (intervalBlock === 0) { namaFase = "Penanggal"; if (angkaFase === 10) puncak = "Purnama"; }
            else if (intervalBlock === 1) { namaFase = "Panglong"; if (angkaFase === 10) puncak = "Tilem"; }
            else if (intervalBlock === 2) { namaFase = "Penanggal"; if (angkaFase === 10) puncak = "Purnama"; }
        } else {
            // Pola B: Purnama -> Tilem -> Purnama -> Tilem
            if (intervalBlock === 0) { namaFase = "Panglong"; if (angkaFase === 10) puncak = "Tilem"; }
            else if (intervalBlock === 1) { namaFase = "Penanggal"; if (angkaFase === 10) puncak = "Purnama"; }
            else if (intervalBlock === 2) { namaFase = "Panglong"; if (angkaFase === 10) puncak = "Tilem"; }
        }

        return {
            nama: this.daftarSasih[indexSasih],
            urutanSasih: indexSasih + 1,
            dinaSasihKe: dinaSasihKe,     // Angka absolut dalam 1 sasih (1-30)
            fase: namaFase,               // Penanggal / Panglong
            angkaFase: angkaFase,         // 1 - 10
            puncakCandra: puncak,         // "Purnama", "Tilem", atau string kosong ""
            _pola: isPolaA ? 'A' : 'B'    // Disembunyikan untuk keperluan internal/debugging
        };
    }
}

export default ModulSasih;