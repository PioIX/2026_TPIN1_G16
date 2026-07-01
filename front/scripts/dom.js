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
                div += '<input id="password" placeholder="Contraseña">';
            }
        }
    }
}


const ui = new UserInterface();
