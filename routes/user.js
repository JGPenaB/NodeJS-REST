const express = require('express');
const router = express.Router();
const routeVersions = require("express-routes-versioning")();
const userController = require("../controllers/usersController");
const methods = require("../middlewares/validMethods").validMethods;
const authorization = require("../middlewares/isAuthorized").isAuthorized;


/**
 * Cargando funciones para cada version
 */

// api/users/

//Verifica si el cliente usó un método válido
router.all("/", methods(["HEAD","GET","POST"]));

//Si todo está en orden, ejecuta una función dependiendo del método
router.get("/", routeVersions({
    "1.0.0": userController.getUsers,

}));

// api/users/id
//Verifica si el cliente está autorizado a ejecutar un método
router.all('/:id', methods(["HEAD","GET","PUT","DELETE"]), authorization(["GET"]));

router.get('/:id', routeVersions({
    "1.0.0": userController.getUserByID,

}));

module.exports = router