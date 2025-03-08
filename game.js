const cat = document.getElementById('cat');
const gameArea = document.getElementById('gameArea');
const scoreElement = document.getElementById('scoreValue');
const timeElement = document.getElementById('timeValue');
const highScoreElement = document.getElementById('highScoreValue');
const startButton = document.getElementById('startButton');
const difficultySelect = document.getElementById('difficulty');
const popSound = document.getElementById('popSound');

// Inizializza la sintesi vocale
const speechSynthesis = window.speechSynthesis;
let speechUtterance = new SpeechSynthesisUtterance();
speechUtterance.lang = 'it-IT';
speechUtterance.rate = 1.2; // Velocità leggermente più alta

let score = 0;
let timeLeft = 20;
let gameInterval;
let timerInterval;
let shrinkInterval;
let isPlaying = false;
let highScore = localStorage.getItem('highScore') || 0;
highScoreElement.textContent = highScore;

const difficulties = {
    easy: { interval: 1000, size: 80 },    // Più grande e più lento
    medium: { interval: 800, size: 60 },    // Dimensione media
    hard: { interval: 600, size: 40 }      // Più piccolo e più veloce
};

function speakScore(points) {
    // Cancella eventuali voci in coda
    speechSynthesis.cancel();
    
    // Prepara il testo da leggere
    speechUtterance.text = points.toString();
    
    // Riproduci la voce
    speechSynthesis.speak(speechUtterance);
}

function playPopSound() {
    popSound.currentTime = 0; // Riavvia il suono dall'inizio
    popSound.play();
}

function moveCat() {
    const catSize = parseInt(cat.style.width) || difficulties[difficultySelect.value].size;
    const maxX = gameArea.clientWidth - catSize;
    const maxY = gameArea.clientHeight - catSize;
    
    const newX = Math.floor(Math.random() * maxX);
    const newY = Math.floor(Math.random() * maxY);
    
    cat.style.left = newX + 'px';
    cat.style.top = newY + 'px';
    
    const difficulty = difficulties[difficultySelect.value];
    cat.style.width = difficulty.size + 'px';
    cat.style.height = difficulty.size + 'px';
    startShrinking();
}

function startShrinking() {
    let currentSize = parseInt(cat.style.width);
    const minSize = 30;  // Dimensione minima più grande
    const shrinkRate = 0.1;  // Velocità di rimpicciolimento più lenta
    
    clearInterval(shrinkInterval);
    shrinkInterval = setInterval(() => {
        if (currentSize > minSize) {
            currentSize -= shrinkRate;
            cat.style.width = currentSize + 'px';
            cat.style.height = currentSize + 'px';
        }
    }, 50);  // Intervallo più lungo
}

function updateScore() {
    const currentSize = parseInt(cat.style.width);
    const baseScore = difficulties[difficultySelect.value].size;
    const sizeBonus = Math.max(1, Math.floor(baseScore / currentSize));
    score += sizeBonus;
    
    scoreElement.textContent = score;
    speakScore(score); // Leggi il punteggio ad alta voce
    
    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = highScore;
        localStorage.setItem('highScore', highScore);
    }
}

function updateTimer() {
    timeLeft--;
    timeElement.textContent = timeLeft;
    
    if (timeLeft <= 0) {
        endGame();
    }
}

function setDifficulty() {
    const difficulty = difficulties[difficultySelect.value];
    cat.style.width = difficulty.size + 'px';
    cat.style.height = difficulty.size + 'px';
    return difficulty.interval;
}

function startGame() {
    if (isPlaying) return;
    
    // Annuncia l'inizio del gioco
    speechUtterance.text = "Iniziamo! Prendi la pallina!";
    speechSynthesis.speak(speechUtterance);
    
    isPlaying = true;
    score = 0;
    timeLeft = 20;
    scoreElement.textContent = score;
    timeElement.textContent = timeLeft;
    startButton.textContent = 'Gioco in Corso';
    difficultySelect.disabled = true;
    
    const interval = setDifficulty();
    moveCat();
    gameInterval = setInterval(moveCat, interval);
    timerInterval = setInterval(updateTimer, 1000);
}

function endGame() {
    isPlaying = false;
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    clearInterval(shrinkInterval);
    startButton.textContent = 'Gioca Ancora';
    difficultySelect.disabled = false;
    
    // Annuncia il punteggio finale
    speechUtterance.text = "Gioco finito! Punteggio finale: " + score;
    speechSynthesis.speak(speechUtterance);
    
    alert('Game Over! Punteggio Finale: ' + score);
}

cat.addEventListener('click', () => {
    if (!isPlaying) return;
    playPopSound();
    updateScore();
});

startButton.addEventListener('click', startGame);

// Posizione iniziale del gatto
cat.style.left = '50%';
cat.style.top = '50%';
setDifficulty();
