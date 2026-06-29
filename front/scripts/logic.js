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
    for (let i = 0; i <= players.length-1; i++) {
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
    for (let i = 0; i <= players.length-1; i++) {
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

// Jugadores
// ver tabla usuarios
const loadPlayersTable = () => {
    let registros = `<tr><th>ID</th><th>Usuario</th><th>Contraseña</th><th>Puntaje</th><th>Ingreso</th><th>Admin</th></tr>`;
    for (let i = 0; i < players.length; i++) {
        registros += `<tr><td>${players[i].id}</td><td>${players[i].usuario}</td><td>${players[i].contraseña}</td><td>${players[i].puntaje}</td><td>${players[i].ingreso}</td><td>${players[i].admin}</td></tr>`;
    }
    document.getElementById("tablaUsuarios").innerHTML = registros; // hay que hacer la tabla en html
}
// añadir usuario
const buttonAddPlayer = () => {
    let user;
    let password;
    let password2;
    let userId = register(user, password, password2);
    if (userId == 0) {
        ui.showModal("Error", "Este usuario ya existe.");
    } else if (userId < 0) {
        ui.showModal("Error", "Contraseña no coincide.");
    } else {
        window.location.href = "tablaCategorias.html" // hay que crear la pagina en html
    }
}
// actualizar usuario
const updatePlayer = (idUser, user, password, points, signin, admin) => {
    for (let i = 0; i < players.length; i++) {
        if (players[i].id == idUser) {
            players[i].username = user;
            players[i].password = password,
            players[i].points = points;
            players[i].signIn = signin;
            players[i].admin = admin;
            putPlayer(players[i]);

            loadPlayersTable();
        }
    }
}
// eliminar usuario
const deletePlayer = () => {}

// palabras
const loadWordsTable = () => {
    let registros = `<tr><th>ID</th><th>Palabra</th><th>Dificultad</th><th>Categoria</th><th>Admin</th></tr>`;
    for (let i = 0; i < words.length; i++) {
        registros += `<tr><td>${words[i].id}</td><td>${words[i].palabra}</td><td>${words[i].dificultad}</td><td>${words[i].categoria}</td><td>${words[i].usuario}</td></tr>`;
    }
    document.getElementById("tablaPalabras").innerHTML = registros; // hay que hacer la tabla en html
}

// categorias
const loadCategoryTable = () => {
    let registros = `<tr><th>ID</th><th>Categoria</th></tr>`;
    for (let i = 0; i < categories.length; i++) {
        registros += `<tr><td>${categories[i].id}</td><td>${categories[i].categoria}</td></tr>`
    }
    document.getElementById("tablaCategorias").innerHTML = registros; // hay que hacer la tabla en html
}