// Inicialización
let players = [];
let words = [];
let categories = [];
let id = 0;
loadPlayers();
loadWords();
loadCategories();

async function loadPlayers() {
    let data = await getPlayerTable();
    for (const player of data) {
        let date = player.ingreso.slice(0,10);
        players.push(new Player(player.usuario, player.contraseña, player.puntaje, date, player.administrador));
    }
}

async function loadWords() {
    let data = await getWordTable();
    for (const word of data) {
        words.push(new Word(word.palabra, word.dificultad, word.categoria, word.usuario));
    }
}

async function loadCategories() {
    let data = await getCategoryTable();
    for (const category of data) {
        categories.push(new Category(category.categoria));
    }
}

// Login
const login = (username, password) => {
    for (let i = 0; i < players.length; i++) {
        if (players[i].username == username) {
            if (players[i].password == password) {
                return players[i].id;
            } else {
                return 0;
            }
        }
    }
    return -1;
}
const buttonLogin = () => {
    let username = ui.getUser();
    let password = ui.getPassword();
    id = login(username, password);
    if (id == 0) {
        ui.showModal("Error", "Contraseña incorrecta.");
    } else if (id < 0) {
        ui.showModal("Error", "El usuario no existe.");
    } else {
        window.location.href = "categorias.html"
    }
}
// Registro
const register = (username, password, password2) => {
    let exist = 0;
    for (let i = 0; i < players.length; i++) {
        if (players[i].username == username) {
            exist++;
        }
    }
    if (exist == 0) {
        if (password == password2) {
            let date = new Date();
            let today = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
            let player = new Player(username, password, 0, today, false);
            players.push(player);
            postPlayer({usuario: username, contraseña: password, puntaje: 0, ingreso: today, administrador: false});
            return player.id;
        } else {
            return -1;
        }
    } else {
        return 0;
    }   
}
const buttonRegister = () => {
    let username = ui.getUser();
    let password = ui.getPassword();
    let password2 = ui.getSecondPassword();
    id = register(username, password, password2);
    if (id == 0) {
        ui.showModal("Error", "Este usuario ya existe.");
    } else if (id < 0) {
        ui.showModal("Error", "Contraseña no coincide.");
    } else {
        window.location.href = "categorias.html";
    }
}
// Cierre de sesión
const modalSignOut = () => {
    ui.showModalSignOut();
}
const signOut = () => {
    id = 0;
    window.location.href = "index.html";
}



// ADMINISTRADOR
const buttonAdmin = () => {
    for (let i = 0; i < players.length; i++) {
        if (players[i].id == id) {
            if (players[i].admin) {
                document.getElementById("btnAdmin").style.display = "block";
            }
        }
    }
}

// Jugadores
// ver tabla usuarios
const loadPlayersTable = () => {
    let registros = `<tr><th>ID</th><th>Usuario</th><th>Contraseña</th><th>Puntaje</th><th>Ingreso</th><th>Admin</th></tr>`;
    for (let i = 0; i < players.length; i++) {
        registros += `<tr><td>${players[i].id}</td><td>${players[i].usuario}</td><td>${players[i].contraseña}</td><td>${players[i].puntaje}</td><td>${players[i].ingreso}</td><td>${players[i].admin}</td></tr>`;
    }
    document.getElementById("tabla").innerHTML = registros; // hay que hacer la tabla en html
}
// añadir usuario
const addPlayer = (user, password, points, signin, admin) => {
    let exist = 0;
    for (let i = 0; i < players.length; i++) {
        if (players[i].username == user) {
            exist++;
        }
    }
    if (exist == 0) {
        let object = new Player(user, password, points, signin, admin);
        players.push(object);
        postPlayer({usuario: user, contraseña: password, puntaje: points, ingreso: signin, administrador: admin});
        return object.id;
    } else {
        return 0;
    }
}
const buttonAddPlayer = () => {
    let user = ui.getUser();
    let password = ui.getPassword();
    let points = ui.getPoints();
    let signin = ui.getSignIn();
    let admin = ui.getAdmin();
    let userId = ui.register(user, password, points, signin, admin);
    if (userId == 0) {
        ui.showModal("Error", "Este usuario ya existe.");
    } else {
        loadPlayersTable();
    }
}
// actualizar usuario
const updatePlayer = (idUser, user, password, points, signin, admin) => {
    let update = false;
    for (let i = 0; i < players.length; i++) {
        if (players[i].id == idUser) {
            players[i].username = user;
            players[i].password = password;
            players[i].points = points;
            players[i].signIn = signin;
            players[i].admin = admin;
            putPlayer({usuario: user, contraseña: password, puntaje: points, ingreso: signIn, administrador: admin});
            update = true;
        }
    }
    return update;
}
const buttonUpdatePlayer = () => {
    let idUser = ui.getId();
    let user = ui.getUser();
    let password = ui.getPassword();
    let points = ui.getPoints();
    let signin = ui.getSignIn();
    let admin = ui.getAdmin();
    let update = updatePlayer(idUser, user, password, points, signin, admin);
    if (update) {
        loadPlayersTable();
    } else {
        ui.showModal("Error", "No se encontro al usuario.");
    }
}
// eliminar usuario
const erasePlayer = (idUser) => {
    let erase = false;
    for (let i = 0; i < players.length; i++) {
        if (players[i].id == idUser) {
            players.splice(i, 1);
            deletePlayer(idUser);
            erase = true;
        }
    }
    return erase;
}
const buttonErasePlayer = () => {
    let idUser = ui.getId();
    let erase = erasePlayer(idUser);
    if (erase) {
        loadPlayersTable();
    } else {
        ui.showModal("Error", "No se encontro al usuario.")
    }
}

// Palabras
// ver tabla palabras
const loadWordsTable = () => {
    let registros = `<tr><th>ID</th><th>Palabra</th><th>Dificultad</th><th>Categoria</th><th>Admin</th></tr>`;
    for (let i = 0; i < words.length; i++) {
        registros += `<tr><td>${words[i].id}</td><td>${words[i].palabra}</td><td>${words[i].dificultad}</td><td>${words[i].categoria}</td><td>${words[i].usuario}</td></tr>`;
    }
    document.getElementById("tabla").innerHTML = registros; // hay que hacer la tabla en html
}
// añadir palabra
const addWord = (word, dificulty, category) => {
    let exist = 0;
    for (let i = 0; i < words.length; i++) {
        if (words[i].word == word) {
            exist++;
        }
    }
    if (exist == 0) {
        let object = new Word(word, dificulty, category, id);
        words.push(object);
        postWord({palabra: word, dificultad: dificulty, categoria: category, usuario: id});
        return object.id;
    } else {
        return 0;
    }
}
const buttonAddWord = () => {
    let word = ui.getWord();
    let dificulty = ui.getDificulty();
    let category = ui.getCategoryId();
    let object = addWord(word, dificulty, category);
    if (object > 0) {
        loadWordsTable();
    } else {
        ui.showModal("Error", "Ya existe este registro.")
    }
}
// actualizar palabra
const updateWord = (idWord, word, dificulty, category) => {
    let update = false;
    for (let i = 0; i < words.length; i++) {
        if (words[i].id == idWord) {
            words[i].word = word;
            words[i].dificulty = dificulty;
            words[i].category = category;
            words[i].admin = id;
            putWord({palabra: word, dificultad: dificulty, categoria: category, admin: id});
            update = true;
        }
    }
    return update;
}
const buttonUpdateWord = () => {
    let idWord = ui.getId();
    let word = ui.getWord();
    let dificulty = ui.getDificulty();
    let category = ui.getCategoryId();
    let update = updateWord(idWord, word, dificulty, category);
    if (update) {
        loadWordsTable();
    } else {
        ui.showModal("Error", "No se encontro la palabra.")
    }
}
// eliminar palabra
const eraseWord = (idWord) => {
    let erase = false;
    for (let i = 0; i < words.length; i++) {
        if (words[i].id == idWord) {
            words.splice(i, 1);
            deleteWord(idWord);
            erase = true;
        }
    }
    return erase;
}
const buttonEraseWord = () => {
    let idWord = ui.getId();
    let erase = eraseWord(idWord);
    if (erase) {
        loadWordsTable();
    } else {
        ui.showModal("Error", "No se encontro la palabra.")
    }
}

// Categorias
// ver tabla categorias
const loadCategoryTable = () => {
    let registros = `<tr><th>ID</th><th>Categoria</th></tr>`;
    for (let i = 0; i < categories.length; i++) {
        registros += `<tr><td>${categories[i].id}</td><td>${categories[i].categoria}</td></tr>`
    }
    document.getElementById("tabla").innerHTML = registros; // hay que hacer la tabla en html
}
// añadir categoria
const addCategory = (category) => {
    let exist = 0;
    for (let i = 0; i < categories.length; i++) {
        if (categories[i].category == category) {
            exist++;
        }
    }
    if (exist == 0) {
        let object = new Category(category);
        categories.push(object);
        postCategory({categoria: category});
        return object.id;
    } else {
        return 0;
    }
}
const buttonAddCategory = () => {
    let category = ui.getCategory();
    let object = addCategory(category);
    if (object > 0) {
        loadCategoryTable();
        ui.createCategory();
    } else {
        ui.showModal("Error", "Ya existe este registro.")
    }
}
// editar categoria
const updateCategory = (idCategory, category) => {
    let update = false;
    for (let i = 0; i < categories.length; i++) {
        if (categories[i].id == idCategory) {
            categories[i].category = category;
            putCategory({categoria: category});
            update = true;
        }
    }
    return update;
}
const buttonUpdateCategory = () => {
    let idCategory = ui.getId();
    let category = ui.getCategory();
    let update = updateWord(idCategory, category);
    if (update) {
        loadCategoriesTable();
    } else {
        ui.showModal("Error", "No se encontro la palabra.")
    }
}
// eliminar categoria
const eraseCategory = (idCategory) => {
    let erase = false;
    for (let i = 0; i < categories.length; i++) {
        if (categories[i].id == idCategory) {
            categories.splice(i, 1);
            deleteCategory(idCategory);
            erase = true;
        }
    }
    return erase;
}
const buttonEraseCategory = () => {
    let idCategory = ui.getId();
    let erase = eraseCategory(idCategory);
    if (erase) {
        loadCategoryTable();
    } else {
        ui.showModal("Error", "No se encontro la categoria.")
    }
}