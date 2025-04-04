// YouTube API Key
const YOUTUBE_API_KEY = "AIzaSyBT-lB5jJk1tnROcIoI908aS9U-af2q9-8";

// Variabel pengguna
let currentUser = null;
let userPoints = 0;

// Fungsi untuk mengambil video YouTube untuk latar belakang
function loadYouTubeBackground() {
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=futuristic+wallpaper&key=${YOUTUBE_API_KEY}&maxResults=1`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.items && data.items.length > 0) {
                const videoId = data.items[0].id.videoId;
                document.getElementById("youtube-bg").src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&iv_load_policy=3`;
            }
        })
        .catch(error => console.error("Error fetching YouTube video:", error));
}

// Fungsi untuk memuat video unggulan
function loadFeaturedVideo() {
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=trending+short+video&key=${YOUTUBE_API_KEY}&maxResults=1`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.items && data.items.length > 0) {
                const videoId = data.items[0].id.videoId;
                document.getElementById("featured-video").src = `https://www.youtube.com/embed/${videoId}`;
                document.querySelector(".watch-btn").setAttribute("data-video-id", videoId);
            }
        })
        .catch(error => console.error("Error fetching featured video:", error));
}

// Fungsi untuk menangani klik "Watch Now"
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

// Fungsi misi harian
function watchMissionVideo() {
    if (!currentUser) {
        alert("Please register or login first!");
        return;
    }
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
                    updateUserPoints();
                    alert("You earned 10 points!");
                }, 30000); // 30 detik
            }
        });
}

// Fungsi untuk memperbarui poin di Firestore
function updateUserPoints() {
    if (currentUser) {
        setDoc(doc(db, "users", currentUser.uid), {
            email: currentUser.email,
            points: userPoints
        }, { merge: true });
        document.getElementById("user-points").textContent = userPoints;
    }
}

// Fungsi untuk memuat poin pengguna
function loadUserPoints() {
    if (currentUser) {
        getDoc(doc(db, "users", currentUser.uid)).then(docSnap => {
            if (docSnap.exists()) {
                userPoints = docSnap.data().points || 0;
                document.getElementById("user-points").textContent = userPoints;
            }
        });
    }
}

// Fungsi kehadiran
function checkAttendance() {
    if (!currentUser) {
        alert("Please register or login first!");
        return;
    }
    userPoints += 5;
    updateUserPoints();
    alert("You earned 5 points for checking in!");
}

// Fungsi penarikan Litecoin
function handleWithdraw(event) {
    event.preventDefault();
    if (!currentUser) {
        alert("Please register or login first!");
        return;
    }
    if (userPoints >= 100) {
        const litecoinAddress = document.getElementById("litecoin-address").value.trim();
        if (!litecoinAddress) {
            alert("Please enter your Litecoin address!");
            return;
        }
        userPoints -= 100;
        updateUserPoints();

        // Simpan permintaan penarikan di Firestore
        addDoc(collection(db, "withdrawals"), {
            userId: currentUser.uid,
            email: currentUser.email,
            litecoinAddress: litecoinAddress,
            amount: 0.00001, // 100 poin = 0.00001 LTC
            timestamp: serverTimestamp(),
            status: "pending"
        }).then(() => {
            document.getElementById("withdraw-form").style.display = "none";
            document.getElementById("withdraw-status").style.display = "block";
            alert("Withdrawal request submitted! 0.00001 LTC will be sent manually to " + litecoinAddress);
        });
    } else {
        alert("You need at least 100 points to withdraw!");
    }
}

// Fungsi undang teman (simulasi)
function inviteFriend() {
    if (!currentUser) {
        alert("Please register or login first!");
        return;
    }
    userPoints += 20;
    updateUserPoints();
    alert("You earned 20 points for inviting a friend (simulated)!");
}

// Fungsi pendaftaran
function handleRegister(event) {
    event.preventDefault();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value.trim();

    createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            currentUser = userCredential.user;
            document.getElementById("register-form-container").style.display = "none";
            document.getElementById("login-form-container").style.display = "none";
            document.getElementById("register-status").style.display = "block";
            document.getElementById("registered-user").textContent = email;
            alert("Registration successful! You are now logged in.");
            loadUserPoints();
        })
        .catch(error => alert("Error: " + error.message));
}

// Fungsi login
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            currentUser = userCredential.user;
            document.getElementById("register-form-container").style.display = "none";
            document.getElementById("login-form-container").style.display = "none";
            document.getElementById("register-status").style.display = "block";
            document.getElementById("registered-user").textContent = email;
            alert("Login successful!");
            loadUserPoints();
        })
        .catch(error => alert("Error: " + error.message));
}

// Fungsi logout
function handleLogout() {
    signOut(auth).then(() => {
        currentUser = null;
        userPoints = 0;
        document.getElementById("register-form-container").style.display = "block";
        document.getElementById("login-form-container").style.display = "none";
        document.getElementById("register-status").style.display = "none";
        document.getElementById("user-points").textContent = "0";
        document.getElementById("withdraw-form").style.display = "block";
        document.getElementById("withdraw-status").style.display = "none";
        alert("You have logged out.");
    });
}

// Toggle antara login dan register
function switchToLogin(event) {
    event.preventDefault();
    document.getElementById("register-form-container").style.display = "none";
    document.getElementById("login-form-container").style.display = "block";
}

function switchToRegister(event) {
    event.preventDefault();
    document.getElementById("register-form-container").style.display = "block";
    document.getElementById("login-form-container").style.display = "none";
}

// Cek status autentikasi
onAuthStateChanged(auth, user => {
    if (user) {
        currentUser = user;
        document.getElementById("register-form-container").style.display = "none";
        document.getElementById("login-form-container").style.display = "none";
        document.getElementById("register-status").style.display = "block";
        document.getElementById("registered-user").textContent = user.email;
        loadUserPoints();
    } else {
        currentUser = null;
        userPoints = 0;
        document.getElementById("user-points").textContent = "0";
        document.getElementById("register-form-container").style.display = "block";
        document.getElementById("login-form-container").style.display = "none";
        document.getElementById("register-status").style.display = "none";
    }
});

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
    document.getElementById("withdraw-form").addEventListener("submit", handleWithdraw);
    document.getElementById("invite-btn").addEventListener("click", inviteFriend);
    document.getElementById("register-form").addEventListener("submit", handleRegister);
    document.getElementById("login-form").addEventListener("submit", handleLogin);
    document.getElementById("logout-btn").addEventListener("click", handleLogout);
    document.getElementById("switch-to-login").addEventListener("click", switchToLogin);
    document.getElementById("switch-to-register").addEventListener("click", switchToRegister);
});
