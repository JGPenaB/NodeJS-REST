const express = require("express");
const app = express();
const hateoasLinks = require("express-hateoas-links");
const userRoutes = require("./routes/user");
const homeRoutes = require("./routes/home");

//Sobreescribe la función res.json con una función nueva que acepta un arreglo de links
app.use(hateoasLinks);

/**
 * Cargando rutas
 */
app.use("/", homeRoutes);
app.use("/users", userRoutes);

app.get("*", (req, res) => {
    res.status(404);
    res.json({
        name: "Error 404",
        data: {
            content: "Page not found",
            method: "get"
        }
    });

});

module.exports = app;