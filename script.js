const player = document.getElementById('player');
const gameArea = document.getElementById('gameArea');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('startButton');
const moveLeftButton = document.getElementById('moveLeft');
const moveRightButton = document.getElementById('moveRight');

let playerX = 375; // Posisi horizontal pemain
let playerY = 20;  // Posisi vertikal pemain
let bulletSpeed = 5;  // Kecepatan peluru
let enemySpeed = 2;   // Kecepatan musuh
let score = 0;
let isGameActive = false;
let enemies = [];
let bullets = [];

// Fungsi untuk memulai permainan
function startGame() {
    startButton.style.display = 'none'; // Sembunyikan tombol Mulai
    isGameActive = true;
    score = 0;
    enemies = [];
    bullets = [];
    scoreDisplay.textContent = score;
    playerX = 375;
    player.style.left = playerX + 'px';
    gameLoop(); // Mulai game loop
}

// Fungsi untuk gerakan pemain
function movePlayer(direction) {
    const playerSpeed = 15; // Kecepatan gerakan pemain lebih cepat
    if (direction === 'left' && playerX > 0) {
        playerX -= playerSpeed;
    }
    if (direction === 'right' && playerX < gameArea.offsetWidth - 50) {
        playerX += playerSpeed;
    }
    player.style.left = playerX + 'px';
}

// Fungsi untuk menembakkan peluru otomatis
function shootBullet() {
    const bullet = document.createElement('div');
    bullet.classList.add('bullet');
    bullet.style.left = playerX + 22 + 'px'; // Tempatkan peluru di tengah pemain
    bullet.style.bottom = playerY + 30 + 'px'; // Tempatkan peluru sedikit di atas pemain
    gameArea.appendChild(bullet);
    bullets.push(bullet);
}

// Fungsi untuk membuat musuh
function spawnEnemy() {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.style.left = Math.random() * (gameArea.offsetWidth - 40) + 'px';
    enemy.style.top = '0px';
    gameArea.appendChild(enemy);
    enemies.push(enemy);
}

// Fungsi untuk menggerakkan musuh
function moveEnemies() {
    enemies.forEach(enemy => {
        let top = parseFloat(window.getComputedStyle(enemy).top);
        top += enemySpeed;
        enemy.style.top = top + 'px';

        // Hapus musuh yang keluar layar
        if (top > gameArea.offsetHeight) {
            enemy.remove();
            enemies = enemies.filter(e => e !== enemy);
        }
    });
}

// Fungsi untuk memeriksa tabrakan antara peluru dan musuh
function checkCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            const bulletRect = bullet.getBoundingClientRect();
            const enemyRect = enemy.getBoundingClientRect();

            if (bulletRect.left < enemyRect.right &&
                bulletRect.right > enemyRect.left &&
                bulletRect.top < enemyRect.bottom &&
                bulletRect.bottom > enemyRect.top) {
                // Musuh terkena tembakan
                enemy.remove();
                bullet.remove();
                enemies.splice(enemyIndex, 1);
                bullets.splice(bulletIndex, 1);
                score++;
                scoreDisplay.textContent = score;
            }
        });
    });
}

// Game Loop
function gameLoop() {
    if (!isGameActive) return;

    moveEnemies();
    checkCollisions();

    // Ciptakan musuh secara berkala
    if (Math.random() < 0.02) {
        spawnEnemy();
    }

    // Perbarui peluru
    bullets.forEach(bullet => {
        let bulletBottom = parseFloat(window.getComputedStyle(bullet).bottom);
        bulletBottom += bulletSpeed;
        bullet.style.bottom = bulletBottom + 'px';

        // Hapus peluru yang keluar layar
        if (bulletBottom > gameArea.offsetHeight) {
            bullet.remove();
            bullets = bullets.filter(b => b !== bullet);
        }
    });

    requestAnimationFrame(gameLoop); // Terus jalankan game loop
}

// Event Listener untuk tombol kontrol
moveLeftButton.addEventListener('click', () => movePlayer('left'));
moveRightButton.addEventListener('click', () => movePlayer('right'));

// Event listener untuk tombol mulai permainan
startButton.addEventListener('click', startGame);

// Menambahkan tembakan otomatis setiap 300ms
setInterval(shootBullet, 300);

// Menambahkan kontrol sentuhan di perangkat mobile
let touchStartX = 0;
let touchEndX = 0;

gameArea.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
});

gameArea.addEventListener('touchmove', (e) => {
    touchEndX = e.touches[0].clientX;
});

gameArea.addEventListener('touchend', () => {
    if (touchEndX < touchStartX) {
        movePlayer('left');  // Geser ke kiri
    }
    if (touchEndX > touchStartX) {
        movePlayer('right');  // Geser ke kanan
    }
});
