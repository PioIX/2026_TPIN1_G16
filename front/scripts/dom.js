class UserInterface {
    constructor() {}


    // gets
    getName() {
        return document.getElementById("name").value;
    }


    getUser() {
        return document.getElementById("user").value;
    }


    getPassword() {
        return document.getElementById("password").value;
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
