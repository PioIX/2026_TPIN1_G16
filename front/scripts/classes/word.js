let lastIdWord = 0;

class Word {
    constructor(palabra, dificultad, categoria, admin) {
        lastIdWord += 1;
        this.id = lastIdWord;
        this.palabra = palabra;
        this.dificultad = dificultad;
        this.categoria = categoria;
        this.admin = admin;
    }
}