let lastIdCategory = 0;

class Category {
    constructor(categoria){
        lastIdCategory += 1;
        this.id = lastIdCategory;
        this.categoria = categoria;
    }
}