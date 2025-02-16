const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require("path");


dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 3000; 

app.use(express.json()); 
app.use(cors()); 

//CONEXIÓN A MONGO
if (process.env.NODE_ENV !== 'test') { 
    console.log('Conexión a mongo en:', process.env.MONGO_URI);
}

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        if (process.env.NODE_ENV !== 'test') { 
            console.log('Base de Datos conectada exitosamente');
        }
    })
    .catch(err => console.error('Error al conectar a MongoDB', err));

//importacion de rutas
const autenticacion = require('./routes/rutaAutenticacion');
const rutasCarros = require('./routes/rutasCarros');

app.use('/act4', autenticacion);
app.use('/act4', rutasCarros);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/',(req,res)=>{ // ruta principal de la aplicació
    res.send('Hola estas en mi API');
})

//para que la aplicación comience a funcionar
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en: http://localhost:${PORT}`);
    });
}

app.use((req, res, next) => {
    res.status(404).json({ message: "La ruta que buscas no existe" });
});
module.exports = app;
