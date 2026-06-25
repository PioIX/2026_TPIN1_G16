let lastIdPlayer = 0;
class Player {
    constructor(username, password, points, signin, admin) {
        lastIdPlayer += 1;
        this.id = lastIdPlayer;
        this.username = username;
        this.password = password;
        this.points = points;
        this.signIn = signin;
        this.admin = admin;
    }
}
