// Inicialización
let players = getPlayerTable();
let id = 0

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
            let player = new Player(username, password, today);
            players.push(player);
            postPlayerTable(player);
            return player.id;
        } else {
            return -2;
        }
    } else {
        return -1;
    }   
}
const buttonRegister = () => {
    let username = ui.getUser();
    let password = ui.getPassword();
    let password2 = ui.getSecondPassword();
    id = register(username, password, password2);
    if (id == -1) {
        ui.showModal("Error", "Este usuario ya existe.");
    } else if (id == -2) {
        ui.showModal("Error", "Contraseña no coincide.");
    }
}