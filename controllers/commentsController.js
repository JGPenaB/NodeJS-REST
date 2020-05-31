const commentService = require("../services/commentService");
const serverConfig = require("../config/server.js");

const getComments = (req, res, next) => {

    commentService.listComments( (response) => {
        if(response && response[0] !== undefined){
            
            response.forEach(element => {
                element.dataValues.Links = [
                    {
                        rel: "self",
                        title: `Comment`,
                        href: `http://${serverConfig.host}:${serverConfig.port}/comments/${element.dataValues.id}`
                    },
                    {
                        rel: "Article",
                        title: `${element.dataValues.Article.Title}`,
                        href: `http://${serverConfig.host}:${serverConfig.port}/articles/${element.dataValues.Article.id}`
                    },
                    {
                        rel: "Author",
                        title: `${element.dataValues.User.firstName} ${element.dataValues.User.lastName}`,
                        href: `http://${serverConfig.host}:${serverConfig.port}/users/${element.dataValues.User.id}`
                    }
                ];
                
                delete element.dataValues.userID;
                delete element.dataValues.articleID;
            });
            

            res.status(200);
            res.header("Content-Type", "application/json");
            res.json({
                name: "Comments",
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
                title: "Comments not found",
                detail: "No comments could be found in the system",
                status: 404
            });
        }
    });
};


const getCommentByID = (req, res, next) => {

    commentService.getCommentByID( req.params.id, (response) => {
        if(response && response.dataValues !== undefined){

            response.dataValues.Links = [
                {
                    rel: "self",
                    title: `Comment`,
                    href: `http://${serverConfig.host}:${serverConfig.port}/comments/${response.dataValues.id}`
                },
                {
                    rel: "Article",
                    title: `${response.dataValues.Article.Title}`,
                    href: `http://${serverConfig.host}:${serverConfig.port}/articles/${response.dataValues.Article.id}`
                },
                {
                    rel: "Author",
                    title: `${response.dataValues.User.firstName} ${response.dataValues.User.lastName}`,
                    href: `http://${serverConfig.host}:${serverConfig.port}/users/${response.dataValues.User.id}`
                }
            ];

            delete response.dataValues.userID;
            delete response.dataValues.articleID;

            res.status(200);
            res.header("Content-Type", "application/json");
            res.json({
                name: "Comment",
                data: JSON.parse(JSON.stringify(response, null, 4))
            });
        }else if(response !== null){
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
                title: "Comment not found",
                detail: "The requested comment could not be found",
                status: 404
            });
        }
    });
};


const createComment = (req, res, next) => {

    let commentData = {
        userID: req.tokenData.id,
        articleID: req.body.article,
        Content: req.body.content
    };

    commentService.createComment( commentData, (response) => {
        if(response && response.dataValues !== undefined){

            response.dataValues.Links = [
                {
                    rel: "self",
                    title: `Comment`,
                    href: `http://${serverConfig.host}:${serverConfig.port}/comments/${response.dataValues.id}`
                },
                {
                    rel: "Article",
                    title: `${response.dataValues.Article.Title}`,
                    href: `http://${serverConfig.host}:${serverConfig.port}/articles/${response.dataValues.Article.id}`
                },
                {
                    rel: "Author",
                    title: `${response.dataValues.User.firstName} ${response.dataValues.User.lastName}`,
                    href: `http://${serverConfig.host}:${serverConfig.port}/users/${response.dataValues.User.id}`
                }
            ];

            delete response.dataValues.userID;
            delete response.dataValues.articleID;

            res.status(201);
            res.header("Content-Type", "application/json");
            res.json({
                name: "Comment",
                data: JSON.parse(JSON.stringify(response, null, 4))
            });
        }else if(response !== null){
            res.status(500);
            res.header("Content-Type", "application/problem+json");
            res.json({
                title: "Internal Server Error",
                detail: "An error has ocurred while processing the request",
                status: 500
            });
        }
    });
};


const updateCommentByID = (req, res, next) => {

    commentService.getCommentByID(req.params.id, (response) => {
        
        if(response !== null && response.dataValues !== undefined){
            
            //Si un usuario trata de modificar un comentario que no es suyo
            if(response.dataValues.userID !== req.tokenData.id){
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

        commentService.updateComment(req.params.id, req.body.content, (response) => {
            if(response !== null){
    
                res.status(200);
                res.header("Content-Type", "application/json");
                res.json({
                    name: "Comment",
                    data: JSON.parse(JSON.stringify(response, null, 4))
                });
    
            }else if(response === null){
                res.status(404);
                res.header("Content-Type", "application/problem+json");
                res.json({
                    title: "Comment not found",
                    detail: "The requested comment could not be found",
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


const deleteCommentByID = (req, res, next) => {

    commentService.getCommentByID(req.params.id, (response) => {
        
        if(response !== null && response.dataValues !== undefined){
            
            //Si un usuario trata de eliminar un comentario que no es suyo
            if(response.dataValues.userID !== req.tokenData.id){
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

        commentService.deleteComment(req.params.id, (response) => {
            if(response !== null){
    
                res.status(200);
                res.header("Content-Type", "application/json");
                res.json({
                    name: "Comment",
                    data: JSON.parse(JSON.stringify(response, null, 4))
                });
    
            }else if(response === null){
                res.status(404);
                res.header("Content-Type", "application/problem+json");
                res.json({
                    title: "Comment not found",
                    detail: "The requested comment could not be found",
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



module.exports = { getComments, getCommentByID, createComment, deleteCommentByID, updateCommentByID };