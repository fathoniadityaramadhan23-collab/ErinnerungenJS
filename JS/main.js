// Data foto (28 foto) - SESUAIKAN DENGAN NAMA FILE SETELAH RENAME
const photos = [
    { id: 1, filename: "foto1.jpg" },
    { id: 2, filename: "Foto2.jpg" },
    { id: 3, filename: "Foto3.jpg" },
    { id: 4, filename: "Foto4.jpg" },
    { id: 5, filename: "Foto5.jpg" },
    { id: 6, filename: "Foto6.jpg" },
    { id: 7, filename: "Foto7.jpg" },
    { id: 8, filename: "Foto8.jpg" },
    { id: 9, filename: "Foto9.jpg" },
    { id: 10, filename: "Foto10.jpg" },
    { id: 11, filename: "Foto11.jpg" },
    { id: 12, filename: "Foto12.jpg" },
    { id: 13, filename: "Foto13.jpg" },
    { id: 14, filename: "Foto14.jpg" },
    { id: 15, filename: "Foto15.jpg" },
    { id: 16, filename: "Foto16.jpg" },
    { id: 17, filename: "Foto17.jpg" },
    { id: 18, filename: "Foto18.jpg" },
    { id: 19, filename: "Foto19.jpg" },
    { id: 20, filename: "Foto20.jpg" },
    { id: 21, filename: "Foto21.jpg" },
    { id: 22, filename: "Foto22.jpg" },
    { id: 23, filename: "Foto23.jpg" },
    { id: 24, filename: "Foto24.jpg" },
    { id: 25, filename: "Foto25.jpg" },
    { id: 26, filename: "Foto26.jpg" },
    { id: 27, filename: "Foto27.jpg" },
    { id: 28, filename: "Foto28.jpg" }
];

let currentPhotos = [...photos];
let currentLightboxIndex = 0;
let imageRatios = {}; // Menyimpan rasio setiap gambar

// Fungsi untuk mendapatkan rasio gambar
function getImageRatio(imgElement) {
    return imgElement.naturalWidth / imgElement.naturalHeight;
}

// Fungsi untuk menambahkan class berdasarkan rasio
function addRatioClass(imgElement, cardElement) {
    const ratio = getImageRatio(imgElement);
    if (ratio > 1.2) {
        // Landscape (lebar > tinggi)
        cardElement.classList.add('landscape');
        cardElement.classList.remove('portrait');
    } else if (ratio < 0.8) {
        // Portrait (tinggi > lebar)
        cardElement.classList.add('portrait');
        cardElement.classList.remove('landscape');
    } else {
        // Square (hampir persegi)
        cardElement.classList.remove('landscape', 'portrait');
    }
}

// Render gallery
function renderGallery() {
    const gallery = document.getElementById('gallery');
    
    gallery.innerHTML = currentPhotos.map((photo, index) => `
        <div class="photo-card" data-index="${index}" data-filename="${photo.filename}">
            <img src="images/${photo.filename}" alt="Erinnerung" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22 viewBox=%220 0 400 400%22%3E%3Crect width=%22400%22 height=%22400%22 fill=%22%23e2e8f0%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23718096%22 font-family=%22sans-serif%22%3E📷%3C/text%3E%3C/svg%3E'">
        </div>
    `).join('');
    
    // Setelah gambar dimuat, cek rasio dan tambahkan class
    document.querySelectorAll('.photo-card').forEach(card => {
        const img = card.querySelector('img');
        
        // Jika gambar sudah dimuat
        if (img.complete && img.naturalWidth > 0) {
            addRatioClass(img, card);
        } else {
            // Tunggu gambar dimuat
            img.addEventListener('load', function() {
                addRatioClass(this, card);
            });
        }
        
        // Add click event
        card.addEventListener('click', (e) => {
            const index = parseInt(card.dataset.index);
            openLightbox(index);
        });
    });
}

// Lightbox functions
function openLightbox(index) {
    currentLightboxIndex = index;
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImg');
    
    img.src = `images/${currentPhotos[index].filename}`;
    img.onerror = function() {
        this.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22500%22 height=%22500%22 viewBox=%220 0 500 500%22%3E%3Crect width=%22500%22 height=%22500%22 fill=%22%23333%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23fff%22 font-size=%2240%22%3E📷%3C/text%3E%3C/svg%3E';
    };
    lightbox.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function navigateLightbox(direction) {
    currentLightboxIndex += direction;
    if (currentLightboxIndex < 0) currentLightboxIndex = currentPhotos.length - 1;
    if (currentLightboxIndex >= currentPhotos.length) currentLightboxIndex = 0;
    
    const img = document.getElementById('lightboxImg');
    img.src = `images/${currentPhotos[currentLightboxIndex].filename}`;
    img.onerror = function() {
        this.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22500%22 height=%22500%22 viewBox=%220 0 500 500%22%3E%3Crect width=%22500%22 height=%22500%22 fill=%22%23333%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23fff%22 font-size=%2240%22%3E📷%3C/text%3E%3C/svg%3E';
    };
}

// ========== MUSIC PLAYER FUNCTION ==========
function initMusicPlayer() {
    const audio = document.getElementById('bgMusic');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const musicIcon = document.getElementById('musicIcon');
    
    if (!audio || !playPauseBtn) return;
    
    let isPlaying = false;
    
    // Volume 30% (lembut)
    audio.volume = 0.3;
    
    // Fungsi play/pause
    function toggleMusic() {
        if (isPlaying) {
            audio.pause();
            musicIcon.textContent = '🎵';
            playPauseBtn.style.opacity = '0.7';
        } else {
            audio.play().catch(e => {
                console.log('Autoplay diblokir browser. Klik tombol untuk memutar musik.');
            });
            musicIcon.textContent = '🎵';
            playPauseBtn.style.opacity = '1';
        }
        isPlaying = !isPlaying;
    }
    
    // Event klik tombol
    playPauseBtn.addEventListener('click', toggleMusic);
    
    // Coba autoplay setelah user interaksi pertama
    const tryAutoplay = () => {
        if (!isPlaying) {
            audio.play().then(() => {
                isPlaying = true;
                musicIcon.textContent = '🎵';
                playPauseBtn.style.opacity = '1';
            }).catch(() => {});
        }
        document.removeEventListener('click', tryAutoplay);
        document.removeEventListener('touchstart', tryAutoplay);
    };
    
    document.addEventListener('click', tryAutoplay);
    document.addEventListener('touchstart', tryAutoplay);
    
    // Jika musik error (file tidak ditemukan), diam saja
    audio.addEventListener('error', () => {
        console.log('File musik tidak ditemukan');
    });
}
// ========== END MUSIC PLAYER ==========

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    renderGallery();
    initMusicPlayer(); // Inisialisasi musik
});

// Lightbox events
document.querySelector('.close')?.addEventListener('click', closeLightbox);
document.getElementById('prevBtn')?.addEventListener('click', () => navigateLightbox(-1));
document.getElementById('nextBtn')?.addEventListener('click', () => navigateLightbox(1));

document.addEventListener('keydown', (e) => {
    if (document.getElementById('lightbox').style.display === 'block') {
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
        if (e.key === 'Escape') closeLightbox();
    }
});

// Smooth scroll for indicator
document.querySelector('.scroll-indicator')?.addEventListener('click', () => {
    document.querySelector('.gallery-container')?.scrollIntoView({ behavior: 'smooth' });
});