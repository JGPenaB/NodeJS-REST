const userService = require("../services/userService");
const serverConfig = require("../config/server.js");

const getUsers = (req, res, next) => {

    userService.listUsers( (response) => {
        if(response !== null){

            //Prepara links para los recursos
            let links = [];

            response.forEach(element => {
                links.push({
                    rel: "get",
                    method: "GET",
                    title: `Get user ${element.dataValues.id}`,
                    href: `http://${serverConfig.host}:${serverConfig.port}/users/${element.dataValues.id}`
                });
                //element.dataValues.href = `http://${serverConfig.host}:${serverConfig.port}/users/${element.dataValues.id}`;
            });

            res.status(200);
            res.header("Content-Type", "application/json");
            res.json({
                name: "Users",
                data: JSON.parse(JSON.stringify(response, null, 4))
            }, links);
        }else{
            res.status(404);
            res.json({});
        }
        
    });
    //res.json({content: "Lista de usuarios"});
}


const getUserByID = (req, res, next) => {

    userService.getUserByID(req.params.id, (response) => {
        if(response !== null){
            let links = [];

            links.push({
                rel: "self",
                method: "GET",
                href: `http://${serverConfig.host}:${serverConfig.port}/users/${response.dataValues.id}`
            });

            links.push({
                rel: "update",
                method: "PUT",
                href: `http://${serverConfig.host}:${serverConfig.port}/users/${response.dataValues.id}`
            });

            links.push({
                rel: "delete",
                method: "DELETE",
                href: `http://${serverConfig.host}:${serverConfig.port}/users/${response.dataValues.id}`
            });

            res.status(200);
            res.header("Content-Type", "application/json");
            res.json({
                name: "User",
                data: JSON.parse(JSON.stringify(response, null, 4))
            }, links);
        }else{
            res.status(404);
            res.json({});
        }
    });

    //res.json({content: "Usuario "+req.params.id, id: req.params.id});
}


module.exports = { getUsers, getUserByID };