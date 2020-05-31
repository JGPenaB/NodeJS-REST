const express = require("express");
const app = express();
const hateoasLinks = require("express-hateoas-links");
const articleRoutes = require("./routes/article");
const commentRoutes = require("./routes/comment");
const userRoutes = require("./routes/user");
const loginRoutes = require("./routes/login");
const homeRoutes = require("./routes/home");
const bodyParser = require("body-parser");

//Usando middleware para extraer el cuerpo de la petición
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Sobreescribe la función res.json() con una función nueva que acepta un arreglo de links
app.use(hateoasLinks);

/**
 * Cargando rutas
 */
app.use("/", homeRoutes);
app.use("/login", loginRoutes);
app.use("/users", userRoutes);
app.use("/articles", articleRoutes);
app.use("/comments", commentRoutes);


/**
 * Si el recurso no existe, devuelve 404
 */
app.get("*", (req, res) => {
    res.status(404);
    res.header("Content-Type", "application/problem+json");
    res.json({
        title: "Resource not found",
        detail: "The requested resource could not be found",
        status: 404
    });
});

module.exports = app;