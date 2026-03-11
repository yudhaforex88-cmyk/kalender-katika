class ModulWewaran {
    constructor(anchorOffsets = {}) {
        // Offset kalibrasi untuk mencocokkan titik nol (Anchor Date: 1940-06-20 Sunset)
        this.offsets = {
            tri: anchorOffsets.tri || 0,
            panca: anchorOffsets.panca || 0,
            sad: anchorOffsets.sad || 0,
            sapta: anchorOffsets.sapta || 0
        };

        // Database Wewaran (Siklus Murni)
        // Triwara menggunakan susunan kustom dengan panjang siklus 4
        this.wewaran = {
            triKustom: ["Kajeng", "Pasah", "Beteng", "Pasah"], 
            panca: ["Umanis", "Paing", "Pon", "Wage", "Kliwon"],
            sad: ["Tungleh", "Aryang", "Urukung", "Paniron", "Was", "Maulu"],
            sapta: ["Redite", "Coma", "Anggara", "Buda", "Wraspati", "Sukra", "Saniscara"]
        };

        // Database Wewaran (Siklus Turunan / Berbasis Urip)
        this.turunan = {
            eka: ["Suwung", "Luang"], // 0: Suwung (Genap), 1: Luang (Ganjil)
            dwi: ["Menga", "Pepet"],  // 0: Menga (Ganjil), 1: Pepet (Genap) - dibalik logikanya dari Eka
            catur: ["Sri", "Laba", "Jaya", "Menala"],
            asta: ["Sri", "Indra", "Guru", "Yama", "Ludra", "Brahma", "Kala", "Uma"],
            sanga: ["Dangu", "Jangur", "Gigis", "Nohan", "Ogan", "Erangan", "Urungan", "Tulus", "Dadi"],
            dasa: ["Pandita", "Pati", "Suka", "Duka", "Sri", "Manuh", "Manusa", "Raja", "Dewa", "Raksasa"]
        };

        // Tabel Urip Baku Wariga
        this.uripPanca = { "Umanis": 5, "Paing": 9, "Pon": 7, "Wage": 4, "Kliwon": 8 };
        this.uripSapta = { "Redite": 5, "Coma": 4, "Anggara": 3, "Buda": 7, "Wraspati": 8, "Sukra": 6, "Saniscara": 9 };
    }

    /**
     * Algoritma Cakepan Murni
     */
    hitungCakepan(indexDina, panjangSiklus, offset) {
        let posisi = (indexDina + offset) % panjangSiklus;
        if (posisi < 0) posisi += panjangSiklus; // Handle perhitungan mundur sebelum Anchor Date
        return posisi;
    }

    // --- SIKLUS MURNI (Berputar sesuai index Dina) ---

    getTriwara(indexDina) {
        // Menggunakan array kustom dengan panjang 4
        const index = this.hitungCakepan(indexDina, 4, this.offsets.tri);
        return this.wewaran.triKustom[index];
    }

    getPancawara(indexDina) {
        const index = this.hitungCakepan(indexDina, 5, this.offsets.panca);
        const nama = this.wewaran.panca[index];
        return { nama, urip: this.uripPanca[nama] };
    }

    getSadwara(indexDina) {
        const index = this.hitungCakepan(indexDina, 6, this.offsets.sad);
        return this.wewaran.sad[index];
    }

    getSaptawara(indexDina) {
        const index = this.hitungCakepan(indexDina, 7, this.offsets.sapta);
        const nama = this.wewaran.sapta[index];
        return { nama, urip: this.uripSapta[nama] };
    }

    // --- SIKLUS TURUNAN (Berputar berdasarkan jumlah Urip) ---

    getWewaranTurunan(namaSapta, namaPanca) {
        const totalUrip = this.uripSapta[namaSapta] + this.uripPanca[namaPanca];

        const eka = this.turunan.eka[totalUrip % 2 !== 0 ? 1 : 0];
        const dwi = this.turunan.dwi[totalUrip % 2 !== 0 ? 0 : 1];
        
        // Catur, Asta, Sanga, Dasa dihitung dengan cakepan dari total Urip
        // Dikurangi 1 (-1) karena array zero-indexed, sedangkan Urip dihitung dari 1
        const catur = this.turunan.catur[this.hitungCakepan(totalUrip, 4, -1)];
        const asta = this.turunan.asta[this.hitungCakepan(totalUrip, 8, -1)];
        const sanga = this.turunan.sanga[this.hitungCakepan(totalUrip, 9, -1)];
        const dasa = this.turunan.dasa[this.hitungCakepan(totalUrip, 10, -1)];

        return { eka, dwi, catur, asta, sanga, dasa, totalUrip };
    }

    // --- SANG INTEGRATOR WEWARAN ---

    getAllWewaran(indexDina) {
        const tri = this.getTriwara(indexDina);
        const panca = this.getPancawara(indexDina);
        const sad = this.getSadwara(indexDina);
        const sapta = this.getSaptawara(indexDina);
        
        const turunan = this.getWewaranTurunan(sapta.nama, panca.nama);

        return {
            eka: turunan.eka,
            dwi: turunan.dwi,
            tri: tri,
            catur: turunan.catur,
            panca: panca.nama,
            sad: sad,
            sapta: sapta.nama,
            asta: turunan.asta,
            sanga: turunan.sanga,
            dasa: turunan.dasa,
            totalUrip: turunan.totalUrip
        };
    }
}

export default ModulWewaran;