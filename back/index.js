var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
const { realizarQuery } = require('./modulos/mysql');

var app = express();
var port = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());

app.listen(port, function(){
    console.log(`Server running in http://localhost:${port}`);
});

app.get('/', function(req, res){
    res.status(200).send({
        message: 'GET Home route working fine!'
    });
});


// get
app.get('/clubes', async function(req, res) {
    let respuesta;
    if (req.query.id != undefined) {
        respuesta = await realizarQuery(`SELECT * FROM Clubes WHERE id_club=${req.query.id}`)
    } else {
        respuesta = await realizarQuery("SELECT * FROM Clubes");
    }    
    res.send(respuesta);
})


// post
app.post('/clubes', async function(req,res) {
    console.log(req.body) ;
    let existe = await realizarQuery(`SELECT * FROM Clubes WHERE nombre = "${req.body.nombre}" AND pais = "${req.body.pais}"`) ;
    if (existe.length > 0) {
        res.send("Ya existe este club, intentalo denuevo");
    } else {
        realizarQuery(`
        INSERT INTO Clubes (nombre, pais) VALUES
            ("${req.body.nombre}","${req.body.pais}");
        `);
        res.send({mensaje:"Club agregado"});
    }
})


// put
app.put('/clubes', async function(req, res) {
    console.log(req.body) ;
    let existe = await realizarQuery(`SELECT * FROM Clubes WHERE id_club = ${req.body.id_club}`) ;
    let club = await realizarQuery(`SELECT * FROM Clubes WHERE nombre = "${req.body.nombre}" AND pais = "${req.body.pais}"`)
    if (existe.length > 0) {
        if (club.length > 0) {
            res.send({mensaje: "Error, ya existe un registro igual"}) ;
        } else {
            await realizarQuery(`UPDATE Clubes SET nombre = "${req.body.nombre}", pais = "${req.body.pais}" WHERE id_club = ${req.body.id_club}`) ;
            res.send({mensaje: "Club actualizado"}) ;
        }
    } else {
        res.send({mensaje: "Error, este registro no existe todavia"}) ;
    }
})


// delete
app.delete('/clubes', async function(req, res) {
    console.log(req.body) ;
    let existe = await realizarQuery(`SELECT * FROM Clubes WHERE id_club = ${req.body.id_club}`) ;
    if (existe.length > 0) {
        await realizarQuery(`DELETE FROM Clubes WHERE id_club = ${req.body.id_club}`) ;
        res.send({msg: "Club eliminado"}) ;
    } else {
        res.send({msg: "Error, no existe este registro"}) ;
    }
})