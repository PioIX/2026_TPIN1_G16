// INICIALIZACION
// Variables globales
let players = [];
let words = [];
let categories = [];
let games = [];
let id;

// Cargando las variables globales
async function loadPlayers() {
    let data = await getPlayerTable();
    for (const player of data) {
        let date = player.ingreso.slice(0,10);
        let admin = player.administrador === 1 ? true : false;
        players.push(new Player(player.usuario, player.contraseña, player.puntaje, date, admin));
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
async function loadGames() {
    let data = await getGameTable();
    for (const game of data) {
        games.push(new Game(game.id_palabra, game.id_jugador, game.intentos_usados, game.puntaje));
    }
}
// Id
const saveData = () => {
    localStorage.setItem("id", id);
}
const loadData = () => {
    return localStorage.getItem("id");
}

async function iniciar() {
    await loadPlayers();
    await loadWords();
    await loadCategories();
    await loadGames();

    let currentId = loadData()
    if (currentId) {
        id = Number(currentId);
    } else {
        id = 0;
    }

    if (document.getElementById("categorias")) {
        buttonAdmin();
        loadCategoryHTML();
    }

    if (document.getElementById("tabla")) {
        loadPlayersTable();
    }
}
iniciar();

// cargar botones de categorias en categorias.html
const loadCategoryHTML = () => {
    for (const category of categories) {
        ui.createCategory(category.id, category.category);
    }
}

// USUARIO
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
    let id = login(username, password);
    if (id == 0) {
        ui.showModal("Error", "Contraseña incorrecta.");
    } else if (id < 0) {
        ui.showModal("Error", "El usuario no existe.");
    } else {
        saveData();
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
        saveData();
        window.location.href = "categorias.html";
    }
}
// Cierre de sesión
const modalSignOut = () => {
    ui.showModalSignOut();
}
const signOut = () => {
    id = 0;
    localStorage.removeItem("id");
    window.location.href = "index.html";
}



// RANKING
// inicializacion de la pagina
const buttonResetAdmin = () => {
    for (let i = 0; i < players.length; i++) {
        if (players[i].id == id) {
            if (players[i].admin) {
                document.getElementById("btnReset").style.display = "block";
            }
        }
    }
}
const iniciarRanking = () => {
    rankingPlayer();
    buttonResetAdmin();
}
// resetear ranking (resetear los puntos de todos los usuarios)
const resetRanking = () => {
    for (let i = 0; i < players.length; i++) {
        players[i].points = 0;
        putPlayer({usuario: players[i].username, contraseña: players[i].password, puntaje: 0, ingreso: players[i].signIn, administrador: players[i].admin, id: players[i].id});
    }
    rankingPlayer();
}



// FUNCIONES DE ADMINISTRADOR
// Inicializacion de la pagina
let table;
const buttonAdmin = () => {
    for (let i = 0; i < players.length; i++) {
        if (players[i].id == id) {
            if (players[i].admin) {
                document.getElementById("btnAdmin").style.display = "block";
            }
        }
    }
}
const admin = (funcion) => {
    let action;
    switch (table) {
        case "Player":
            switch (funcion) {
                case "Add":
                    action = buttonAddPlayer;
                case "Update":
                    action = buttonUpdatePlayer;
                case "Delete":
                    action = buttonErasePlayer;
            }
        case "Word":
            switch (funcion) {
                case "Add":
                    action = buttonAddWord;
                case "Update":
                    action = buttonUpdateWord;
                case "Delete":
                    action = buttonEraseWord;
            }
        case "Category":
            switch (funcion) {
                case "Add":
                    action = buttonAddCategory;
                case "Update":
                    action = buttonUpdateCategory;
                case "Delete":
                    action = buttonEraseCategory;
            }
    }
    ui.inputs(table, funcion, action);
}

// Jugadores
// ver tabla usuarios
const loadPlayersTable = () => {
    let registros = `<tr><th>ID</th><th>Usuario</th><th>Contraseña</th><th>Puntaje</th><th>Ingreso</th><th>Admin</th></tr>`;
    for (let i = 0; i < players.length; i++) {
        registros += `<tr><td>${players[i].id}</td><td>${players[i].username}</td><td>${players[i].password}</td><td>${players[i].points}</td><td>${players[i].signIn}</td><td>${players[i].admin}</td></tr>`;
    }
    document.getElementById("tabla").innerHTML = registros;
    table = "Player";
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
            putPlayer({usuario: user, contraseña: password, puntaje: points, ingreso: signIn, administrador: admin, id: idUser});
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
        ui.showModal("Error", "No se encontro el registro.");
    }
}
// eliminar usuario
const erasePlayer = (idUser) => {
    let erase = false;
    for (let i = 0; i < players.length; i++) {
        if (players[i].id == idUser) {
            players.splice(i, 1);
            deletePlayer({id: idUser});
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
        ui.showModal("Error", "No se encontro el registro.")
    }
}

// Palabras
// ver tabla palabras
const loadWordsTable = () => {
    let registros = `<tr><th>ID</th><th>Palabra</th><th>Dificultad</th><th>Categoria</th><th>Admin</th></tr>`;
    for (let i = 0; i < words.length; i++) {
        registros += `<tr><td>${words[i].id}</td><td>${words[i].word}</td><td>${words[i].dificulty}</td><td>${words[i].category}</td><td>${words[i].admin}</td></tr>`;
    }
    document.getElementById("tabla").innerHTML = registros;
    table = "Word";
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
        postWord({palabra: word, dificultad: dificulty, id_categoria: category, id_admin: id});
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
            putWord({palabra: word, dificultad: dificulty, id_categoria: category, id_admin: id, id: idWord});
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
        ui.showModal("Error", "No se encontro el registro.")
    }
}
// eliminar palabra
const eraseWord = (idWord) => {
    let erase = false;
    for (let i = 0; i < words.length; i++) {
        if (words[i].id == idWord) {
            words.splice(i, 1);
            deleteWord({id: idWord});
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
        ui.showModal("Error", "No se encontro el registro.")
    }
}

// Categorias
// ver tabla categorias
const loadCategoriesTable = () => {
    let registros = `<tr><th>ID</th><th>Categoria</th></tr>`;
    for (let i = 0; i < categories.length; i++) {
        registros += `<tr><td>${categories[i].id}</td><td>${categories[i].category}</td></tr>`
    }
    document.getElementById("tabla").innerHTML = registros;
    table = "Category";
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
            putCategory({categoria: category, id: idCategory});
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
        ui.showModal("Error", "No se encontro el registro.")
    }
}
// eliminar categoria
const eraseCategory = (idCategory) => {
    let erase = false;
    for (let i = 0; i < categories.length; i++) {
        if (categories[i].id == idCategory) {
            categories.splice(i, 1);
            deleteCategory({id: idCategory});
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
        ui.showModal("Error", "No se encontro el registro.")
    }
}

// Partidas
// ver tabla partidas
const loadGamesTable = () => {
    let registros = `<tr><th>ID</th><th>Palabra</th><th>Jugador</th><th>Intentos</th><th>Puntaje</th></tr>`;
    for (let i = 0; i < games.length; i++) {
        registros += `<tr><td>${games[i].id}</td><td>${games[i].word}</td><td>${games[i].player}</td><td>${games[i].attempts}</td><td>${games[i].points}</td></tr>`
    }
    document.getElementById("tabla").innerHTML = registros;
    table = "Partidas";
}
// añadir partida
const addGame = (word, player, attemptsUsed, point) => {
    let object = new Game(word, player, attemptsUsed, point);
    games.push(object);
    postGame({id_palabra: word, id_jugador: player, intentos_usados: attemptsUsed, puntaje: point});
    return object.id;
}
const buttonAddGame = () => {
    let word = ui.getWordId();
    let player = ui.getPlayerId();
    let attemptsUsed = ui.getAttempts();
    let point = ui.getPoints();
    let object = addGame(word, player, attemptsUsed, point);
    loadGamesTable();
}
// editar partida
const updateGame = (idGame, word, player, attemptsUsed, point) => {
    let update = false;
    for (let i = 0; i < games.length; i++) {
        if (games[i].id == idGame) {
            games[i].word = word;
            games[i].player = player;
            games[i].attempts = attemptsUsed;
            games[i].points = point;
            putCategory({id_palabra: word, id_jugador: player, intentos_usados: attemptsUsed, puntaje: point, id: idGame});
            update = true;
        }
    }
    return update;
}
const buttonupdateGame = () => {
    let idGame = ui.getId();
    let word = ui.getWordId();
    let player = ui.getPlayerId();
    let attemptsUsed = ui.getAttempts();
    let point = ui.getPoints();
    let update = updateGame(idGame, word, player, attemptsUsed, point);
    if (update) {
        loadGamesTable();
    } else {
        ui.showModal("Error", "No se encontro el registro.")
    }
}
// eliminar partida
const eraseGame = (idGame) => {
    let erase = false;
    for (let i = 0; i < games.length; i++) {
        if (games[i].id == idGame) {
            games.splice(i, 1);
            deleteGame({id: idGame});
            erase = true;
        }
    }
    return erase;
}
const buttonEraseGame = () => {
    let idGame = ui.getId();
    let erase = eraseGame(idGame);
    if (erase) {
        loadGamesTable();
    } else {
        ui.showModal("Error", "No se encontro el registro.")
    }
}



// FUNCIONAMIENTO DEL JUEGO
let categoryWord;
let secretWordObject;
let secretWord;
let hiddenWord = [];
let attempts = 6;
let points;
let usedLetters = [];
// levar categoria
const irJuego = (idCat) => {
    localStorage.setItem("categoria", idCat);
    window.location.href = "juego.html";
    categoryWord = Number(localStorage.getItem("categoria"));
}
const prepareGame = () => {
    // buscar posibles palabras (de la categoria elegida y no jugadas)
    let wordsCategory = [];
    for (let i = 0; i < words.length; i++) {
        if (words[i].category === categoryWord) {
            let played = false;
            for (let j = 0; j < games.length; j++) {
                if (games[j].player === id && games[j].word === words[i].id) {
                    played = true;
                    break;
                }
            }
            if (!played) {
                wordsCategory.push(words[i]);
            }
        }
    }
    if (wordsCategory.length === 0) {
        ui.showModalNoWords();
    } else {
        // eligiendo palabra
        let random = Math.floor(Math.random() * wordsCategory.length);
        secretWordObject = wordsCategory[random];
        secretWord = secretWordObject.word.toUpperCase();

        // mostrar palabra
        for (let i = 0; i < secretWord.length; i++) {
            hiddenWord.push("_");
        }
        ui.showWord(hiddenWord);

        // inicializar puntos
        switch (secretWordObject.dificulty) {
            case "Fácil":
                points = 6;
            case "Medio":
                points = 12;
            case "Difícil":
                points = 18;
        }
    }
}

const checkLetter = (letter) => {
    // checkear si la letra esta en la palabra
    if (!usedLetters.includes(letter)) {
        usedLetters.push(letter);
        let found = false;
        for (let i = 0; i < secretWord.length; i++) {
            if (secretWord[i] == letter) {
                hiddenWord[i] = letter;
                found = true;
            }
        }
        // actualizar palabra/ahorcado
        if (found) {
            ui.showWord(hiddenWord);
        } else {
            attempts--;
            switch (secretWordObject.dificulty) {
                case "Fácil":
                    points--;
                case "Medio":
                    points -= 2;
                case "Difícil":
                    points -= 3;
            }
            ui.changeAhorcado(attempts);
        }
        ui.changeLetter(found, letter);
        ui.showWord(hiddenWord);
        
        // checkeo si gano o perdio
        if (attempts === 0 || hiddenWord.join("") === secretWord) {
            finishGame();
        }
    }
}
const finishGame = () => {
    // guardo la partida
    games.push(new Game(secretWordObject.id, id, 6-attempts, points));
    postGame({id_palabra: secretWordObject.id, id_jugador: id, intentos_usados: attempts, puntaje: points});

    // guardo los puntos
    for (let i = 0; i < players.length; i++) {
        if (players[i].id === id) {
            players[i].points += points;
            putPlayer({usuario: players[i].username, contraseña: players[i].password, puntaje: players[i].points, ingreso: players[i].signIn, administrador: players[i].admin, id: id});
        }
    }

    // muestro los modals
    if (attempts === 0) {
        ui.showModalGame("Game over", `Te quedaste sin intentos. La palabra era ${secretWord}.`)
    } else {
        ui.showModalGame("Ganaste", `Felicitaciones, completaste la palabra. Ganaste ${points} puntos.`)
    }
}