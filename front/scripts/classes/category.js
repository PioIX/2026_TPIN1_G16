let lastIdCategory = Number(localStorage.getItem("lastIdCategory"));

if (!lastIdCategory) {
    lastIdCategory = 0;
}

class Category {
    constructor(category){
        lastIdCategory++;
        this.id = lastIdCategory;
        localStorage.setItem("lastIdCategory", lastIdCategory);
        
        this.category = category;
    }
}