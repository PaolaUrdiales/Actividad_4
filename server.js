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

// CONEXIÓN A MONGO
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

// Importación de rutas
const autenticacion = require('./routes/rutaAutenticacion');
const rutasCarros = require('./routes/rutasCarros');

app.use('/act4', autenticacion);
app.use('/act4', rutasCarros);

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rutas para servir los archivos HTML sin necesidad de agregar '.html'
app.get("/registro", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "registro.html"));
});

app.get("/automoviles", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "automoviles.html"));
});

// Ruta principal de la aplicación
app.get('/', (req, res) => {
    res.send('Hola, estas en mi API');
});

// Para que la aplicación comience a funcionar
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en: http://localhost:${PORT}`);
    });
}

// Manejo de rutas no encontradas
app.use((req, res, next) => {
    res.status(404).json({ message: "La ruta que buscas no existe" });
});

module.exports = app;
