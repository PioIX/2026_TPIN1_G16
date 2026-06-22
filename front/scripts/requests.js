// tabla jugadores
async function getPlayerTable() {
    let res = await fetch('http://localhost:4000/jugadores');
    let response = await res.json();

    return response;
}

async function postPlayerTable(player) {
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