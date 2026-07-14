let lastIdGame = Number(localStorage.getItem("lastIdGame"));

if (!lastIdGame) {
    lastIdGame = 0;
}

class Game {
    constructor (word, player, attempts, points, id) {
        this.id = id || lastIdGame + 1;
        localStorage.setItem("lastIdGame", this.id);

        this.id_palabra = word;
        this.id_jugador = player;
        this.intentos_usados = attempts;
        this.puntaje = points;
    }
}