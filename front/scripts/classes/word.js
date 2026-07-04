let lastIdWord = 0;

class Word {
    constructor(word, dificulty, category, admin) {
        lastIdWord += 1;
        this.id = lastIdWord;
        this.word = word;
        this.dificulty = dificulty;
        this.category = category;
        this.admin = admin;
    }
}