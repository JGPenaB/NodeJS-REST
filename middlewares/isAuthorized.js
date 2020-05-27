const jwt = require("jsonwebtoken");
const secretKey = require("../config/jwt");

/**
 * Middleware que verifica si el cliente puede acceder a un URI con el método deseado.
 * Si no está autorizado (token faltante o expirado), devuelve error 401
 * 
 * @param methods Arreglo que contiene los métodos que requieran verificación
 */
const isAuthorized = (methods) => (req, res, next) => {

    //Si el método requiere autenticación, verifica el token
    if(methods.includes(req.method)){
        let token = req.headers["authorization"];

        if(token){
            if(token.startsWith("Bearer")){
                token = token.split(" ")[1];
            }

            jwt.verify(token, secretKey, (err, decoded) => {
                if(decoded){
                    req.tokenData = decoded;
                }
            });

            //Si se pudo extraer la información
            if(req.tokenData){
                return next();
            }
        }

        res.status(401);
        //res.set("Allow",methods.join(", "));
        res.header("Content-Type", "application/json");
        res.json({
            name: "Error 401",
            data:{
                content: "Unauthorized",
                method: req.method
            }
        });
        return;
    }

    //Caso contrario, no hace falta verificacion
    return next();
};

module.exports = {isAuthorized};