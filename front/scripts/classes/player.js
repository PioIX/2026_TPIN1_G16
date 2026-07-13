let lastIdPlayer = Number(localStorage.getItem("lastIdPlayer"));

if (!lastIdPlayer) {
    lastIdPlayer = 0;
}
class Player {
    constructor(username, password, points, signin, admin) {
        lastIdPlayer++;
        this.id = lastIdPlayer;
        localStorage.setItem("lastIdPlayer", lastIdPlayer);
        
        this.username = username;
        this.password = password;
        this.points = points;
        this.signIn = signin;
        this.admin = admin;
    }
}
