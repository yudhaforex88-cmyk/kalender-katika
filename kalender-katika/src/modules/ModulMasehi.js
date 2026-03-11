// Di dalam src/modules/ModulMasehi.js

import ModulDina from './ModulDina.js';
import ModulWewaran from './ModulWewaran.js';
import ModulWuku from './ModulWuku.js';
import ModulSasih from './ModulSasih.js'; // <-- Import Modul Sasih

class ModulMasehi {
    constructor() {
        this.mesinDina = new ModulDina();
        this.mesinWewaran = new ModulWewaran({ tri: 0, panca: 0, sad: 0, sapta: 0 });
        this.mesinWuku = new ModulWuku(0);
        this.mesinSasih = new ModulSasih(0); // <-- Inisialisasi Modul Sasih
    }

    konversiKeTika(waktuMasehi) {
        const dataDina = this.mesinDina.getDinaIndex(waktuMasehi);
        
        let indexDinaUtuh = dataDina.indexHari;
        if (dataDina.fase === "A" && waktuMasehi >= dataDina.markers.sunset) {
            indexDinaUtuh += 1; 
        }

        const wewaran = this.mesinWewaran.getAllWewaran(indexDinaUtuh);
        const wuku = this.mesinWuku.getWuku(indexDinaUtuh);
        const sasih = this.mesinSasih.getSasih(indexDinaUtuh); // <-- Eksekusi Sasih

        return {
            masehi: waktuMasehi,
            astronomi: {
                faseSaatIni: dataDina.fase,
                matahariTerbit: dataDina.markers.sunrise,
                matahariTerbenam: dataDina.markers.sunset,
                indexDinaPenuh: dataDina.dinaPenuh 
            },
            wewaran: wewaran,
            wuku: wuku,
            sasih: sasih // <-- Sisipkan ke objek balasan
        };
    }
}

export default ModulMasehi;