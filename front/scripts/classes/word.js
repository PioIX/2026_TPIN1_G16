let lastIdWord = Number(localStorage.getItem("lastIdWord"));

if (!lastIdWord) {
    lastIdWord = 0;
}

class Word {
    constructor(word, dificulty, category, admin, id) {
        this.id = id || lastIdWord + 1;
        localStorage.setItem("lastIdWord", this.id);
        
        this.palabra = word;
        this.dificultad = dificulty;
        this.id_categoria = category;
        this.id_admin = admin;
    }
}