const tagService = require("../services/tagService");
const serverConfig = require("../config/server.js");

const getTags = (req, res, next) => {

    tagService.listTags((response) => {
        if(response && response[0] !== undefined){

                /*
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
            */

            res.status(200);
            res.header("Content-Type", "application/json");
            res.json({
                name: "Tags",
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
                title: "Tags not found",
                detail: "No tags could be found in the system",
                status: 404
            });
        }
    });
}



const createTag = (req, res, next) => {

    tagService.createTag(req.body.articleID, req.body.tagName, (response) => {
        if(response && response.dataValues !== undefined){

            res.status(200);
            res.header("Content-Type", "application/json");
            res.json({
                name: "Tags",
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
        }
    });
}

module.exports = { getTags, createTag };