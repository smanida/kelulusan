
// GANTI ID_SHEET dengan ID Google Spreadsheet kamu


const CSV_URL = "https://docs.google.com/spreadsheets/d/1WLZwabnkJ-AjbmeJwHXnby3WiUe07qBc2A09Sv6O1kA/export?format=csv&gid=0";




// Waktu pengumuman: 4 Mei 2026 jam 16:00
const TARGET_DATE = new Date("2026-05-04T16:00:00");

// =======================
// COUNTDOWN
// =======================
const countdownEl = document.getElementById("countdown");
const formBox = document.getElementById("formBox");
const countdownBox = document.getElementById("countdownBox");

function updateCountdown() {
    const now = new Date();
    const diff = TARGET_DATE - now;

    if (diff <= 0) {
        countdownBox.style.display = "none";
        formBox.classList.remove("hidden");
        return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    countdownEl.innerHTML = `${d}h ${h}j ${m}m ${s}d`;
}

setInterval(updateCountdown, 1000);
updateCountdown();

// =======================
// CEK KELULUSAN
// =======================
async function cekKelulusan() {
    const nisnInput = document.getElementById("nisn").value.trim();
    const hasilDiv = document.getElementById("hasil");

    if (!nisnInput) {
        hasilDiv.innerHTML = "<p>Masukkan NISN!</p>";
        return;
    }

    hasilDiv.innerHTML = "<p>Loading...</p>";

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
            hasilDiv.innerHTML = "<p>NISN tidak ditemukan!</p>";
            return;
        }

        let status = siswa.keterangan?.toUpperCase();
        let statusClass = status === "LULUS" ? "lulus" : "tidak";

        let html = `
            <h3>${siswa.nama}</h3>
            <p>${siswa.kelas}</p>
            <p>Status: <span class="${statusClass}">${status}</span></p>
        `;

        if (status === "LULUS") {
            html += `
                <br>
                <a href="${siswa.skl}" target="_blank">
                    <button>Download SKL</button>
                </a>
                <a href="${siswa.skkb}" target="_blank">
                    <button>Download SKKB</button>
                </a>
            `;

            setTimeout(() => {
                alert("🎉 SELAMAT ANDA LULUS 🎉");
            }, 300);
        }

        hasilDiv.innerHTML = html;

    } catch (err) {
        hasilDiv.innerHTML = "<p>Gagal mengambil data!</p>";
        console.error(err);
    }
}
