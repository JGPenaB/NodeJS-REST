const userService = require("../services/userService");
const serverConfig = require("../config/server.js");
const secretKey = require("../config/jwt");
const jwt = require('jsonwebtoken');

const Login = (req, res, next) => {

    userService.getUserByEmail(req.body.email, (response) => {
        if(response !== null){
            let userData = response[0].dataValues;
            res.status(200);
            res.header("Content-Type", "application/json");
            res.json({
                name: "Login",
                data: {
                    content: "Logged in successfully",
                    token: jwt.sign({id: userData.id},secretKey)
                }
            });
        }else{
            res.status(404);
            res.json({});
        }
        
    });
}

module.exports = { Login };