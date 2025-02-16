const Carro = require('../models/autos');
const mongoose = require('mongoose');

const agregarCarros = async (req, res) => {
   
    try {
        console.log(req.user.rol)
        if (req.user.rol !== "admin") {
            return res.status(403).json({ message: 'Acceso denegado. Solo los administradores pueden agregar carros.' });
        }

        const { marca, modelo, año, precio, descripcion } = req.body;
        if (!marca || !modelo || !año || !precio || !descripcion) {
            return res.status(400).json({ message: 'Hay deficiencias en el llenado de la información' });
        }
        const carroExiste = await Carro.findOne({ marca, modelo, año });
        if (carroExiste) {
            return res.status(400).json({ message: 'El carro ya existe' });
        }
        const nuevoCarro = new Carro({
            marca, modelo, año, precio, descripcion, creadoPor: req.user.id
        });
        await nuevoCarro.save();
        res.status(201).json({ message: 'Carro agregado con éxito', carro: nuevoCarro });

    } catch (error) {
        res.status(500).json({ message: 'Error al agregar carro', error: error.message });
    }
};

const actualizarCarro = async (req, res) => {

    try {
        
        const { id } = req.params;
        const { marca, modelo, año, precio, descripcion } = req.body;

        // Verificar si el carro existe
        const carroExistente = await Carro.findById(id);
        if (!carroExistente) {
            return res.status(404).json({ message: 'Carro no encontrado' });
        }
        if (carroExistente.creadoPor.toString() !== req.user.id) {
            return res.status(403).json({ message: 'No tienes permiso para modificar este carro' });
        }

        if (!marca || !modelo || !año || !precio || !descripcion) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }
        if (carroExistente.marca === marca &&
            carroExistente.modelo === modelo &&
            carroExistente.año === año &&
            carroExistente.precio === precio &&
            carroExistente.descripcion === descripcion) {
            return res.status(400).json({ message: "Esos datos ya han sido actualizados, ingresa nuevos" })
        }
        // Verificar si existe otro carro con la misma marca, modelo y año (excluyendo el que estamos editando)
        const carroDuplicado = await Carro.findOne({ marca, modelo, año, _id: { $ne: id } });
        if (carroDuplicado) {
            return res.status(400).json({ message: 'Ya existe otro carro con los mismos datos' });
        }

        // Actualizar los datos
        carroExistente.marca = marca;
        carroExistente.modelo = modelo;
        carroExistente.año = año;
        carroExistente.precio = precio;
        carroExistente.descripcion = descripcion;

        await carroExistente.save();
        return res.status(200).json({ message: 'Carro actualizado correctamente', carro: carroExistente });

    } catch (error) {
        return res.status(500).json({ message: 'Error al actualizar carro', error: error.message });
    }
};

const carros = async (req, res) => {
    try {
        const carros = await Carro.find();
        res.json(carros);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los carros', error: error.message });
    }
};

const eliminarCarro = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'El ID proporcionado no es válido' });
        }

        const carroEliminado = await Carro.findById(id);

        if (!carroEliminado) {
            return res.status(404).json({ message: 'Carro no encontrado' });
        }

        // Validar que el usuario que intenta eliminar sea el creador
        if (carroEliminado.creadoPor.toString() !== req.user.id) {
            return res.status(403).json({ message: 'No tienes permiso para eliminar este carro' });
        }

        await Carro.findByIdAndDelete(id);

        return res.json({ message: 'Carro eliminado con éxito' });

    } catch (error) {
        return res.status(500).json({ message: 'Error al eliminar carro', error: error.message });
    }
};


module.exports = {
    agregarCarros,
    carros,
    actualizarCarro,
    eliminarCarro
};