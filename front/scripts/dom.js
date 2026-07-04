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
        return document.getElementById("id").value;
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
        if (dificulty == 1) {
            return "Fácil";
        } else if (dificulty == 2) {
            return "Medio";
        } else {
            return "Difícil";
        }
    }
    getCategoryId() {
        return document.getElementById("categoryId").value;
    }
    getCategory() {
        return document.getElementById("category").value;
    }


    // otros
    createCategory(idCategoria, categoria) {
        document.getElementById("categorias").innerHTML += `<button class="boton-principal" onclick="irJuego(${idCategoria})">${categoria}</a>`
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

    showModalTablas(tabla, funcion) {
        const modal = new bootstrap.Modal('#modalTablas', {
            keyboard: true,
            focus: true
        });

        inputs(tabla, funcion);

        modal.show();
    }

    inputs(tabla, funcion) {
        let div = document.getElementById("inputsModal").value
        if (funcion == "Eliminar") {
            div += '<input id="id" type="number" placeholder="ID">';
        } else {
            if (funcion == "Editar") {
                div += '<input id="id" type="number" placeholder="ID">';
            }
            if (tabla == "Jugadores") {
                div += '<input id="user" placeholder="Username">';
                div += '<input id="password" type="password" placeholder="Contraseña">';
                div += '<input id="points" type="number" placeholder="Puntaje">';
                div += '<input id="signin" type="date" placeholder="Fecha de ingreso">';
                div += '<label><input id="admin" type="checkbox">Administrador</label>';
            } else if (tabla == "Palabras") {
                div += '<input id="word" placeholder="Palabra">';
                div += '<input id="dificulty" type="number" min="1" max="3" placeholder="Dificultad">';
                div += '<input id="categoryId" type="number" placeholder="ID Categoria">';
            } else {
                div += '<input id="category" placeholder="Categoria">';
            }
        }
    }
}


const ui = new UserInterface();
