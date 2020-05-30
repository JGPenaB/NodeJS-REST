const articleService = require("../services/articleService");
const serverConfig = require("../config/server.js");

const getArticles = (req, res, next) => {

    articleService.listArticles( (response) => {
        if(response && response[0] !== undefined){

            response.forEach(element => {
                element.dataValues.Links = [
                    {
                        rel: "self",
                        title: `${element.dataValues.Title}`,
                        href: `http://${serverConfig.host}:${serverConfig.port}/articles/${element.dataValues.id}`
                    },
                    {
                        rel: "Author",
                        title: `${element.dataValues.authorData.firstName} ${element.dataValues.authorData.lastName}`,
                        href: `http://${serverConfig.host}:${serverConfig.port}/users/${element.dataValues.Author}`
                    }
                ];
                delete element.dataValues.Author;
            });

            res.status(200);
            res.header("Content-Type", "application/json");
            res.json({
                name: "Articles",
                data: JSON.parse(JSON.stringify(response, null, 4))
            });
        }else if(response.message !== undefined){
            res.status(500);
            res.header("Content-Type", "application/problem+json");
            res.json({
                title: "Internal Server Error",
                detail: "An error has ocurred while processing the request",
                status: 500
            });
        }else{
            res.status(404);
            res.header("Content-Type", "application/problem+json");
            res.json({
                title: "Articles not found",
                detail: "No articles could be found in the system",
                status: 404
            });
        }
        
    });
}

const getArticleByID = (req, res, next) => {

    articleService.getArticleByID(req.params.id, (response) => {

        if(response !== null && response.dataValues !== undefined){
            let links = [];

            links.push({
                rel: "self",
                title: `${response.dataValues.Title}`,
                href: `http://${serverConfig.host}:${serverConfig.port}/articles/${response.dataValues.id}`
            },
            {
                rel: "Author",
                title: `${response.dataValues.authorData.firstName} ${response.dataValues.authorData.lastName}`,
                href: `http://${serverConfig.host}:${serverConfig.port}/users/${response.dataValues.Author}`
            });
            
            delete response.dataValues.Author;

            res.status(200);
            res.header("Content-Type", "application/json");
            res.json({
                name: "Article",
                data: JSON.parse(JSON.stringify(response, null, 4))
            }, links);
        }else if(response === null){
            res.status(404);
            res.header("Content-Type", "application/problem+json");
            res.json({
                title: "Article not found",
                detail: "The requested article could not be found",
                status: 404
            });
        }else{
            res.status(500);
            res.header("Content-Type", "application/problem+json");
            res.json({
                title: "Internal Server Error",
                detail: "An error has ocurred while processing the request",
                status: 500
            });
        }
    });
}

const createArticle = (req, res, next) => {

    let articleData = {
        Title: req.body.title,
        Slug: req.body.slug,
        Content: req.body.content,
        Author: req.tokenData.id,
    };

    articleService.createArticle(articleData, (response) => {
        if(response !== null && response.dataValues !== undefined){
            let links = [];

            links.push({
                rel: "self",
                title: `${response.dataValues.Title}`,
                href: `http://${serverConfig.host}:${serverConfig.port}/articles/${response.dataValues.id}`
            },
            {
                rel: "Author",
                title: `${response.dataValues.authorData.firstName} ${response.dataValues.authorData.lastName}`,
                href: `http://${serverConfig.host}:${serverConfig.port}/users/${response.dataValues.Author}`
            });
            
            delete response.dataValues.Author;

            res.status(201);
            res.header("Content-Type", "application/json");
            res.json({
                name: "Article",
                data: JSON.parse(JSON.stringify(response, null, 4))
            }, links);
        }else{
            res.status(500);
            res.header("Content-Type", "application/problem+json");
            res.json({
                title: "Internal Server Error",
                detail: "An error has ocurred while processing the request",
                status: 500
            });
        }
    });
}


const updateArticleByID = (req, res, next) => {

    let articleData = {
        Title: req.body.title,
        Slug: req.body.slug,
        Content: req.body.content,
        Author: req.tokenData.id,
    };

    articleService.getArticleByID(req.params.id, (response) => {
        if(response !== null && response.dataValues !== undefined){

            //Si un usuario trata de editar un artículo que no es suyo
            if(response.dataValues.Author !== articleData.Author){
                res.status(403);
                res.header("Content-Type", "application/problem+json");
                res.json({
                    title: "Forbidden",
                    detail: "You are not allowed to perform this action",
                    status: 403
                });
                return;
            }
        }

        articleService.updateArticle(req.params.id, articleData, (response) => {
            if(response !== null){
    
                getArticleByID(req,res,next);
    
            }else if(response === null){
                res.status(404);
                res.header("Content-Type", "application/problem+json");
                res.json({
                    title: "Article not found",
                    detail: "The requested article could not be found",
                    status: 404
                });
            }else{
                res.status(500);
                res.header("Content-Type", "application/problem+json");
                res.json({
                    title: "Internal Server Error",
                    detail: "An error has ocurred while processing the request",
                    status: 500
                });
            }
        });
    });

}


const deleteArticleByID = (req, res, next) => {

    articleService.getArticleByID(req.params.id, (response) => {
        
        if(response !== null && response.dataValues !== undefined){
            
            //Si un usuario trata de eliminar un artículo que no es suyo
            if(response.dataValues.Author !== req.tokenData.id){
                res.status(403);
                res.header("Content-Type", "application/problem+json");
                res.json({
                    title: "Forbidden",
                    detail: "You are not allowed to perform this action",
                    status: 403
                });
                return;
            }
        }

        articleService.deleteArticle(req.params.id, (response) => {
            if(response !== null){
    
                res.status(200);
                res.header("Content-Type", "application/json");
                res.json({
                    name: "Article",
                    data: JSON.parse(JSON.stringify(response, null, 4))
                });
    
            }else if(response === null){
                res.status(404);
                res.header("Content-Type", "application/problem+json");
                res.json({
                    title: "Article not found",
                    detail: "The requested article could not be found",
                    status: 404
                });
            }else{
                res.status(500);
                res.header("Content-Type", "application/problem+json");
                res.json({
                    title: "Internal Server Error",
                    detail: "An error has ocurred while processing the request",
                    status: 500
                });
            }
        });
    });

}

module.exports = { getArticles, createArticle, getArticleByID, updateArticleByID, deleteArticleByID };