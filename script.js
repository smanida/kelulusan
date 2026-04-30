
// GANTI ID_SHEET dengan ID Google Spreadsheet kamu


const CSV_URL = "https://docs.google.com/spreadsheets/d/1WLZwabnkJ-AjbmeJwHXnby3WiUe07qBc2A09Sv6O1kA/export?format=csv&gid=0";


async function cekKelulusan() {
    const nisnInput = document.getElementById("nisn").value.trim();
    const hasilDiv = document.getElementById("hasil");

    if (!nisnInput) {
        hasilDiv.innerHTML = "<p>Masukkan NISN!</p>";
        return;
    }

    hasilDiv.innerHTML = "<p>Loading...</p>";

    try {
        const response = await fetch(CSV_URL);

        // DEBUG penting
        if (!response.ok) {
            throw new Error("HTTP error: " + response.status);
        }

        const text = await response.text();

        if (!text || text.includes("<!DOCTYPE html>")) {
            throw new Error("Data bukan CSV (kemungkinan belum public)");
        }

        const rows = text.trim().split("\n").map(r => r.split(","));
        const headers = rows[0];

        const data = rows.slice(1).map(row => {
            let obj = {};
            headers.forEach((h, i) => {
                obj[h.trim()] = row[i]?.trim();
            });
            return obj;
        });

        const siswa = data.find(s => s.nisn === nisnInput);

        if (!siswa) {
            hasilDiv.innerHTML = "<p>NISN tidak ditemukan!</p>";
            return;
        }

        let statusClass = siswa.keterangan === "LULUS" ? "lulus" : "tidak";

        let html = `
            <h3>${siswa.nama}</h3>
            <p>Kelas: ${siswa.kelas}</p>
            <p>Status: <span class="${statusClass}">${siswa.keterangan}</span></p>
        `;

        if (siswa.keterangan === "LULUS") {
            html += `
                <br>
                <a href="${siswa.skl}" target="_blank">
                    <button>Download SKL</button>
                </a>
                <a href="${siswa.skkb}" target="_blank">
                    <button>Download SKKB</button>
                </a>
            `;
        }

        hasilDiv.innerHTML = html;

    } catch (error) {
        console.error("ERROR:", error);
        hasilDiv.innerHTML = `
            <p style="color:red;">Gagal mengambil data!</p>
            <small>${error.message}</small>
        `;
    }
}