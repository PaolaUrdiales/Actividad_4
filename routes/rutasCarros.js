const express = require('express');
const autenticarToken = require('../middlewares/authmiddleware');
const Carro = require('../models/autos');
const { agregarCarros, actualizarCarro, eliminarCarro } = require('../Controladores/controladorCarros');

const router = express.Router();


router.post("/carros", autenticarToken, agregarCarros);

router.put("/carros/:id", autenticarToken, actualizarCarro);

router.get("/carros", async (req, res) => {
    try {
        const carros = await Carro.find();
        res.json(carros);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener carros' });
    }
});

router.delete("/carros/:id", autenticarToken, eliminarCarro);

module.exports = router;

