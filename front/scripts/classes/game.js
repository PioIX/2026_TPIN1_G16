let lastIdGame = Number(localStorage.getItem("lastIdGame"));

if (!lastIdGame) {
    lastIdGame = 0;
}

class Game {
    constructor (word, player, attempts, points) {
        lastIdGame++;
        this.id = lastIdGame;
        localStorage.setItem("lastIdGame", lastIdGame);

        this.word = word;
        this.player = player;
        this.attempts = attempts;
        this.points = points;
    }
}