const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const seqConfig = require("../config/sequelize.js")[env];

const sequelize = new Sequelize(
    seqConfig.database, 
    seqConfig.username,
    seqConfig.password, 
    seqConfig
);

const users = sequelize.import("../database/models/user");

const listUsers = (call) => {

    users.findAll({
        attributes: ["id","firstName","lastName", "email"]
    })
    .then( (list) => {
        return call(list);
    })
    .catch( (error) => {
        console.log("Error: "+error);
    });
};


const getUserByID = (userID, call) => {

    users.findByPk(userID)
    .then( (userFound) => {
        return call(userFound);
    })
    .catch( (error) => {
        console.log("Error: " + error);
    });

};


const getUserByEmail = (userEmail, call) => {

    console.log(userEmail);
    users.findAll({
        limit: 1,
        attributes: ["id", "email", "password"],
        where: {
            email: userEmail
        }
    })
    .then( (userFound) => {
        return call(userFound);
    })
    .catch( (error) => {
        console.log("Error: " + error);
    });

};

module.exports = { listUsers, getUserByID, getUserByEmail };