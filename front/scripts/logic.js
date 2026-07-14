// INICIALIZACION
// Variables globales
let players;
let words;
let categories;
let games;
let id;

// Cargando las variables globales
async function loadPlayers() {
    players = [];
    let data = await getPlayerTable();
    for (const player of data) {
        let date = player.ingreso.slice(0,10);
        let admin = player.administrador == 1 ? true : false;
        players.push(new Player(player.usuario, player.contraseña, player.puntaje, date, admin, player.id));
    }
}
async function loadWords() {
    words = [];
    let data = await getWordTable();
    for (const word of data) {
        words.push(new Word(word.palabra, word.dificultad, word.id_categoria, word.id_admin, word.id));
    }
}
async function loadCategories() {
    categories = [];
    let data = await getCategoryTable();
    for (const category of data) {
        categories.push(new Category(category.categoria, category.id));
    }
}
async function loadGames() {
    games = [];
    let data = await getGameTable();
    for (const game of data) {
        games.push(new Game(game.id_palabra, game.id_jugador, game.intentos_usados, game.puntaje, game.id));
    }
}
// Id
const saveData = () => {
    localStorage.setItem("id", id);
}
const loadData = () => {
    let currentId = localStorage.getItem("id");
    if (currentId) {
        id = Number(currentId);
    } else {
        id = 0;
    }
}

// cargar botones de categorias en categorias.html
async function loadCategoryHTML () {
    await loadCategories();
    for (const category of categories) {
        ui.createCategory(category.id, category.categoria);
    }
    await loadPlayers();
    loadData();
    buttonAdmin();
}

// USUARIO
async function iniciarUser() {
    await loadPlayers();
}
// Login
const login = (username, password) => {
    for (let i = 0; i < players.length; i++) {
        if (players[i].usuario === username) {
            if (players[i].contraseña === password) {
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
    if (id === 0) {
        ui.showModal("Error", "Contraseña incorrecta.");
    } else if (id < 0) {
        ui.showModal("Error", "El usuario no existe.");
    } else {
        saveData();
        window.location.href = "categorias.html"
    }
}
// Registro
async function register (username, password, password2) {
    let exist = 0;
    for (let i = 0; i < players.length; i++) {
        if (players[i].usuario === username) {
            exist++;
        }
    }
    if (exist === 0) {
        if (password === password2) {
            let date = new Date();
            let today = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
            let player = new Player(username, password, 0, today, false);
            players.push(player);
            await postPlayer({usuario: username, contraseña: password, puntaje: 0, ingreso: today, administrador: false});
            return player.id;
        } else {
            return -1;
        }
    } else {
        return 0;
    }   
}
async function buttonRegister () {
    let username = ui.getUser();
    let password = ui.getPassword();
    let password2 = ui.getSecondPassword();
    id = await register(username, password, password2);
    if (id === 0) {
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
        if (players[i].id === id) {
            if (players[i].administrador) {
                document.getElementById("btnReset").style.display = "block";
            }
        }
    }
}
async function iniciarRanking () {
    await rankingPlayer();
    await loadPlayers();
    loadData();
    buttonResetAdmin();
}
// resetear ranking (resetear los puntos de todos los usuarios)
const modalReset = () => {
    ui.showModalReset();
}
async function resetRanking () {
    for (let i = 0; i < players.length; i++) {
        players[i].puntaje = 0;
        putPlayer({usuario: players[i].usuario, contraseña: players[i].contraseña, puntaje: 0, ingreso: players[i].ingreso, administrador: players[i].administrador, id: players[i].id});
    }
    await rankingPlayer();
}



// FUNCIONES DE ADMINISTRADOR
// Inicializacion de la pagina
let table;
const buttonAdmin = () => {
    for (let i = 0; i < players.length; i++) {
        if (players[i].id === id) {
            if (players[i].administrador === true) {
                document.getElementById("btnAdmin").classList.remove("admin");
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
                    break;
                case "Update":
                    action = buttonUpdatePlayer;
                    break;
                case "Delete":
                    action = buttonErasePlayer;
                    break;
            }
            break;
        case "Word":
            switch (funcion) {
                case "Add":
                    action = buttonAddWord;
                    break;
                case "Update":
                    action = buttonUpdateWord;
                    break;
                case "Delete":
                    action = buttonEraseWord;
                    break;
            }
            break;
        case "Category":
            switch (funcion) {
                case "Add":
                    action = buttonAddCategory;
                    break;
                case "Update":
                    action = buttonUpdateCategory;
                    break;
                case "Delete":
                    action = buttonEraseCategory;
                    break;
            }
            break;
        case "Game":
            switch (funcion) {
                case "Add":
                    action = buttonAddGame;
                    break;
                case "Update":
                    action = buttonUpdateGame;
                    break;
                case "Delete":
                    action = buttonEraseGame;
                    break;
            }
            break;
    }
    ui.inputs(table, funcion, action);
}

// Jugadores
// ver tabla usuarios
async function loadPlayersTable () {
    await loadPlayers();
    let registros = `<tr><th>ID</th><th>Usuario</th><th>Contraseña</th><th>Puntaje</th><th>Ingreso</th><th>Admin</th></tr>`;
    for (let i = 0; i < players.length; i++) {
        registros += `<tr><td>${players[i].id}</td><td>${players[i].usuario}</td><td>${players[i].contraseña}</td><td>${players[i].puntaje}</td><td>${players[i].ingreso}</td><td>${players[i].administrador}</td></tr>`;
    }
    document.getElementById("tabla").innerHTML = registros;
    table = "Player";
}
// añadir usuario
async function addPlayer (user, password, points, signin, admin) {
    let exist = 0;
    for (let i = 0; i < players.length; i++) {
        if (players[i].usuario === user) {
            exist++;
        }
    }
    if (exist === 0) {
        let object = new Player(user, password, points, signin, admin);
        players.push(object);
        await postPlayer({usuario: user, contraseña: password, puntaje: points, ingreso: signin, administrador: admin});
        return object.id;
    } else {
        return 0;
    }
}
async function buttonAddPlayer () {
    let user = ui.getUser();
    let password = ui.getPassword();
    let points = ui.getPoints();
    let signin = ui.getSignIn();
    let admin = ui.getAdmin();
    if (!user || !password || !points || !signin) {
        ui.showModal("Error", "No completaste todos los datos necesarios.")
    } else {
        let userId = await addPlayer(user, password, points, signin, admin);
        if (userId === 0) {
            ui.showModal("Error", "Este usuario ya existe.");
        } else {
            await loadPlayersTable();
        }
    }
}
// actualizar usuario
async function updatePlayer (idUser, user, password, points, signIn, admin) {
    let update = false;
    for (let i = 0; i < players.length; i++) {
        if (players[i].id === idUser) {
            players[i].usuario = user;
            players[i].contraseña = password;
            players[i].puntaje = points;
            players[i].ingreso = signIn;
            players[i].administrador = admin;
            await putPlayer({usuario: user, contraseña: password, puntaje: points, ingreso: signIn, administrador: admin, id: idUser});
            update = true;
        }
    }
    return update;
}
async function buttonUpdatePlayer () {
    let idUser = ui.getId();
    let user = ui.getUser();
    let password = ui.getPassword();
    let points = ui.getPoints();
    let signin = ui.getSignIn();
    let admin = ui.getAdmin();
    if (!idUser || !user || !password || !points || !signin) {
        ui.showModal("Error", "No completaste todos los datos necesarios.");
    } else {
        let update = await updatePlayer(idUser, user, password, points, signin, admin);
        if (update) {
            await loadPlayersTable();
        } else {
            ui.showModal("Error", "No se encontro el registro.");
        }
    }
}
// eliminar usuario
async function erasePlayer (idUser) {
    let erase = false;
    for (let i = 0; i < players.length; i++) {
        if (players[i].id === idUser) {
            players.splice(i, 1);
            await deletePlayer({id: idUser});
            erase = true;
        }
    }
    return erase;
}
async function buttonErasePlayer () {
    let idUser = ui.getId();
    if (!idUser) {
        ui.showModal("Error", "No completaste todos los datos necesarios.");
    } else {
        let erase = await erasePlayer(idUser);
        if (erase) {
            await loadPlayersTable();
        } else {
            ui.showModal("Error", "No se encontro el registro.")
        }
    }
}

// Palabras
// ver tabla palabras
async function loadWordsTable () {
    await loadWords();
    let registros = `<tr><th>ID</th><th>Palabra</th><th>Dificultad</th><th>Categoria</th><th>Admin</th></tr>`;
    for (let i = 0; i < words.length; i++) {
        registros += `<tr><td>${words[i].id}</td><td>${words[i].palabra}</td><td>${words[i].dificultad}</td><td>${words[i].id_categoria}</td><td>${words[i].id_admin}</td></tr>`;
    }
    document.getElementById("tabla").innerHTML = registros;
    table = "Word";
}
// añadir palabra
async function addWord (word, dificulty, category) {
    let exist = 0;
    for (let i = 0; i < words.length; i++) {
        if (words[i].palabra === word) {
            exist++;
        }
    }
    if (exist === 0) {
        loadData();
        let object = new Word(word, dificulty, category, id);
        words.push(object);
        await postWord({palabra: word, dificultad: dificulty, id_categoria: category, id_admin: id});
        return object.id;
    } else {
        return 0;
    }
}
async function buttonAddWord () {
    let word = ui.getWord();
    let dificulty = ui.getDificulty();
    let category = ui.getCategoryId();
    if (!word || !dificulty || !category) {
        if (dificulty === 0) {
            ui.showModal("Error", "La dificultad debe ser del 1 al 3, no se aceptan otros numeros.");
        } else {
            ui.showModal("Error", "No completaste todos los datos necesarios.");
        }
    } else {
        let object = await addWord(word, dificulty, category);
        if (object > 0) {
            await loadWordsTable();
        } else {
            ui.showModal("Error", "Ya existe este registro.")
        }
    }
}
// actualizar palabra
async function updateWord (idWord, word, dificulty, category) {
    let update = false;
    for (let i = 0; i < words.length; i++) {
        if (words[i].id === idWord) {
            words[i].palabra = word;
            words[i].dificultad = dificulty;
            words[i].id_categoria = category;
            words[i].id_admin = id;
            await putWord({palabra: word, dificultad: dificulty, id_categoria: category, id_admin: id, id: idWord});
            update = true;
        }
    }
    return update;
}
async function buttonUpdateWord () {
    let idWord = ui.getId();
    let word = ui.getWord();
    let dificulty = ui.getDificulty();
    let category = ui.getCategoryId();
    if (!idWord || !Word || !dificulty || !category) {
        if (dificulty === 0) {
            ui.showModal("Error", "La dificultad debe ser del 1 al 3, no se aceptan otros numeros.");
        } else {
            ui.showModal("Error", "No completaste todos los datos necesarios.");
        }
    } else {
        let update = await updateWord(idWord, word, dificulty, category);
        if (update) {
            await loadWordsTable();
        } else {
            ui.showModal("Error", "No se encontro el registro.")
        }
    }
}
// eliminar palabra
async function eraseWord (idWord) {
    let erase = false;
    for (let i = 0; i < words.length; i++) {
        if (words[i].id === idWord) {
            words.splice(i, 1);
            await deleteWord({id: idWord});
            erase = true;
        }
    }
    return erase;
}
async function buttonEraseWord () {
    let idWord = ui.getId();
    if (!idWord) {
        ui.showModal("Error", "No completaste todos los datos necesarios.");
    } else {
        let erase = await eraseWord(idWord);
        if (erase) {
            await loadWordsTable();
        } else {
            ui.showModal("Error", "No se encontro el registro.")
        }
    }
}

// Categorias
// ver tabla categorias
async function  loadCategoriesTable () {
    await loadCategories();
    let registros = `<tr><th>ID</th><th>Categoria</th></tr>`;
    for (let i = 0; i < categories.length; i++) {
        registros += `<tr><td>${categories[i].id}</td><td>${categories[i].categoria}</td></tr>`
    }
    document.getElementById("tabla").innerHTML = registros;
    table = "Category";
}
// añadir categoria
async function addCategory (category) {
    let exist = 0;
    for (let i = 0; i < categories.length; i++) {
        if (categories[i].categoria === category) {
            exist++;
        }
    }
    if (exist === 0) {
        let object = new Category(category);
        categories.push(object);
        await postCategory({categoria: category});
        return object.id;
    } else {
        return 0;
    }
}
async function buttonAddCategory () {
    let category = ui.getCategory();
    if (!category) {
        ui.showModal("Error", "No completaste todos los datos necesarios.");
    } else {
        let object = await addCategory(category);
        if (object > 0) {
            await loadCategoriesTable();
            ui.createCategory();
        } else {
            ui.showModal("Error", "Ya existe este registro.")
        }
    }
}
// editar categoria
async function updateCategory (idCategory, category) {
    let update = false;
    for (let i = 0; i < categories.length; i++) {
        if (categories[i].id === idCategory) {
            categories[i].categoria = category;
            await putCategory({categoria: category, id: idCategory});
            update = true;
        }
    }
    return update;
}
async function buttonUpdateCategory () {
    let idCategory = ui.getId();
    let category = ui.getCategory();
    if (!idCategory || !category) {
        ui.showModal("Error", "No completaste todos los datos necesarios.");
    } else {
        let update = await updateCategory(idCategory, category);
        if (update) {
            await loadCategoriesTable();
        } else {
            ui.showModal("Error", "No se encontro el registro.")
        }
    }
}
// eliminar categoria
async function eraseCategory (idCategory) {
    let erase = false;
    for (let i = 0; i < categories.length; i++) {
        if (categories[i].id === idCategory) {
            categories.splice(i, 1);
            await deleteCategory({id: idCategory});
            erase = true;
        }
    }
    return erase;
}
async function buttonEraseCategory () {
    let idCategory = ui.getId();
    if (!idCategory) {
        ui.showModal("Error", "No completaste todos los datos necesarios.");
    } else {
        let erase = await eraseCategory(idCategory);
        if (erase) {
            await loadCategoriesTable();
        } else {
            ui.showModal("Error", "No se encontro el registro.")
        }
    }
}

// Partidas
// ver tabla partidas
async function loadGamesTable () {
    await loadGames();
    let registros = `<tr><th>ID</th><th>Palabra</th><th>Jugador</th><th>Intentos</th><th>Puntaje</th></tr>`;
    for (let i = 0; i < games.length; i++) {
        registros += `<tr><td>${games[i].id}</td><td>${games[i].id_palabra}</td><td>${games[i].id_jugador}</td><td>${games[i].intentos_usados}</td><td>${games[i].puntaje}</td></tr>`
    }
    document.getElementById("tabla").innerHTML = registros;
    table = "Game";
}
// añadir partida
async function addGame (word, player, attemptsUsed, point) {
    let object = new Game(word, player, attemptsUsed, point);
    games.push(object);
    await postGame({id_palabra: word, id_jugador: player, intentos_usados: attemptsUsed, puntaje: point});
    return object.id;
}
async function buttonAddGame () {
    let word = ui.getWordId();
    let player = ui.getPlayerId();
    let attemptsUsed = ui.getAttempts();
    let point = ui.getPoints();
    if (!word || !player || !attemptsUsed || !point) {
        ui.showModal("Error", "No completaste todos los datos necesarios.");
    } else {
        let object = await addGame(word, player, attemptsUsed, point);
        await loadGamesTable();
    }
}
// editar partida
async function updateGame (idGame, word, player, attemptsUsed, point) {
    let update = false;
    for (let i = 0; i < games.length; i++) {
        if (games[i].id === idGame) {
            games[i].id_palabra = word;
            games[i].id_jugador = player;
            games[i].intentos_usados = attemptsUsed;
            games[i].puntaje = point;
            await putGame({id_palabra: word, id_jugador: player, intentos_usados: attemptsUsed, puntaje: point, id: idGame});
            update = true;
        }
    }
    return update;
}
async function buttonUpdateGame () {
    let idGame = ui.getId();
    let word = ui.getWordId();
    let player = ui.getPlayerId();
    let attemptsUsed = ui.getAttempts();
    let point = ui.getPoints();
    if (!idGame || !word || !player || !attemptsUsed || !point) {
        ui.showModal("Error", "No completaste todos los datos necesarios.");
    } else {
        let update = await updateGame(idGame, word, player, attemptsUsed, point);
        if (update) {
            await loadGamesTable();
        } else {
            ui.showModal("Error", "No se encontro el registro.")
        }
    }
}
// eliminar partida
async function eraseGame (idGame) {
    let erase = false;
    for (let i = 0; i < games.length; i++) {
        if (games[i].id === idGame) {
            games.splice(i, 1);
            await deleteGame({id: idGame});
            erase = true;
        }
    }
    return erase;
}
async function buttonEraseGame () {
    let idGame = ui.getId();
    if (!idGame) {
        ui.showModal("Error", "No completaste todos los datos necesarios.");
    } else {
        let erase = await eraseGame(idGame);
        if (erase) {
            await loadGamesTable();
        } else {
            ui.showModal("Error", "No se encontro el registro.")
        }
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
// guardar categoria y cargar pagina
const irJuego = (idCat) => {
    localStorage.setItem("categoria", idCat);
    window.location.href = "juego.html";
}
async function prepareGame () {
    // descargar datos
    await loadWords();
    await loadGames();
    await loadPlayers();
    loadData();
    // traer categoria
    categoryWord = Number(localStorage.getItem("categoria"));
    // buscar posibles palabras (de la categoria elegida y no jugadas)
    let wordsCategory = [];
    for (let i = 0; i < words.length; i++) {
        if (words[i].id_categoria === categoryWord) {
            let played = false;
            for (let j = 0; j < games.length; j++) {
                if (games[j].id_jugador === id && games[j].id_palabra === words[i].id) {
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
        secretWord = secretWordObject.palabra.toUpperCase();

        // mostrar palabra
        for (let i = 0; i < secretWord.length; i++) {
            hiddenWord.push("_");
        }
        ui.showWord(hiddenWord);

        // inicializar puntos
        switch (secretWordObject.dificultad) {
            case "Fácil":
                points = 6;
                break;
            case "Medio":
                points = 12;
                break;
            case "Difícil":
                points = 18;
                break;
        }
    }
}

const checkLetter = (letter) => {
    // checkear si la letra esta en la palabra
    if (!usedLetters.includes(letter)) {
        usedLetters.push(letter);
        let found = false;
        for (let i = 0; i < secretWord.length; i++) {
            if (secretWord[i] === letter) {
                hiddenWord[i] = letter;
                found = true;
            }
        }
        // actualizar palabra/ahorcado
        if (found) {
            ui.showWord(hiddenWord);
        } else {
            attempts--;
            switch (secretWordObject.dificultad) {
                case "Fácil":
                    points--;
                    break;
                case "Medio":
                    points -= 2;
                    break;
                case "Difícil":
                    points -= 3;
                    break;
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
    postGame({id_palabra: secretWordObject.id, id_jugador: id, intentos_usados: 6-attempts, puntaje: points});

    // guardo los puntos
    for (let i = 0; i < players.length; i++) {
        if (players[i].id === id) {
            players[i].puntaje += points;
            putPlayer({usuario: players[i].usuario, contraseña: players[i].contraseña, puntaje: players[i].puntaje, ingreso: players[i].ingreso, administrador: players[i].administrador, id: id});
        }
    }

    // muestro los modals
    if (attempts === 0) {
        ui.showModalGame("Game over", `Te quedaste sin intentos. La palabra era ${secretWord}.`)
    } else {
        ui.showModalGame("Ganaste", `Felicitaciones, completaste la palabra. Ganaste ${points} puntos.`)
    }
}