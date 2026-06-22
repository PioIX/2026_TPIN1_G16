let lastIdPlayer = 0;
class Player {
    constructor(username, password, signin) {
        lastIdPlayer += 1;
        this.id = lastIdPlayer;
        this.username = username;
        this.password = password;
        this.points = 0;
        this.signIn = signin;
    }
}
