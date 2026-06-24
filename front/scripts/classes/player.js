let lastIdPlayer = 0;
class Player {
    constructor(username, password, points, signin) {
        lastIdPlayer += 1;
        this.id = lastIdPlayer;
        this.username = username;
        this.password = password;
        this.points = points;
        this.signIn = signin;
    }
}
