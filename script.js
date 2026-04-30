
// GANTI ID_SHEET dengan ID Google Spreadsheet kamu


const CSV_URL = "https://docs.google.com/spreadsheets/d/1WLZwabnkJ-AjbmeJwHXnby3WiUe07qBc2A09Sv6O1kA/export?format=csv&gid=0";



// 4 Mei 2026 jam 16:00
const TARGET_DATE = new Date("2020-05-04T16:00:00");

const countdownEl = document.getElementById("countdown");
const formBox = document.getElementById("formBox");
const countdownBox = document.getElementById("countdownBox");

function updateCountdown() {
    const now = new Date();
    const diff = TARGET_DATE - now;

    if (diff <= 0) {
        countdownBox.classList.add("d-none");
        formBox.classList.remove("d-none");
        return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    countdownEl.innerHTML = `${d} hari ${h} jam ${m} menit ${s} detik`;
}

setInterval(updateCountdown, 1000);
updateCountdown();

async function cekKelulusan() {
    const nisnInput = document.getElementById("nisn").value.trim();
    const hasilDiv = document.getElementById("hasil");

    if (!nisnInput) {
        hasilDiv.innerHTML = `<div class="alert alert-warning">Masukkan NISN!</div>`;
        return;
    }

    hasilDiv.innerHTML = `<div class="text-muted">Loading...</div>`;

    try {
        const res = await fetch(CSV_URL);
        const text = await res.text();

        const rows = text.trim().split("\n").map(r => r.split(","));
        const headers = rows[0].map(h => h.trim().toLowerCase());

        const data = rows.slice(1).map(row => {
            let obj = {};
            headers.forEach((h, i) => obj[h] = row[i]?.trim());
            return obj;
        });

        const siswa = data.find(s => s.nisn === nisnInput);

        if (!siswa) {
            hasilDiv.innerHTML = `<div class="alert alert-danger">NISN tidak ditemukan</div>`;
            return;
        }

        let status = siswa.keterangan?.toUpperCase();
        let badge = status === "LULUS" ? "success" : "danger";

        let html = `
            <h5>${siswa.nama}</h5>
            <p class="mb-1">${siswa.kelas}</p>
            <span class="badge bg-${badge}">${status}</span>
        `;

        if (status === "LULUS") {
            html += `
                <div class="mt-3">
                    <a href="${siswa.skl}" target="_blank" class="btn btn-success btn-sm mb-2 w-100">
                        Download SKL
                    </a>
                    <a href="${siswa.skkb}" target="_blank" class="btn btn-secondary btn-sm w-100">
                        Download SKKB
                    </a>
                </div>
            `;

            setTimeout(() => {
                alert("Selamat! Anda LULUS 🎉");
            }, 300);
        }

        hasilDiv.innerHTML = html;

    } catch (err) {
        hasilDiv.innerHTML = `<div class="alert alert-danger">Gagal mengambil data</div>`;
        console.error(err);
    }
}
