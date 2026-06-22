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

// players
app.get('/jugadores', async function(req,res) {
    try {
        let respuesta = await realizarQuery("SELECT * FROM Jugadores");
        res.send(respuesta);
    } catch (error) {
        res.status(500).send('Ha ocurrido un error, intentar más tarde');
    }
})

app.post('/jugadores', async function(req,res) {
    try {
        console.log(req.body);
        let existe = await realizarQuery(`SELECT * FROM Jugadores WHERE usuario = "${req.body.usuario}"`);
        if (existe.length == 0) {
            await realizarQuery(`
                INSERT INTO Jugadores (usuario, contraseña, puntaje, ingreso) VALUES 
                ("${req.body.usuario}", "${req.body.contraseña}", ${req.body.puntaje}, "${req.body.ingreso}")
                `) ;
            res.send("Usuario agregado") ;
        } else {
            throw new Error('Este usuario ya esta registrado') ;
        }
    } catch (error) {
        if (error.message == 'Este usuario ya esta registrado') {
            res.status(500).send(error.message) ;
        } else {
            res.status(500).send('Ha ocurrido un error, intentar más tarde') ;
        }
    }
})