let lastIdUser = 0;
class User {
    constructor(name, username, password) {
        lastIdUser += 1;
        this.id = lastIdUser;
        this.name = name;
        this.username = username;
        this.password = password;
    }
}