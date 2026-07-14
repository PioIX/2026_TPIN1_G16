let lastIdPlayer = Number(localStorage.getItem("lastIdPlayer"));

if (!lastIdPlayer) {
    lastIdPlayer = 0;
}
class Player {
    constructor(username, password, points, signin, admin, id) {
        this.id = id || lastIdPlayer + 1;
        localStorage.setItem("lastIdPlayer", this.id);
        
        this.usuario = username;
        this.contraseña = password;
        this.puntaje = points;
        this.ingreso = signin;
        this.administrador = admin;
    }
}
