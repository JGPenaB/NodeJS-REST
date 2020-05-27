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
            res.status(401);
            res.header("Content-Type", "application/problem+json");
            res.json({
                title: "Login failed",
                detail: "The provided email is not in use.",
                status: 401
            });
        }
        
    });
}

module.exports = { Login };