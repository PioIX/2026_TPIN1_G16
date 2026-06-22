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
}


const ui = new UserInterface();
