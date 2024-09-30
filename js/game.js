const gameContainer = document.querySelector('.game-container');

function createCards() {
    themes[currentTheme].forEach(image => {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
            <div class="card-back card-face">
                <img class="spider" src="images/backcard.webp">
            </div>
            <div class="card-front card-face">
                <img class="card-value" src="${image}">
            </div>
        `;
        gameContainer.appendChild(card);
    });
}

createCards();