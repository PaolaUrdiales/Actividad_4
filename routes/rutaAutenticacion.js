const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarios');
const autenticarToken = require('../middlewares/authmiddleware');

const router = express.Router();


router.post('/registro', async (req, res) => {
    try {
        const { usuario, correo, contrasena } = req.body;

        console.log("Intentando registrar usuario:", correo);

        // Verificar si el usuario ya existe
        const usuarioExistente = await Usuario.findOne({ correo });
        if (usuarioExistente) {
            console.log("Usuario ya registrado:", correo);
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashContrasena = await bcrypt.hash(contrasena, salt);

        // Crear el usuario
        const nuevoUsuario = new Usuario({
            usuario,
            correo,
            contrasena: hashContrasena,
        });

        await nuevoUsuario.save();

        console.log("Usuario registrado con éxito:", nuevoUsuario);

        res.status(201).json({ message: 'Usuario registrado exitosamente' });

    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        console.log("Intentando iniciar sesión con:", correo);

        // Buscar usuario en la base de datos
        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            console.log("Usuario no encontrado en la base de datos.");
            return res.status(400).json({ message: 'El correo no ha sido registrado' });
        }

        console.log("Usuario encontrado:", usuario);

        // Verificar la contraseña encriptada
        const contraExiste = await bcrypt.compare(contrasena, usuario.contrasena);

        if (!contraExiste) {
            console.log("Contraseña incorrecta para el usuario:", correo);
            return res.status(400).json({ message: 'La contraseña es incorrecta' });
        }

        // Generar el token JWT
        const token = jwt.sign(
            { id: usuario._id, usuario: usuario.usuario, correo: usuario.correo, rol: usuario.rol },
            process.env.CLAVE_SECRETA || "claveSecretaPorDefecto",
            { expiresIn: '1h' }
        );

        console.log("Inicio de sesión exitoso para:", usuario.correo);

        res.json({
            message: "Inicio de sesión exitoso",
            token,
            usuario: usuario.usuario,
            correo: usuario.correo,
            rol: usuario.rol
        });

    } catch (error) {
        console.error('Error en el servidor:', error);
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
