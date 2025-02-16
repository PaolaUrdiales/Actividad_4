const jwt = require('jsonwebtoken');
const autenticarToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Acceso denegado. Es necesario un Token válido" });
    }

    jwt.verify(token, process.env.CLAVE_SECRETA, (err, user) => {
        if (err) return res.status(403).json({ message: "Token inválido" });
        req.user = user;

    console.log(" Usuario autenticado en middleware:", req.user); // Verifica qué info tiene req.user
       

        next();
    });
};

module.exports = autenticarToken;


// SE QUISO VALIDAR QUE SE NECESITARA OBLIGATORIAMENTE LA PRESENCIA DE LAS DOS AUTENTICACIONES, PERO PARA LAS PRUEBAS ERA LO QUE HACIA QUE NO FUNCIONARAN
// ASI QUE SE TUVIERON QUE HACER CAMBIOS

// const autenticarToken = (req, res, next) => { 
//     const authHeader = req.header('Authorization'); // variables para las validaciones y el acceso
//     const llave= req.header('Secret-Key');
    
//     if (!authHeader || !llave) return res.status(401).json({ message: 'Acceso denegado. Es necesario contar tanto con el Token como con la clave secreta' });// si no se da el token y la clave secreta (ambos) no habrá acceso

//     if (llave !== process.env.CLAVE_SECRETA){return res.status(403).json({message: 'Clave secreta incorrecta'})}; // si la clave secreta que ponga el usuario no coincide con la almacenada en el .env, no podrá ingresar
    
//     const token = authHeader.split(" ")[1]; 
//     if (!token) {
//         return res.status(401).json({ message: 'Token no proporcionado correctamente' });
//     }
//     //validación del token
//     jwt.verify(token, process.env.CLAVE_SECRETA, (err, user) => {
//         if (err) {return res.status(403).json({message: 'Token invalido'});}// si no es valido manda un error 403 junto con un mensaje
//         req.user = user; // si sí es correcto almacena la informacion en req.user y continua
//         next();
//     });