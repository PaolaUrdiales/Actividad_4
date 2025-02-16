const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");

describe("Pruebas de autenticación", () => {
    let token = "";
    let userData = null; // Guardaremos la información del usuario autenticado

    test("Debe iniciar sesión correctamente", async () => {
        const res = await request(app).post("/act4/login").send({
            correo: "RUBEN@usuario.com",
            contrasena: "manzana1"
        });
    
        console.log("Respuesta del login:", res.body);
    
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("token");
        expect(res.body).toHaveProperty("usuario");
        expect(res.body).toHaveProperty("correo");
        expect(res.body).toHaveProperty("rol"); 
    
        expect(res.body.rol).toBe("admin");  // Se verifica que realmente el usuario tenga rol admin
    
        // Guardamos el token para pruebas futuras
        token = res.body.token;
    });    

    test("Debe fallar con credenciales incorrectas", async () => {
        const res = await request(app).post("/act4/login").send({
            correo: "RUBEN@usuario.com",
            contrasena: "incorrecta"
        });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("message", "La contraseña es incorrecta");
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});






