// Fungsi untuk menambahkan wallpaper dari Unsplash
function loadWallpapers(query = null) {
    const grid = document.getElementById("wallpaper-grid");
    grid.innerHTML = ""; // Kosongkan grid sebelum tambah baru

    const defaultThemes = ["neon", "space", "cyberpunk", "nature", "abstract", "futuristic", "urban"];
    const wallpaperCount = 12; // Jumlah wallpaper per load
    let theme = query;

    for (let i = 0; i < wallpaperCount; i++) {
        if (!query) {
            theme = defaultThemes[Math.floor(Math.random() * defaultThemes.length)];
        }
        const imageUrl = `https://source.unsplash.com/random/300x400?wallpaper,${theme}`;
        const finalUrl = `https://unsplash.com/s/photos/${theme.replace(/\s+/g, "-")}`;
        
        const card = document.createElement("div");
        card.className = "wallpaper-card";
        card.innerHTML = `
            <img src="${imageUrl}" alt="Wallpaper ${i + 1}">
            <h3>${theme.charAt(0).toUpperCase() + theme.slice(1)}</h3>
            <a href="#" class="download-btn" data-final-url="${finalUrl}">Download</a>
        `;
        grid.appendChild(card);
    }

    // Tambahkan event listener untuk tombol download
    document.querySelectorAll(".download-btn").forEach(button => {
        button.addEventListener("click", handleDownload);
    });
}

// Fungsi untuk menangani klik download dengan Direct Link Adsterra
function handleDownload(event) {
    event.preventDefault();
    const directLink = "https://www.effectiveratecpm.com/ytydge8ted?key=f4e596ec641bf679bcc201d281e1ce64"; // Direct Link Anda
    const finalUrl = event.target.getAttribute("data-final-url");

    // Buka Direct Link di tab baru
    const adWindow = window.open(directLink, "_blank");
    
    // Redirect ke Unsplash setelah jeda 15 detik
    setTimeout(() => {
        if (adWindow) adWindow.close(); // Tutup tab iklan (opsional)
        window.open(finalUrl, "_blank"); // Buka Unsplash
    }, 15000); // Jeda 15 detik
}

// Load wallpaper saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
    const hero = document.querySelector(".hero");
    hero.style.opacity = 0;
    setTimeout(() => {
        hero.style.transition = "opacity 1s ease";
        hero.style.opacity = 1;
    }, 100);

    loadWallpapers(); // Load awal dengan tema acak

    // Event listener untuk tombol download di hero section
    document.querySelectorAll(".download-btn").forEach(button => {
        button.addEventListener("click", handleDownload);
    });
});

// Refresh wallpaper saat tombol diklik
document.getElementById("refresh-btn").addEventListener("click", () => {
    loadWallpapers(); // Load acak lagi
});

// Pencarian wallpaper saat tombol search diklik
document.getElementById("search-btn").addEventListener("click", () => {
    const query = document.getElementById("search-input").value.trim().toLowerCase();
    if (query) {
        loadWallpapers(query); // Load berdasarkan pencarian
    } else {
        loadWallpapers(); // Kembali ke acak jika kosong
    }
});

// Pencarian saat tekan Enter di input
document.getElementById("search-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const query = e.target.value.trim().toLowerCase();
        if (query) {
            loadWallpapers(query);
        } else {
            loadWallpapers();
        }
    }
});