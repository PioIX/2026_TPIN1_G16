class UserInterface {
    constructor() {}


    // get
    getUser() {
        return document.getElementById("username").value;
    }
    getPassword() {
        return document.getElementById("password").value;
    }
    getSecondPassword() {
        return document.getElementById("password2").value;
    }
    getId() {
        return Number(document.getElementById("id").value);
    }
    getPoints() {
        return document.getElementById("points").value;
    }
    getSignIn() {
        return document.getElementById("signin").value;
    }
    getAdmin() {
        return document.getElementById("admin").checked;
    }
    getWord() {
        return document.getElementById("word").value;
    }
    getDificulty() {
        let dificulty = document.getElementById("dificulty").value;
        if (dificulty === 1) {
            return "Fácil";
        } else if (dificulty === 2) {
            return "Medio";
        } else if (dificulty === 3) {
            return "Difícil";
        } else {
            return 0;
        }
    }
    getCategoryId() {
        return document.getElementById("categoryId").value;
    }
    getCategory() {
        return document.getElementById("category").value;
    }
    getWordId() {
        return document.getElementById("wordId").value;
    }
    getPlayerId() {
        return document.getElementById("playerId").value;
    }
    getAttempts() {
        return document.getElementById("attempts").value;
    }
    getModalTablas() {
        return document.getElementById("modalTablas");
    }


    // otros
    createCategory(idCategoria, categoria) {
        document.getElementById("categorias").innerHTML += `<button class="boton-principal categorias" onclick="irJuego(${idCategoria})">${categoria}</button>`
    }

    showWord(hiddenWord) {
        document.getElementById("palabraEscondida").innerHTML = hiddenWord.join(" ");
    }

    changeAhorcado(image) {
        document.getElementById("ahorcado").src = `img/${image}.png`;
    }
    changeLetter(found, letter) {
        let l = document.querySelector(`#${letter}`);
        if (found) {
            l.classList.add("usada");
        } else {
            l.classList.add("fallada");
        }
    }


    // modal
    showModal(title, body) {
        document.getElementById("modalTitle").textContent = title;
        document.getElementById("modalBody").textContent = body;

        const modal = new bootstrap.Modal('#modal', {
            keyboard: true,
            focus: true
        });

        modal.show();
    }

    showModalSignOut() {
        const modal = new bootstrap.Modal('#modalSignOut', {
            keyboard: true,
            focus: true
        });

        modal.show();
    }

    showModalTablas() {
        const modal = new bootstrap.Modal('#modalTablas', {
            keyboard: true,
            focus: true
        });

        modal.show();
    }
    inputs(tabla, funcion, accion) {
        let div = "";
        if (funcion == "Delete") {
            div += '<div class="grupo-formulario"><input id="id" type="number" placeholder="ID"></div>';
        } else {
            if (funcion == "Update") {
                div += '<div class="grupo-formulario"><input id="id" type="number" placeholder="ID"></div>';
            }
            if (tabla == "Player") {
                div += '<div class="grupo-formulario"><input id="username" class="input-texto" placeholder="Username"></div>';
                div += '<div class="grupo-formulario"><input id="password" class="input-texto" type="password" placeholder="Contraseña"></div>';
                div += '<div class="grupo-formulario"><input id="points" type="number" placeholder="Puntaje"></div>';
                div += '<div class="grupo-formulario"><input id="signin" type="date" placeholder="Fecha de ingreso"></div>';
                div += '<div class="grupo-formulario"><label><input id="admin" type="checkbox">Administrador</label></div>';
            } else if (tabla == "Word") {
                div += '<div class="grupo-formulario"><input id="word" class="input-texto" placeholder="Palabra"></div>';
                div += '<div class="grupo-formulario"><input id="dificulty" class="input-texto" type="number" min="1" max="3" placeholder="Dificultad"></div>';
                div += '<div class="grupo-formulario"><input id="categoryId" type="number" placeholder="ID Categoria"></div>';
            } else if (tabla == "Category") {
                div += '<div class="grupo-formulario"><input id="category" class="input-texto" placeholder="Categoria"></div>';
            } else {
                div += '<div class="grupo-formulario"><input id="wordId" class="input-texto" placeholder="ID Palabra"></div>';
                div += '<div class="grupo-formulario"><input id="playerId" class="input-texto" placeholder="ID Jugador"></div>';
                div += '<div class="grupo-formulario"><input id="attempts" class="input-texto" placeholder="Intentos"></div>';
                div += '<div class="grupo-formulario"><input id="points" class="input-texto" placeholder="Puntaje"></div>';
            }
        }
        document.getElementById("inputsModal").innerHTML = div;
        document.getElementById("terminar").onclick = () => {
            accion();
            const modal = bootstrap.Modal.getInstance(document.getElementById("modalTablas"));
            if (modal) {
                modal.hide();
            }
        }
        this.showModalTablas();
    }

    showModalReset() {
        const modal = new bootstrap.Modal('#modalReset', {
            keyboard: true,
            focus: true
        });

        modal.show();
    }

    showModalNoWords() {
        const modal = new bootstrap.Modal('#modalNoWords', {
            keyboard: true,
            focus: true
        });

        modal.show();
    }
    showModalGame(title, body) {
        document.getElementById("modalGameTitle").textContent = title;
        document.getElementById("modalGameBody").textContent = body;

        const modal = new bootstrap.Modal('#modalGame', {
            keyboard: true,
            focus: true
        });

        modal.show();
    }
}


const ui = new UserInterface();