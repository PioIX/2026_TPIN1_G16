let lastIdCategory = 0;

class Category {
    constructor(category){
        lastIdCategory += 1;
        this.id = lastIdCategory;
        this.category = category;
    }
}