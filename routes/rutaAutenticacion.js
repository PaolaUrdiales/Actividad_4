const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarios');
const router = express.Router();
const autenticarToken = require('../middlewares/authmiddleware');





router.post('/registro', async (req, res) => {
    try {
        const { usuario, correo, contrasena } = req.body;

        if (!usuario || !correo || !contrasena) {
            return res.status(400).json({ message: 'Tu registro está incompleto' });
        }

        if (!correo.includes('@')) {
            return res.status(400).json({ message: 'El correo debe contener un @' });
        }

        if (contrasena.length < 6 || contrasena.length > 8) {
            return res.status(400).json({ message: 'La contraseña debe tener entre 6 y 8 caracteres' });
        }

        const usuarioExiste = await Usuario.findOne({ correo });
        if (usuarioExiste) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        const hashsena = await bcrypt.hash(contrasena, 10);

        console.log("contraseña recibida", contrasena);
        const usuarioNuevo = new Usuario({ usuario, correo, contrasena: hashsena });
        await usuarioNuevo.save();

        res.status(201).json({ message: 'Nuevo usuario agregado con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { correo, contrasena } = req.body;// define las variables que utilizara en los procesos

        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({ message: 'El correo no ha sido registrado' });
        }

        const contraExiste = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!contraExiste) {
            return res.status(400).json({ message: 'La contraseña es incorrecta' });
        }
        const token = jwt.sign(
            { id: usuario._id, usuario: usuario.usuario, correo: usuario.correo, rol: usuario.rol },
            process.env.CLAVE_SECRETA,
            { expiresIn: '1h' }
        );
        res.json({
            message: "Inicio de sesión exitoso",
            token,
            usuario: usuario.usuario,
            correo: usuario.correo,
            rol: usuario.rol
        });
       
    } catch (error) {
        console.error('Error en el servidor', error);
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
});


router.get('/perfil', autenticarToken, async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.user.id).select('-contrasena'); // No mostramos la contraseña
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el perfil' });
    }
});


module.exports = router;