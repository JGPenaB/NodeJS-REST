const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const seqConfig = require("../config/sequelize.js")[env];

const sequelize = new Sequelize(
    seqConfig.database, 
    seqConfig.username,
    seqConfig.password, 
    seqConfig
);
const users = sequelize.import("../models/user");

const listUsers = (call) => {

    users.findAll({
        attributes: ["id","firstName","lastName"]
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

module.exports = { listUsers, getUserByID };