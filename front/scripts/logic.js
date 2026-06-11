// Inicialización
let users = getUserTable(); // hay que crear ela funcion en el backend
let id = 0

// Login
const login = (username, password) => {
    for (let i = 0; i <= users.length-1; i++) {
        if (users[i].username == username) {
            if (users[i].password == password) {
                return users[i].id;
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
const register = (name, username, password) => {
    let exist = 0;
    for (let i = 0; i <= users.length-1; i++) {
        if (users[i].username == username) {
            exist++;
        }
    }
    if (exist == 0) {
        user = new User(name, username, password);
        users.push(user);
        putUserTable(user); // hay que crear la funcion en el backend
        return user.id;
    } else {
        return -1;
    }
}
const buttonRegister = () => {
    let name = ui.getName();
    let username = ui.getUser();
    let password = ui.getPassword();
    id = register(name, username, password);
    if (id < 0) {
        ui.showModal("Error", "Este usuario ya existe.");
    }
}