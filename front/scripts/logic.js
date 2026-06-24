// Inicialización
let players = [];
let id = 0;
loadPlayers();

async function loadPlayers(){
    let data = await getPlayerTable();
    for (const player of data) {
        let date = player.ingreso.slice(0,10);
        players.push(new Player(player.usuario, player.contraseña, player.puntaje, date));
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
            let player = new Player(username, password, 0, today);
            players.push(player);
            postPlayerTable({usuario: username, contraseña: password, puntaje: 0, ingreso: today});
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
        window.location.href = "categorias.html"
    }
}
// Cierre de sesión
const signOut = () => {
    ui.showModal(); // crear nuevo modal
}