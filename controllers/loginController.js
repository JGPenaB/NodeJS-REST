const userService = require("../services/userService");
const serverConfig = require("../config/server.js");
const secretKey = require("../config/jwt");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Login = (req, res, next) => {

    userService.getUserByEmail(req.body.email, (response) => {

        if(response.dataValues !== undefined){
            let userData = response.dataValues;

            bcrypt.compare(req.body.password, userData.password, (err, result) => {
                if(result){
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
                        detail: "The credentials are invalid",
                        status: 401
                    });
                }
            });
            
        }else{
            res.status(401);
            res.header("Content-Type", "application/problem+json");
            res.json({
                title: "Login failed",
                detail: "The provided email does not exists",
                status: 401
            });
        }
        
    });
}

module.exports = { Login };