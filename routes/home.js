var express = require('express');
const routeVersions = require("express-routes-versioning")();
var router = express.Router();

/**
 * Cargando servicios
 */
router.get("/", routeVersions({
    "1.0.0": (req, res, next) => {
        res.json({content: "Index v1"});
    },

    //"2.0.0": userHomeV2,
}));

module.exports = router