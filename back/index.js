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
        let existe = await realizarQuery(`SELECT * FROM Jugadores WHERE id = "${req.body.id}"`);
        if (existe.length == 0) {
            await realizarQuery(`
                INSERT INTO Jugadores (usuario, contraseña, puntaje, ingreso, administrador) VALUES 
                ("${req.body.usuario}", "${req.body.contraseña}", ${req.body.puntaje}, "${req.body.ingreso}", ${req.body.admin})
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

app.put('/jugadores', async function(req,res) {
    try {
        console.log(req.body) ;
        let existe = await realizarQuery(`SELECT * FROM Jugadores WHERE id = "${req.body.id}"`) ;
        if (existe.length > 0) {
            await realizarQuery(`UPDATE Jugadores SET usuario = "${req.body.usuario}", contraseña = "${req.body.contraseña}", puntaje = ${req.body.puntaje}, ingreso = "${req.body.ingreso}", administrador = ${req.body.admin} WHERE id = ${req.body.id}`) ;
            res.send({mensaje: "Jugador actualizado"}) ;
        } else {
            throw new Error("Error, este registro no existe todavia") ;
        }
    } catch (error) {
        if (error.message == "Error, este registro no existe todavia") {
            res.status(500).send(error.message) ;
        } else {
            res.status(500).send('Ha ocurrido un error, intentar más tarde') ;
        }
    }    
})

app.delete('/jugadores', async function(req,res) {
    try {
        console.log(req.body) ;
        let existe = await realizarQuery(`SELECT * FROM Jugadores WHERE id = "${req.body.id}"`) ;
        if (existe.length > 0) {
            await realizarQuery(`DELETE FROM Jugadores WHERE id = "${req.body.id}"`) ;
            res.send({msg: "Club eliminado"}) ;
        } else {
            throw new Error("Error, este registro no existe todavia") ;
        }
    } catch (error) {
        if (error.message == "Error, este registro no existe todavia") {
            res.status(500).send(error.message) ;
        } else {
            res.status(500).send('Ha ocurrido un error, intentar más tarde') ;
        }
    }    
})

app.get('/ranking', async function(req,res) {
    try {
        let respuesta = await realizarQuery("SELECT usuario, puntaje FROM Jugadores ORDER BY puntaje DESC LIMIT 10");
        res.send(respuesta);
    } catch (error) {
        res.status(500).send('Ha ocurrido un error, intentar más tarde');
    }
})


// words
app.get('/palabras', async function(req,res) {
    try {
        let respuesta = await realizarQuery("SELECT * FROM Palabras");
        res.send(respuesta);
    } catch (error) {
        res.status(500).send('Ha ocurrido un error, intentar más tarde');
    }
})

app.post('/palabras', async function(req,res) {
    try {
        console.log(req.body);
        let existe = await realizarQuery(`SELECT * FROM Palabras WHERE id = "${req.body.id}"`);
        if (existe.length == 0) {
            await realizarQuery(`
                INSERT INTO Palabras (palabra, dificultad, id_categoria, id_admin) VALUES 
                ("${req.body.palabra}", "${req.body.dificultad}", ${req.body.id_categoria}, ${req.body.id_admin})
                `) ;
            res.send({mensaje:"Palabra agregada"});
        } else {
            throw new Error('Esta palabra ya esta registrada') ;
        }
    } catch (error) {
        if (error.message == 'Esta palabra ya esta registrada') {
            res.status(500).send(error.message) ;
        } else {
            res.status(500).send('Ha ocurrido un error, intentar más tarde') ;
        }
    }
})

app.put('/palabras', async function(req,res) {
    try {
        console.log(req.body) ;
        let existe = await realizarQuery(`SELECT * FROM Palabras WHERE id = "${req.body.id}"`) ;
        if (existe.length > 0) {
            await realizarQuery(`UPDATE Palabras SET palabra = "${req.body.palabra}", dificultad = "${req.body.dificultad}", id_categoria = ${req.body.id_categoria}, id_admin = ${req.body.id_admin} WHERE id = ${req.body.id}`) ;
            res.send({mensaje: "Palabra actualizada"}) ;
        } else {
            throw new Error("Error, este registro no existe todavia") ;
        }
    } catch (error) {
        if (error.message == "Error, este registro no existe todavia") {
            res.status(500).send(error.message) ;
        } else {
            res.status(500).send('Ha ocurrido un error, intentar más tarde') ;
        }
    }    
})

app.delete('/palabras', async function(req,res) {
    try {
        console.log(req.body) ;
        let existe = await realizarQuery(`SELECT * FROM Palabras WHERE id = "${req.body.id}"`) ;
        if (existe.length > 0) {
            await realizarQuery(`DELETE FROM Palabras WHERE id = "${req.body.id}"`) ;
            res.send({msg: "Palabra eliminada"}) ;
        } else {
            throw new Error("Error, este registro no existe todavia") ;
        }
    } catch (error) {
        if (error.message == "Error, este registro no existe todavia") {
            res.status(500).send(error.message) ;
        } else {
            res.status(500).send('Ha ocurrido un error, intentar más tarde') ;
        }
    }    
})



// categories
app.get('/categorias', async function(req,res) {
    try {
        let respuesta = await realizarQuery("SELECT * FROM Categorias");
        res.send(respuesta);
    } catch (error) {
        res.status(500).send('Ha ocurrido un error, intentar más tarde');
    }
})

app.post('/categorias', async function(req,res) {
    try {
        console.log(req.body);
        let existe = await realizarQuery(`SELECT * FROM Categorias WHERE id = "${req.body.id}"`);
        if (existe.length == 0) {
            await realizarQuery(`
                INSERT INTO Categorias (categoria) VALUES ("${req.body.categoria}")`) ;
            res.send({mensaje:"Categoria agregada"});
        } else {
            throw new Error('Esta categoria ya esta registrada') ;
        }
    } catch (error) {
        if (error.message == 'Esta categoria ya esta registrada') {
            res.status(500).send(error.message) ;
        } else {
            res.status(500).send('Ha ocurrido un error, intentar más tarde') ;
        }
    }
})

app.delete('/categorias', async function(req,res) {
    try {
        console.log(req.body) ;
        let existe = await realizarQuery(`SELECT * FROM Categorias WHERE id = "${req.body.id}"`) ;
        if (existe.length > 0) {
            await realizarQuery(`DELETE FROM Categorias WHERE id = "${req.body.id}"`) ;
            res.send({msg: "Categoria eliminada"}) ;
        } else {
            throw new Error("Error, este registro no existe todavia") ;
        }
    } catch (error) {
        if (error.message == "Error, este registro no existe todavia") {
            res.status(500).send(error.message) ;
        } else {
            res.status(500).send('Ha ocurrido un error, intentar más tarde') ;
        }
    }    
})