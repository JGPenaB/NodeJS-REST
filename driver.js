const express = require("express");
const app = express();
const hateoasLinks = require("express-hateoas-links");
const userRoutes = require("./routes/user");
const loginRoutes = require("./routes/login");
const homeRoutes = require("./routes/home");
const bodyParser = require("body-parser");

//Usando middleware para extraer el body del request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//Sobreescribe la función res.json con una función nueva que acepta un arreglo de links
app.use(hateoasLinks);

/**
 * Cargando rutas
 */
app.use("/", homeRoutes);
app.use("/login", loginRoutes);
app.use("/users", userRoutes);


/**
 * Si el recurso no existe, devuelve 404
 */
app.get("*", (req, res) => {
    res.status(404);
    res.header("Content-Type", "application/json");
    res.json({
        name: "Error 404",
        data: {
            content: "Page not found",
            method: "GET"
        }
    });
});

module.exports = app;