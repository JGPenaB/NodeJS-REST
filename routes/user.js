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
router.post("/", routeVersions({
    "1.0.0": userController.createUser,
}));


// api/users/id
router.all('/:id', methods(["HEAD","GET","PUT","DELETE"]), authorization(["PUT", "DELETE"]));

router.get('/:id', routeVersions({
    "1.0.0": userController.getUserByID,
}));
router.put('/:id', routeVersions({
    "1.0.0": userController.updateUserByID,
}));
router.delete('/:id', routeVersions({
    "1.0.0": userController.deleteUserByID,
}));

module.exports = router