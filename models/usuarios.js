const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    usuario: { type: String, required: true },
    correo: { type: String, required: true, unique: true },
    contrasena: { type: String, required: true },
    rol: { type: String, enum: ['admin', 'usuario'], default: 'usuario' } // 🔹 Cambié el default a 'usuario'
});

// Exportar el modelo correctamente
const Usuario = mongoose.model('Usuario', usuarioSchema);
module.exports = Usuario;
