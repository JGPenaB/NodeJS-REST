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
                if(err){
                    res.status(401);
                    //res.set("Allow",methods.join(", "));
                    res.header("Content-Type", "application/problem+json");
                    res.json({
                        title: "Invalid token",
                        detail: "The provided token has expired or is not valid.",
                        status: 401
                    });
                }else{
                    req.tokenData = decoded;
                }
            });

            //Si se pudo extraer la información
            if(req.tokenData){
                return next();
            }
            
        }else{
            res.status(401);
            //res.set("Allow",methods.join(", "));
            res.header("Content-Type", "application/problem+json");
            res.json({
                title: "Missing token",
                detail: "The request does not contain an authorization header with a valid token.",
                status: 401
            });
            return;
        }
    }

    //Caso contrario, no hace falta verificacion
    return next();
};

module.exports = {isAuthorized};