const express = require('express')
const routeVersions = require("express-routes-versioning")();
const userController = require("../controllers/usersController")
const router = express.Router()

/**
 * Cargando funciones para cada version
 */
// api/users/
router.get("/", routeVersions({
    "1.0.0": userController.getUsers,

}));

// api/users/id
router.get('/:id', routeVersions({
    "1.0.0": userController.getUserByID,

}));

module.exports = router