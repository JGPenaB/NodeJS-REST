/**
 * @description Middleware que verifica si el método usado es válido para un URI.
 * Si no es válido, devuelve una respuesta 405 personalizada
 * 
 * @param validMethods Arreglo que contiene los métodos válidos.
 */
const validMethods = (validMethods = ["GET", "HEAD"]) => (req, res, next) => {
    if (validMethods.includes(req.method)){
        return next();
    }
    
    res.status(405);
    res.set("Allow",validMethods.join(", "));
    res.header("Content-Type", "application/problem+json");
    res.json({
        title: "Method not allowed",
        detail: `The method ${req.method} is not allowed for this resource`,
        status: 405
    });
};

module.exports = {validMethods};