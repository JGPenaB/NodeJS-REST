const express = require('express');
const router = express.Router();
const routeVersions = require("express-routes-versioning")();
const userController = require("../controllers/usersController");
const methods = require("../middlewares/validMethods.js").validMethods;


/**
 * Cargando funciones para cada version
 */

// api/users/
router.all("/", methods(["GET","POST"]), routeVersions({
    "1.0.0": userController.getUsers,

}));

// api/users/id
router.all('/:id', methods(["GET","PUT","DELETE"]), routeVersions({
    "1.0.0": userController.getUserByID,

}));

module.exports = router