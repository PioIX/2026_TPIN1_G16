// tabla jugadores
async function getPlayerTable() {
    let res = await fetch('http://localhost:4000/jugadores');
    let response = await res.json();

    return response;
}

async function postPlayer(player) {
    const res = await fetch('http://localhost:4000/jugadores', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(player)
    })
    let response = await res.json();
    
    return response;
}

async function putPlayer(player) {
    const res = await fetch('http://localhost:4000/jugadores', {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(player)
    })
    let response = await res.json();

    return response;
}

async function deletePlayer(id) {
    const res = await fetch('http://localhost:4000/jugadores', {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(id)
    })
    let response = await res.json();

    return response;
}

async function rankingPlayer() {
    let res = await fetch('http://localhost:4000/ranking');
    let response = await res.json();

    let registros = `<tr><th>Usuario</th><th>Puntaje</th></tr>`;
    for (i = 0; i < response.length; i++) {
        registros += `<tr><td>${response[i].usuario}</td><td>${response[i].puntaje}</td></tr>`;
    }
    document.getElementById("tabla").innerHTML = registros;
}



// tabla palabras
async function getWordTable() {
    let res = await fetch('http://localhost:4000/palabras');
    let response = await res.json();

    return response;
}

async function postWord(word) {
    const res = await fetch('http://localhost:4000/palabras', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(word)
    })
    let response = await res.json();
    
    return response;
}

async function putWord(word) {
    const res = await fetch('http://localhost:4000/palabras', {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(word)
    })
    let response = await res.json();

    return response;
}

async function deleteWord(id) {
    const res = await fetch('http://localhost:4000/palabras', {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(id)
    })
    let response = await res.json();

    return response;
}



// tabla categorias
async function getCategoryTable() {
    let res = await fetch('http://localhost:4000/categorias');
    let response = await res.json();

    return response;
}

async function postCategory(category) {
    const res = await fetch('http://localhost:4000/categorias', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(category)
    })
    let response = await res.json();
    
    return response;
}

async function deleteCategory(id) {
    const res = await fetch('http://localhost:4000/categorias', {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(id)
    })
    let response = await res.json();

    return response;
}