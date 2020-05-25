/**
 * Middleware que verifica si el método usado es válido para un URI.
 * Si no es válido, devuelve una respuesta 405 personalizada
 * 
 * @param validMethods Arreglo que contiene los métodos válidos. Por defecto es ["GET"]
 */
const validMethods = (validMethods = ["GET"]) => (req, res, next) => {
    if (validMethods.includes(req.method)) 
        return next();

    res.status(405);
    res.set("Allow",validMethods.join(", "));
    res.header("Content-Type", "application/json");
    res.json({
        name: "Error 405",
        data:{
            content: "Method not allowed",
            method: req.method
        }
    });
};

module.exports = {validMethods};