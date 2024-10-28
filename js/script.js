class AudioController {
    constructor() {
        this.flipSound = new Audio('son/flip.mp3');
        this.matchSound = new Audio('son/match.mp3');
        this.victorySound = new Audio('son/victory.mp3');
        this.gameOverSound = new Audio('son/game-over-arcade-6435.mp3');
    }

    flip() {
        this.flipSound.play();
    }

    match() {
        this.matchSound.play();
    }

    victory() {
        this.victorySound.play();
    }

    gameOver() {
        this.gameOverSound.play();
    }
}

class MixOrMatch {
    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('time-remaining');
        this.ticker = document.getElementById('flips');
        this.audioController = new AudioController();
        this.matchedCards = [];
    }

    startGame() {
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.cardToCheck = null;
        this.matchedCards = [];
        this.busy = true;

        setTimeout(() => {
            this.shuffleCards(this.cardsArray);
            this.countdown = this.startCountdown();
            this.busy = false;
        }, 500);

        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalClicks;
    }

    startCountdown() {
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if (this.timeRemaining === 0) {
                this.gameOver();
            }
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
        if (this.getCardType(card) === this.getCardType(this.cardToCheck)) {
            this.cardMatch(card, this.cardToCheck);
        } else {
            this.cardMismatch(card, this.cardToCheck);
        }
        this.cardToCheck = null;
    }

    cardMatch(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.audioController.match();

        if (this.matchedCards.length === this.cardsArray.length) {
            this.victory();
        }
    }

    cardMismatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000);
    }

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
const cardImagesDbz = [
    "images/dragonBall/vegeta.jpg",
    "images/dragonBall/yamcha.jpg",
    "images/dragonBall/trunk.jpg",
    "images/dragonBall/tortue.jpg",
    "images/dragonBall/sangoku.jpg",
    "images/dragonBall/sangohan.jpg",
    "images/dragonBall/picolo.jpg",
    "images/dragonBall/freezer.jpg",
    "images/dragonBall/boo.jpg",
    "images/dragonBall/broly.jpg"
];

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

function ready() {
    let game;
    let cards;
    let currentTheme = 'saintSeiya';
    const cardContainer = document.getElementById('card-container');

    function loadCards(theme) {
        const selectedImages = theme === 'saintSeiya' ? [...cardImages, ...cardImages] : [...cardImagesDbz, ...cardImagesDbz];
        cardContainer.innerHTML = '';
        selectedImages.sort(() => Math.random() - 0.5);
        cards = [];
        selectedImages.forEach(image => {
            const cardDiv = document.createElement('div');
            cardDiv.classList.add('card');
            cardDiv.innerHTML = `
                <div class="card-back card-face">
                    <img class="spider" src="${theme === 'saintSeiya' ? 'images/backcard.webp' : 'images/backdbz.webp'}">
                </div>
                <div class="card-front card-face">
                    <img class="card-value" src="${image}">
                </div>
            `;
            cardContainer.appendChild(cardDiv);
            cards.push(cardDiv);
            cardDiv.addEventListener('click', () => {
                game.flipCard(cardDiv);
            });
        });
    }

    const themeSelect = document.getElementById('theme-select');
    themeSelect.addEventListener('change', () => {
        currentTheme = themeSelect.value;
    });

    const startGameButton = document.getElementById('start-game-button');
    startGameButton.addEventListener('click', () => {
        loadCards(currentTheme);
        document.querySelector(".overlay-text").classList.remove("visible");
        game = new MixOrMatch(100, cards);
        game.startGame();
    });
}
