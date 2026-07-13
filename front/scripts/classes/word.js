let lastIdWord = Number(localStorage.getItem("lastIdWord"));

if (!lastIdWord) {
    lastIdWord = 0;
}

class Word {
    constructor(word, dificulty, category, admin) {
        lastIdWord++;
        this.id = lastIdWord;
        localStorage.setItem("lastIdWord", lastIdWord);
        
        this.word = word;
        this.dificulty = dificulty;
        this.category = category;
        this.admin = admin;
    }
}