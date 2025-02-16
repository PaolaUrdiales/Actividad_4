const mongoose = require('mongoose');
const { nanoid } = require('nanoid'); 




const carroSchema = new mongoose.Schema({
    id: { type: String, unique: true, default: () => nanoid(6) }, 
    marca: { type: String, required: true },
    modelo: { type: String, required: true },
    año: { type: Number, required: true },
    precio: { type: Number, required: true },
    descripcion: { type: String, required: true },
    creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' } // Relación con usuario
});

const Carro = mongoose.model('Carro', carroSchema);
module.exports = Carro;
