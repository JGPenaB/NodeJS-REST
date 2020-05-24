const express = require("express");
const app = express();
const userRoutes = require("./routes/user");
const homeRoutes = require("./routes/home");

/**
 * Cargando rutas
 */
app.use("/", homeRoutes);
app.use("/users", userRoutes);

app.get("*", (req, res) => {
    res.status(404);
    
    res.json({
        data: {
            content: "Page not found",
            method: "get"
        }
    });

});

module.exports = app;