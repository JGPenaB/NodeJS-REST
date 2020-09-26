const express = require('express');
const router = express.Router();
const routeVersions = require("express-routes-versioning")();
const tagsController = require("../controllers/tagsController");
const methods = require("../middlewares/validMethods").validMethods;
const authorization = require("../middlewares/isAuthorized").isAuthorized;

/**
 * Cargando funciones para cada version
 */

// api/tags/
router.all("/", methods(["HEAD","GET","POST"]), authorization(["POST"]));

router.get("/", routeVersions({
    "1.0.0": tagsController.getTags,
}));

router.post("/", routeVersions({
    "1.0.0": tagsController.createTag,
}));



/*
// api/tags/id
router.all('/:id', methods(["HEAD","GET","PUT","DELETE"]), authorization(["PUT", "DELETE"]));

router.get('/:id', routeVersions({
    "1.0.0": commentsController.getCommentByID,
}));

router.put('/:id', routeVersions({
    "1.0.0": commentsController.updateCommentByID,
}));

router.delete('/:id', routeVersions({
    "1.0.0": commentsController.deleteCommentByID,
}));
*/

module.exports = router