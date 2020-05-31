const express = require('express');
const router = express.Router();
const routeVersions = require("express-routes-versioning")();
const commentsController = require("../controllers/commentsController");
const methods = require("../middlewares/validMethods").validMethods;
const authorization = require("../middlewares/isAuthorized").isAuthorized;

/**
 * Cargando funciones para cada version
 */

// api/comments/
router.all("/", methods(["HEAD","GET","POST"]), authorization(["POST"]));

router.get("/", routeVersions({
    "1.0.0": commentsController.getComments,
}));

router.post("/", routeVersions({
    "1.0.0": commentsController.createComment,
}));



// api/comments/id
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

module.exports = router