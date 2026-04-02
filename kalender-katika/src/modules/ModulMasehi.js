import ModulDina from './ModulDina.js';
import ModulWewaran from './ModulWewaran.js';
import ModulWuku from './ModulWuku.js';
import ModulSasih from './ModulSasih.js';

class ModulMasehi {
    constructor() {
        this.mesinDina = new ModulDina();
        this.mesinWewaran = new ModulWewaran({ tri: 0, panca: 0, sad: 0, sapta: 0 });
        this.mesinWuku = new ModulWuku(0);
        this.mesinSasih = new ModulSasih(0);

        this.anchorDateWita = { year: 2025, month: 1, day: 1 };
    }

    konversiKeTika(waktuMasehi) {
        const dataSurya = this.terjemahkanSiklusSurya(waktuMasehi);
        const dataDina = this.mesinDina.getDinaIndex(waktuMasehi, dataSurya);

        const indexDinaUtuh = dataDina.indexHari;
        const wewaran = this.mesinWewaran.getAllWewaran(indexDinaUtuh);
        const wuku = this.mesinWuku.getWuku(indexDinaUtuh);
        const sasih = this.mesinSasih.getSasih(indexDinaUtuh);

        return {
            masehi: waktuMasehi,
            astronomi: {
                faseSaatIni: dataDina.fase,
                polaSaatIni: dataDina.pola,
                penandaAktif: dataDina.penandaAktif,
                matahariTerbit: dataDina.markers.sunrise,
                matahariTerbenam: dataDina.markers.sunset,
                indexDinaPenuh: dataDina.dinaPenuh,
                nilaiSiklusSurya: dataDina.siklusSurya
            },
            wewaran,
            wuku,
            sasih
        };
    }

    terjemahkanSiklusSurya(waktuMasehi) {
        const waktuWita = new Date(waktuMasehi.getTime() + 8 * 60 * 60 * 1000);
        const year = waktuWita.getUTCFullYear();
        const month = waktuWita.getUTCMonth() + 1;
        const day = waktuWita.getUTCDate();
        const minutes = waktuWita.getUTCHours() * 60 + waktuWita.getUTCMinutes();

        const sunrise = this.#fromWita(year, month, day, 5, 30);
        const sunset = this.#fromWita(year, month, day, 18, 0);

        let penandaAktif;
        let eventYear = year;
        let eventMonth = month;
        let eventDay = day;

        if (minutes < 330) {
            penandaAktif = 'sunset';
            const prev = new Date(Date.UTC(year, month - 1, day - 1));
            eventYear = prev.getUTCFullYear();
            eventMonth = prev.getUTCMonth() + 1;
            eventDay = prev.getUTCDate();
        } else if (minutes < 1080) {
            penandaAktif = 'sunrise';
        } else {
            penandaAktif = 'sunset';
        }

        const serialEvent = this.#serialEvent(eventYear, eventMonth, eventDay, penandaAktif);

        const tanggalWariga = minutes >= 1080
            ? new Date(Date.UTC(year, month - 1, day + 1))
            : new Date(Date.UTC(year, month - 1, day));

        return {
            serialEvent,
            penandaAktif,
            sunrise,
            sunset,
            tanggalWariga
        };
    }

    #serialEvent(year, month, day, type) {
        const tanggalEvent = new Date(Date.UTC(year, month - 1, day));
        const tanggalAnchor = new Date(Date.UTC(
            this.anchorDateWita.year,
            this.anchorDateWita.month - 1,
            this.anchorDateWita.day
        ));

        const selisihHari = Math.floor((tanggalEvent.getTime() - tanggalAnchor.getTime()) / (24 * 60 * 60 * 1000));

        if (type === 'sunset') {
            return 1 + (2 * selisihHari);
        }

        return 2 * selisihHari;
    }

    #fromWita(year, month, day, hour, minute) {
        return new Date(Date.UTC(year, month - 1, day, hour - 8, minute));
    }
}

export default ModulMasehi;
