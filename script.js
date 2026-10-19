/* --------------------------------------------------
 * 1. LOVE LETTER TYPING EFFECT
 * -------------------------------------------------- */
const letterText = "Chúc em yêu có một ngày 20/10 thật nhiều niềm vui, tiếng cười và tràn ngập hạnh phúc. Cảm ơn em đã xuất hiện và khiến mỗi ngày của anh trở nên đặc biệt hơn bao giờ hết. Mong em luôn giữ vững nụ cười tươi xinh trên môi, luôn rạng rỡ và thành công trong mọi dự định. Dù có bất cứ chuyện gì, hãy nhớ rằng luôn có anh ở bên cạnh ủng hộ và yêu thương em! 💕✨";

let letterIndex = 0;
function typeLetter() {
    const container = document.getElementById('letterContent');
    if (container && letterIndex < letterText.length) {
        container.innerHTML += letterText.charAt(letterIndex);
        letterIndex++;
        setTimeout(typeLetter, 35);
    }
}

/* --------------------------------------------------
 * 2. PETALS FALLING CANVAS ANIMATION
 * -------------------------------------------------- */
const canvas = document.getElementById('petalCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    class Petal {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * width;
            this.y = -20;
            this.size = Math.random() * 12 + 8;
            this.speedY = Math.random() * 1.5 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.rotation = Math.random() * 360;
            this.rotSpeed = Math.random() * 2 - 1;
            this.opacity = Math.random() * 0.5 + 0.5;
            this.color = Math.random() > 0.3 ? '#f472b6' : '#fb7185';
        }
        update() {
            this.y += this.speedY;
            this.x += Math.sin(this.y * 0.01) + this.speedX;
            this.rotation += this.rotSpeed;
            if (this.y > height + 20) this.reset();
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-this.size/2, -this.size/2, -this.size, this.size/3, 0, this.size);
            ctx.bezierCurveTo(this.size, this.size/3, this.size/2, -this.size/2, 0, 0);
            ctx.fill();
            ctx.restore();
        }
    }

    const petals = Array.from({ length: 35 }, () => new Petal());

    function animatePetals() {
        ctx.clearRect(0, 0, width, height);
        petals.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animatePetals);
    }
    animatePetals();
}

/* --------------------------------------------------
 * 3. MP3 AUDIO PLAYER
 * -------------------------------------------------- */
const bgMusic = document.getElementById('bgMusic');
const toggleMusicBtn = document.getElementById('toggleMusicBtn');
const vinylDisk = document.getElementById('vinylDisk');
const playIcon = document.getElementById('playIcon');
const audioStatusText = document.getElementById('audioStatusText');
let isPlaying = false;

function toggleAudio() {
    if (!bgMusic) return;

    if (isPlaying) {
        bgMusic.pause();
        isPlaying = false;
        if (vinylDisk) vinylDisk.classList.add('paused');
        if (playIcon) playIcon.className = 'fa-solid fa-play';
        if (audioStatusText) audioStatusText.innerText = 'Đang tạm dừng';
    } else {
        bgMusic.play().then(() => {
            isPlaying = true;
            if (vinylDisk) vinylDisk.classList.remove('paused');
            if (playIcon) playIcon.className = 'fa-solid fa-pause';
            if (audioStatusText) audioStatusText.innerText = 'Đang phát nhạc';
        }).catch(err => {
            console.log("Trình duyệt chặn autoplay:", err);
        });
    }
}

if (toggleMusicBtn) {
    toggleMusicBtn.addEventListener('click', toggleAudio);
}

/* --------------------------------------------------
 * 4. 3D PHOTO CAROUSEL GALLERY
 * -------------------------------------------------- */
const sampleImages = [
    '1.jpg',
    '2.jpg',
    '3.jpg',
    '4.jpg',
    '5.jpg'
];
const carouselStage = document.getElementById('carouselStage');
const totalCards = sampleImages.length;
let currentAngle = 0;
let currentIndex = 0;

function buildCarousel() {
    if (!carouselStage) return;
    const angleStep = 360 / totalCards;
    const radius = Math.round((140 / Math.tan(Math.PI / totalCards)));

    sampleImages.forEach((imgUrl, i) => {
        const card = document.createElement('div');
        card.className = 'carousel-card';
        card.style.transform = `rotateY(${i * angleStep}deg) translateZ(${radius + 20}px)`;
        card.innerHTML = `
            <img src="${imgUrl}" alt="Kỷ niệm" class="w-full h-full object-cover">
            <div class="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 to-transparent text-white text-xs font-semibold text-center">
                Khoảnh khắc ngọt ngào #${i + 1}
            </div>
        `;
        carouselStage.appendChild(card);
    });
}

function updateCarousel() {
    if (!carouselStage) return;
    carouselStage.style.transform = `rotateY(${currentAngle}deg)`;
    const displayedIndex = ((-currentIndex % totalCards) + totalCards) % totalCards + 1;
    const indexLabel = document.getElementById('carouselIndex');
    if (indexLabel) indexLabel.innerText = `${displayedIndex} / ${totalCards}`;
}

document.getElementById('prevBtn')?.addEventListener('click', () => {
    currentAngle += (360 / totalCards);
    currentIndex--;
    updateCarousel();
});

document.getElementById('nextBtn')?.addEventListener('click', () => {
    currentAngle -= (360 / totalCards);
    currentIndex++;
    updateCarousel();
});

buildCarousel();

/* --------------------------------------------------
 * /* --------------------------------------------------
 * 5. OPEN GIFT HERO INTERACTION & CONFETTI
 * -------------------------------------------------- */
const openGiftBtn = document.getElementById('openGiftBtn');
const heroScreen = document.getElementById('heroScreen');
const mainContent = document.getElementById('mainContent');

if (openGiftBtn && heroScreen && mainContent) {
    openGiftBtn.addEventListener('click', () => {
        // Hiệu ứng pháo giấy
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#e11d48', '#f43f5e', '#fda4af', '#f472b6']
            });
        }

        // Bật nhạc an toàn ngay khi người dùng click vào nút mở quà
        if (bgMusic) {
            bgMusic.play().then(() => {
                isPlaying = true;
                if (vinylDisk) vinylDisk.classList.remove('paused');
                if (playIcon) playIcon.className = 'fa-solid fa-pause';
                if (audioStatusText) audioStatusText.innerText = 'Đang phát nhạc';
            }).catch(err => {
                console.log("Trình duyệt chặn phát nhạc:", err);
            });
        }

        // Ẩn màn hình khóa, hiện nội dung chính
        heroScreen.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(() => {
            heroScreen.style.display = 'none';
            mainContent.classList.remove('opacity-0');
            typeLetter();
        }, 800);
    });
}

/* --------------------------------------------------
 * 6. WISH COUPON CLAIM MODAL
 * -------------------------------------------------- */
const wishModal = document.getElementById('wishModal');
const wishModalCard = document.getElementById('wishModalCard');
const wishModalText = document.getElementById('wishModalText');

function claimWish(wishTitle) {
    if (wishModalText) {
        wishModalText.innerText = `Lựa chọn "${wishTitle}" đã được ghi nhận thành công và gửi trực tiếp tới anh! Anh sẽ thực hiện cho em sớm nhất nha 💕`;
    }
    if (wishModal) wishModal.classList.remove('opacity-0', 'pointer-events-none');
    if (wishModalCard) {
        wishModalCard.classList.remove('scale-90');
        wishModalCard.classList.add('scale-100');
    }

    if (typeof confetti === 'function') {
        confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.5 }
        });
    }
}

function closeWishModal() {
    if (wishModalCard) {
        wishModalCard.classList.remove('scale-100');
        wishModalCard.classList.add('scale-90');
    }
    if (wishModal) wishModal.classList.add('opacity-0', 'pointer-events-none');
}

/* --------------------------------------------------
 * 7. FLOATING HEART SPAMMER BUTTON
 * -------------------------------------------------- */
let heartCounter = 0;
const spamHeartBtn = document.getElementById('spamHeartBtn');
const heartCountSpan = document.getElementById('heartCount');

if (spamHeartBtn) {
    spamHeartBtn.addEventListener('click', (e) => {
        heartCounter++;
        if (heartCountSpan) heartCountSpan.innerText = heartCounter;

        const heart = document.createElement('div');
        heart.className = 'floating-heart text-rose-500 text-2xl';
        heart.innerHTML = '<i class="fa-solid fa-heart"></i>';
        
        const rect = spamHeartBtn.getBoundingClientRect();
        const x = rect.left + rect.width / 2 + (Math.random() * 60 - 30);
        const y = rect.top;

        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;

        document.body.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 3000);
    });
}