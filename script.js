document.addEventListener('DOMContentLoaded', function() {
    // Elemen DOM
    const lyricsElement = document.getElementById('lyrics');
    const audioPlayer = document.getElementById('audioPlayer');
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const restartBtn = document.getElementById('restartBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    
    // Lirik lagu
    const lyrics = [
        "I just wanna see",
        "I just wanna see how beautiful you are",
        "You know that I see it",
        "I know you're a star",
        "Where you go I'll follow",
        "No matter how far",
        "If life is a movie",
        "Oh you're the best part, oh",
        "Then You're the best part, ooh",
        "You're the best part"
    ];
    
    // Variabel untuk mengontrol pengetikan
    let currentLine = 0;
    let currentChar = 0;
    let isTyping = false;
    let typingInterval;
    
    // Setup canvas untuk hati
    const canvas = document.getElementById('heartsCanvas');
    const ctx = canvas.getContext('2d');
    
    // Atur ukuran canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Kelas untuk hati
    class Heart {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 15 + 5;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.color = `rgba(255, ${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(Math.random() * 150 + 200)}, ${Math.random() * 0.5 + 0.5})`;
            this.pulseSpeed = Math.random() * 0.05 + 0.02;
            this.pulseSize = 0;
            this.rotation = Math.random() * Math.PI * 2;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Pantulan di tepi
            if (this.x <= 0 || this.x >= canvas.width) this.speedX *= -1;
            if (this.y <= 0 || this.y >= canvas.height) this.speedY *= -1;
            
            // Efek berdenyut
            this.pulseSize = Math.sin(Date.now() * this.pulseSpeed) * 2;
            this.rotation += 0.01;
        }
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.scale(1 + this.pulseSize * 0.1, 1 + this.pulseSize * 0.1);
            
            // Gambar hati
            ctx.fillStyle = this.color;
            ctx.beginPath();
            const topCurveHeight = this.size * 0.3;
            ctx.moveTo(0, this.size/4);
            // Kurva kiri
            ctx.bezierCurveTo(
                -this.size/2, -this.size/2,
                -this.size, this.size/3,
                0, this.size
            );
            // Kurva kanan
            ctx.bezierCurveTo(
                this.size, this.size/3,
                this.size/2, -this.size/2,
                0, this.size/4
            );
            ctx.fill();
            
            ctx.restore();
        }
    }
    
    // Array untuk menyimpan hati
    let hearts = [];
    
    // Inisialisasi hati
    function initHearts(count) {
        hearts = [];
        for (let i = 0; i < count; i++) {
            hearts.push(new Heart());
        }
    }
    
    // Animasi hati
    function animateHearts() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let heart of hearts) {
            heart.update();
            heart.draw();
        }
        
        requestAnimationFrame(animateHearts);
    }
    
    // Fungsi untuk mengetik lirik
    function typeLyrics() {
        if (!isTyping) return;
        
        // Jika sudah selesai satu baris
        if (currentChar >= lyrics[currentLine].length) {
            clearInterval(typingInterval);
            setTimeout(() => {
                currentLine++;
                currentChar = 0;
                
                // Jika semua lirik sudah diketik
                if (currentLine >= lyrics.length) {
                    isTyping = false;
                    lyricsElement.innerHTML = lyrics.join('<br>');
                    return;
                }
                
                // Tambah baris baru
                lyricsElement.innerHTML += '<br><br>';
                typingInterval = setInterval(typeLyrics, 100);
            }, 1000); // Jeda antar baris
            return;
        }
        
        // Tambahkan karakter berikutnya
        const currentText = lyrics[currentLine].substring(0, currentChar + 1);
        const linesSoFar = lyrics.slice(0, currentLine).join('<br><br>');
        
        if (currentLine > 0) {
            lyricsElement.innerHTML = linesSoFar + '<br><br>' + currentText + '<span class="cursor"></span>';
        } else {
            lyricsElement.innerHTML = currentText + '<span class="cursor"></span>';
        }
        
        currentChar++;
    }
    
    // Mulai mengetik lirik
    function startTyping() {
        if (isTyping) return;
        
        isTyping = true;
        currentLine = 0;
        currentChar = 0;
        lyricsElement.innerHTML = '';
        typingInterval = setInterval(typeLyrics, 100);
    }
    
    // Restart lirik
    function restartLyrics() {
        clearInterval(typingInterval);
        isTyping = false;
        setTimeout(startTyping, 500);
    }
    
    // Event listeners untuk kontrol musik
    playBtn.addEventListener('click', function() {
        audioPlayer.play().catch(e => console.log("Autoplay diblokir: ", e));
        startTyping();
        playBtn.innerHTML = '<i class="fas fa-play"></i> Sedang Diputar';
    });
    
    pauseBtn.addEventListener('click', function() {
        audioPlayer.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i> Putar Lagu';
    });
    
    restartBtn.addEventListener('click', function() {
        audioPlayer.currentTime = 0;
        restartLyrics();
        if (audioPlayer.paused) {
            audioPlayer.play();
            playBtn.innerHTML = '<i class="fas fa-play"></i> Sedang Diputar';
        }
    });
    
    volumeSlider.addEventListener('input', function() {
        audioPlayer.volume = this.value;
    });
    
    // Tambah hati saat klik di mana saja
    canvas.addEventListener('click', function(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Tambah 5 hati baru di posisi klik
        for (let i = 0; i < 5; i++) {
            const heart = new Heart();
            heart.x = x + (Math.random() * 60 - 30);
            heart.y = y + (Math.random() * 60 - 30);
            hearts.push(heart);
        }
        
        // Batasi jumlah hati maksimal 150
        if (hearts.length > 150) {
            hearts = hearts.slice(hearts.length - 150);
        }
    });
    
    // Inisialisasi
    initHearts(30);
    animateHearts();
    
    // Mulai dengan lirik kosong dan cursor
    lyricsElement.innerHTML = '<span class="cursor"></span>';
    
    // Tampilkan pesan jika audio tidak bisa dimainkan
    audioPlayer.addEventListener('error', function() {
        lyricsElement.innerHTML = "File lagu.mp3 tidak ditemukan. Silakan tambahkan file audio dengan nama 'lagu.mp3' ke folder yang sama.";
    });
});
