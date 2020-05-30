const express = require('express');
const router = express.Router();
const routeVersions = require("express-routes-versioning")();
const articlesController = require("../controllers/articlesController");
const methods = require("../middlewares/validMethods").validMethods;
const authorization = require("../middlewares/isAuthorized").isAuthorized;

/**
 * Cargando funciones para cada version
 */

// api/articles/
router.all("/", methods(["HEAD","GET","POST"]), authorization(["POST"]));

router.get("/", routeVersions({
    "1.0.0": articlesController.getArticles,
}));

router.post("/", routeVersions({
    "1.0.0": articlesController.createArticle,
}));



// api/articles/id
router.all('/:id', methods(["HEAD","GET","PUT","DELETE"]), authorization(["PUT", "DELETE"]));

router.get('/:id', routeVersions({
    "1.0.0": articlesController.getArticleByID,
}));

router.put('/:id', routeVersions({
    "1.0.0": articlesController.updateArticleByID,
}));

router.delete('/:id', routeVersions({
    "1.0.0": articlesController.deleteArticleByID,
}));

module.exports = router