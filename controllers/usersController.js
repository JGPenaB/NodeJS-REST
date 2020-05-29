const userService = require("../services/userService");
const serverConfig = require("../config/server.js");

const getUsers = (req, res, next) => {

    userService.listUsers( (response) => {
        if(response && response.length){

            //Prepara links para los recursos
            let links = [];

            response.forEach(element => {
                links.push({
                    title: `${element.dataValues.firstName} ${element.dataValues.lastName}`,
                    href: `http://${serverConfig.host}:${serverConfig.port}/users/${element.dataValues.id}`
                });
            });

            res.status(200);
            res.header("Content-Type", "application/json");
            res.json({
                name: "Users",
                data: JSON.parse(JSON.stringify(response, null, 4))
            }, links);
        }else{
            res.status(404);
            res.header("Content-Type", "application/problem+json");
            res.json({
                title: "Users not found",
                detail: "No users could be found in the system",
                status: 404
            });
        }
        
    });
}

const createUser = (req, res, next) => {

    let links = [];

    //Objeto con los datos del usuario nuevo
    let userData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password.toString(),
    };

    //Verifica si el usuario ya existe
    userService.getUserByEmail(req.body.email, (response) => {
        
        if(response && response.length){
            res.status(409);
            res.header("Content-Type", "application/problem+json");
            res.json({
                title: "User creation failed",
                detail: "The email already exists in the database",
                status: 409
            });
            return;
        }

        //Sino, crea un objeto con los datos del usuario
        userService.createUser(userData, (createResponse) => {
            if(createResponse.dataValues === undefined){
                res.status(409);
                res.header("Content-Type", "application/problem+json");
                res.json({
                    title: "User creation failed",
                    detail: createResponse,
                    status: 409
                });
                return;
            }
            
            links.push({
                rel: "self",
                href: `http://${serverConfig.host}:${serverConfig.port}/users/${createResponse.dataValues.id}`
            });

            res.status(201);
            res.header("Content-Type", "application/json");
            res.json({
                name: "User",
                data: {
                    id: createResponse.dataValues.id,
                    firstName: createResponse.dataValues.firstName,
                    lastName: createResponse.dataValues.lastName,
                    email: createResponse.dataValues.email
                }
            }, links);
        }); 
    });
}


const getUserByID = (req, res, next) => {

    userService.getUserByID(req.params.id, (response) => {
        if(response !== null){
            let links = [];

            links.push({
                rel: "self",
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
            res.header("Content-Type", "application/problem+json");
            res.json({
                title: "User not found",
                detail: "The requested user could not be located",
                status: 404
            });
        }
    });
}

const deleteUserByID = (req, res, next) => {

    //Si el cliente quiere eliminar a un usuario distinto al suyo
    if(req.tokenData.id !== parseInt(req.params.id)){
        res.status(403);
        res.header("Content-Type", "application/problem+json");
        res.json({
            title: "Forbidden",
            detail: "You are not allowed to perform this action",
            status: 403
        });
        return;
    }

    userService.deleteUser(req.params.id, (response) => {
        if(response.id !== undefined){
            res.status(200);
            res.header("Content-Type", "application/json");
            res.json({
                name: "User",
                data: JSON.parse(JSON.stringify(response, null, 4))
            });
        }else{
            switch(response.status){
                case 500:
                    res.status(500);
                    res.header("Content-Type", "application/problem+json");
                    res.json({
                        title: "Internal Server Error",
                        detail: "An error has occurred while processing the request",
                        status: 500
                    });
                break;

                case 404:
                    res.status(404);
                    res.header("Content-Type", "application/problem+json");
                    res.json({
                        title: "User not found",
                        detail: "The requested user could not be located",
                        status: 404
                    });
                break;
            }
        }
    });
}

const updateUserByID = (req, res, next) => {

    //Si el cliente quiere actualizar a un usuario distinto al suyo
    if(req.tokenData.id !== parseInt(req.params.id)){
        res.status(403);
        res.header("Content-Type", "application/problem+json");
        res.json({
            title: "Forbidden",
            detail: "You are not allowed to perform this action",
            status: 403
        });
        return;
    }

    let links = [];
    

    //Objeto con los datos actualizados
    let userData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password.toString(),
    };

    //Verifica si el email ya existe para otro usuario
    userService.getUserByEmail(req.body.email, (emailRes) => {
        if(emailRes !== null){
            if(req.params.id !== emailRes.dataValues.id && req.body.email === emailRes.dataValues.email){
                res.status(409);
                res.header("Content-Type", "application/problem+json");
                res.json({
                    title: "Update failed",
                    detail: "The email already exists in the database",
                    status: 409
                });
                return;
            }
        }

        //Todo bien, actualiza
        userService.updateUser(req.params.id, userData, (response) => {

            if(response.id !== undefined){
                links.push({
                    rel: "self",
                    href: `http://${serverConfig.host}:${serverConfig.port}/users/${response.id}`
                });

                res.status(200);
                res.header("Content-Type", "application/json");
                res.json({
                    name: "User",
                    data: JSON.parse(JSON.stringify(response, null, 4))
                }, links);
            }else{
                res.status(500);
                res.header("Content-Type", "application/problem+json");
                res.json({
                    title: "Internal Server Error",
                    detail: "An error has occurred while processing the request",
                    status: 500
                });
            }
        });
    });
}


module.exports = { getUsers, createUser, getUserByID, updateUserByID, deleteUserByID };