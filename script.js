// YouTube API Key
const YOUTUBE_API_KEY = "AIzaSyBT-lB5jJk1tnROcIoI908aS9U-af2q9-8";

// Simulasi poin pengguna (disimpan di localStorage)
let userPoints = localStorage.getItem("userPoints") ? parseInt(localStorage.getItem("userPoints")) : 0;
document.getElementById("user-points").textContent = userPoints;

// Fungsi untuk mengambil video YouTube via API untuk latar belakang
function loadYouTubeBackground() {
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=futuristic+wallpaper&key=${YOUTUBE_API_KEY}&maxResults=1`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.items && data.items.length > 0) {
                const videoId = data.items[0].id.videoId;
                const youtubeIframe = document.getElementById("youtube-bg");
                youtubeIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&iv_load_policy=3`;
            }
        })
        .catch(error => console.error("Error fetching YouTube video:", error));
}

// Fungsi untuk memuat video unggulan di beranda
function loadFeaturedVideo() {
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=trending+short+video&key=${YOUTUBE_API_KEY}&maxResults=1`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.items && data.items.length > 0) {
                const videoId = data.items[0].id.videoId;
                const featuredVideo = document.getElementById("featured-video");
                const watchBtn = document.querySelector(".watch-btn");
                featuredVideo.src = `https://www.youtube.com/embed/${videoId}`;
                watchBtn.setAttribute("data-video-id", videoId);
            }
        })
        .catch(error => console.error("Error fetching featured video:", error));
}

// Fungsi untuk menangani klik tombol "Watch Now"
function handleWatchVideo(event) {
    event.preventDefault();
    const directLink = "https://www.effectiveratecpm.com/ytydge8ted?key=f4e596ec641bf679bcc201d281e1ce64";
    const videoId = event.target.getAttribute("data-video-id");
    const finalUrl = `https://www.youtube.com/watch?v=${videoId}`;

    const adWindow = window.open(directLink, "_blank");
    setTimeout(() => {
        if (adWindow) adWindow.close();
        window.open(finalUrl, "_blank");
    }, 15000);
}

// Fungsi misi harian: menonton video
function watchMissionVideo() {
    const videoIframe = document.getElementById("mission-video");
    videoIframe.style.display = "block";
    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=short+ad&key=${YOUTUBE_API_KEY}&maxResults=1`)
        .then(response => response.json())
        .then(data => {
            if (data.items && data.items.length > 0) {
                const videoId = data.items[0].id.videoId;
                videoIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                setTimeout(() => {
                    videoIframe.style.display = "none";
                    videoIframe.src = "";
                    userPoints += 10;
                    localStorage.setItem("userPoints", userPoints);
                    document.getElementById("user-points").textContent = userPoints;
                    alert("You earned 10 points!");
                }, 30000); // 30 detik
            }
        });
}

// Simulasi kehadiran harian
function checkAttendance() {
    userPoints += 5;
    localStorage.setItem("userPoints", userPoints);
    document.getElementById("user-points").textContent = userPoints;
    alert("You earned 5 points for checking in!");
}

// Simulasi penarikan
function withdrawPoints() {
    if (userPoints >= 100) {
        userPoints -= 100;
        localStorage.setItem("userPoints", userPoints);
        document.getElementById("user-points").textContent = userPoints;
        alert("Withdrawal successful! Rp 1,000 sent to DANA (simulated).");
    } else {
        alert("You need at least 100 points to withdraw!");
    }
}

// Simulasi undang teman
function inviteFriend() {
    userPoints += 20;
    localStorage.setItem("userPoints", userPoints);
    document.getElementById("user-points").textContent = userPoints;
    alert("You earned 20 points for inviting a friend (simulated)!");
}

// Load saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
    const hero = document.querySelector(".hero");
    hero.style.opacity = 0;
    setTimeout(() => {
        hero.style.transition = "opacity 1s ease";
        hero.style.opacity = 1;
    }, 100);

    loadYouTubeBackground();
    loadFeaturedVideo();

    document.querySelector(".watch-btn").addEventListener("click", handleWatchVideo);
    document.getElementById("watch-video-btn").addEventListener("click", watchMissionVideo);
    document.getElementById("attendance-btn").addEventListener("click", checkAttendance);
    document.getElementById("withdraw-btn").addEventListener("click", withdrawPoints);
    document.getElementById("invite-btn").addEventListener("click", inviteFriend);
    document.getElementById("register-btn").addEventListener("click", () => alert("Registration simulated!"));
});
