class AudioController {
    constructor() {
        this.bgMusic = new Audio('son/game.mp3');
        this.flipSound = new Audio('son/flip.mp3');
        this.matchSound = new Audio('son/match.mp3');
        this.victorySound = new Audio('son/victory.mp3');
        this.gameOverSound = new Audio('son/game-over-arcade-6435.mp3');
        this.bgMusic.volume = 0.5;
        this.bgMusic.loop = true;
        this.isMusicPlaying = false;
    }
    startMusic() {
        this.bgMusic.play();
        this.isMusicPlaying = true;
    }
    stopMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
        this.isMusicPlaying = false;
    }
    flip() {
        this.flipSound.play();
    }
    match() {
        this.matchSound.play();
    }
    victory() {
        this.stopMusic();
        this.victorySound.play();
    }
    gameOver() {
        this.stopMusic();
        this.gameOverSound.play();
    }
    toggleMusic() {
        if (this.isMusicPlaying) {
            this.stopMusic();
        } else {
            this.startMusic();
        }
    }
}

class MixOrMatch {
    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('time-remaining')
        this.ticker = document.getElementById('flips');
        this.audioController = new AudioController();
    }

    startGame() {
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.cardToCheck = null;
        this.matchedCards = [];
        this.busy = true;
        setTimeout(() => {
            this.audioController.startMusic();
            this.shuffleCards(this.cardsArray);
            this.countdown = this.startCountdown();
            this.busy = false;
        }, 500)
        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalClicks;
    }
    startCountdown() {
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if (this.timeRemaining === 0)
                this.gameOver();
        }, 1000);
    }
    gameOver() {
        clearInterval(this.countdown);
        this.audioController.gameOver();
        document.getElementById('game-over-text').classList.add('visible');
    }
    victory() {
        clearInterval(this.countdown);
        this.audioController.victory();
        document.getElementById('victory-text').classList.add('visible');
    }
    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }
    flipCard(card) {
        if (this.canFlipCard(card)) {
            this.audioController.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add('visible');

            if (this.cardToCheck) {
                this.checkForCardMatch(card);
            } else {
                this.cardToCheck = card;
            }
        }
    }
    checkForCardMatch(card) {
        if (this.getCardType(card) === this.getCardType(this.cardToCheck))
            this.cardMatch(card, this.cardToCheck);
        else
            this.cardMismatch(card, this.cardToCheck);

        this.cardToCheck = null;
    }
    cardMatch(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.audioController.match();
        if (this.matchedCards.length === this.cardsArray.length)
            this.victory();
    }
    cardMismatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000);
    }
    // mélanger un tableau de cartes (shuffleCards)
    shuffleCards(cardsArray) {
        for (let i = cardsArray.length - 1; i > 0; i--) {
            const randIndex = Math.floor(Math.random() * (i + 1));
            [cardsArray[i], cardsArray[randIndex]] = [cardsArray[randIndex], cardsArray[i]];
        }
        cardsArray = cardsArray.map((card, index) => {
            card.style.order = index;
        });
    }
    getCardType(card) {
        return card.getElementsByClassName('card-value')[0].src;
    }
    canFlipCard(card) {
        return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
    }
}

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new MixOrMatch(100, cards);

    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            game.startGame();
        });
    });

    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        });
    });

    const musicToggleButton = document.getElementById('music-toggle');
    musicToggleButton.addEventListener('click', () => {
        game.audioController.toggleMusic();
    });
}

const cardImages = [
    "images/saintSeiya/hades2.jpg",
    "images/saintSeiya/athena3.jpg",
    "images/saintSeiya/gemeaux.jpg",
    "images/saintSeiya/balance.jpg",
    "images/saintSeiya/12009402_83.jpg",
    "images/saintSeiya/poseidon2.jpg",
    "images/saintSeiya/harpie.jpg",
    "images/saintSeiya/thanatos2.jpg",
    "images/saintSeiya/wyvern2.jpg",
    "images/saintSeiya/griffon2.jpg"
];
// Dupliquer chaque image pour créer des paires
const cards = [...cardImages, ...cardImages];

// Mélanger les cartes
cards.sort(() => Math.random() - 0.5);

const cardContainer = document.getElementById('card-container');

// Générer le HTML pour chaque carte
cards.forEach(image => {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');
    cardDiv.innerHTML = `
              <div class="card-back card-face">
                <img class="spider" src="images/backcard.webp">
              </div>
              <div class="card-front card-face">
                <img class="card-value" src="${image}">
              </div>
            `;
    cardContainer.appendChild(cardDiv);
});
