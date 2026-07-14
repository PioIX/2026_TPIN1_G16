let lastIdCategory = Number(localStorage.getItem("lastIdCategory"));

if (!lastIdCategory) {
    lastIdCategory = 0;
}

class Category {
    constructor(category, id){
        this.id = id || lastIdCategory + 1;
        localStorage.setItem("lastIdCategory", this.id);
        
        this.categoria = category;
    }
}