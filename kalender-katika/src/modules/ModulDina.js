class ModulDina {
    constructor() {
        this.resetSiklus = 420;
        this.resetSiklusSurya = 6;
    }

    getDinaIndex(waktuMasehi, dataMasehi = null) {
        const dataSurya = dataMasehi || this.#hitungSiklusSurya(waktuMasehi);

        const serialEvent = dataSurya.serialEvent;
        const nilaiSiklusSurya = this.#wrap(serialEvent, this.resetSiklusSurya);
        const nilaiDina = this.#wrap(serialEvent, this.resetSiklus);

        const blokPola = Math.floor((serialEvent - 1) / 3);
        const pola = blokPola % 2 === 0 ? 'ganjil' : 'genap';

        const selisihHari = this.#dayDiff(
            dataSurya.tanggalWariga,
            new Date(Date.UTC(2025, 0, 2))
        );

        return {
            indexHari: selisihHari,
            dinaPenuh: nilaiDina,
            fase: pola === 'ganjil' ? 'A' : 'B',
            pola,
            penandaAktif: dataSurya.penandaAktif,
            siklusSurya: nilaiSiklusSurya,
            serialEvent,
            markers: {
                sunrise: dataSurya.sunrise,
                sunset: dataSurya.sunset
            },
            cycle: {
                reset_setelah: this.resetSiklus,
                sisa_siklus: this.resetSiklus - nilaiDina
            }
        };
    }

    #hitungSiklusSurya(waktuMasehi) {
        throw new Error('ModulDina membutuhkan data terjemahan dari ModulMasehi.');
    }

    #wrap(nilai, modulus) {
        return ((nilai - 1) % modulus + modulus) % modulus + 1;
    }

    #dayDiff(a, b) {
        const msPerDay = 24 * 60 * 60 * 1000;
        return Math.floor((a.getTime() - b.getTime()) / msPerDay);
    }
}

export default ModulDina;
