const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");

describe(" Pruebas de CRUD de carros", () => {
    let token = "";
    let carroId = "";

    beforeAll(async () => {
        const loginRes = await request(app).post("/act4/login").send({
            correo: "RUBEN@usuario.com",
            contrasena: "manzana1"
        });

        token = loginRes.body.token;
        console.log(" Token obtenido:", token);
    });

    test("Debe agregar un carro", async () => {
        const res = await request(app)
            .post("/act4/carros")
            .set("Authorization", `Bearer ${token}`)
            .set("clave-secreta", process.env.CLAVE_SECRETA)
            .send({
                marca: "Toyota",
                modelo: "Corolla",
                año: 2023,
                precio: 25000,
                descripcion: "Carro nuevo"
            });

        console.log("🔹 Respuesta al agregar carro:", res.body);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("message", "Carro agregado con éxito");

        carroId = res.body.carro._id;
    });

    test("Debe obtener los carros", async () => {
        const res = await request(app)
            .get("/act4/carros")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test("Debe actualizar el carro", async () => {
        if (!carroId) {
            return console.log(" No hay carroId para actualizar. Saltando prueba.");
        }

        const res = await request(app)
            .put(`/act4/carros/${carroId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                marca: "Toyota",
                modelo: "Camry",
                año: 2024,
                precio: 27000,
                descripcion: "Carro actualizado"
            });

        console.log("🔹 Respuesta al actualizar carro:", res.body);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Carro actualizado correctamente");
    });

    test("Debe eliminar el carro", async () => {
        if (!carroId) {
            return console.log(" No hay carroId para eliminar. Saltando prueba.");
        }

        const res = await request(app)
            .delete(`/act4/carros/${carroId}`)
            .set("Authorization", `Bearer ${token}`);

        console.log("🔹 Respuesta al eliminar carro:", res.body);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Carro eliminado con éxito");
    });
    afterAll(async () => {
        await mongoose.connection.close();
    });
});




