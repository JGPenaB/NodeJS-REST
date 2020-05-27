var express = require('express');
var router = express.Router();
const routeVersions = require("express-routes-versioning")();
const methods = require("../middlewares/validMethods.js").validMethods;
const loginController = require("../controllers/loginController");

/**
 * Cargando servicios
 */
router.all("/", methods(["POST"]), routeVersions({
    "1.0.0": loginController.Login,

}));

module.exports = router