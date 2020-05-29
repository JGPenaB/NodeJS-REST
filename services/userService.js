const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const seqConfig = require("../config/sequelize.js")[env];
const bcrypt = require("bcrypt");

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
        console.log(error.message);
        return call(error.message);
    });
};


const getUserByID = (userID, call) => {

    users.findByPk(userID)
    .then( (userFound) => {
        return call(userFound);
    })
    .catch( (error) => {
        console.log(error.message);
        return call(error.message);
    });
};

const getUserByEmail = (userEmail, call) => {
    users.findAll({
        limit: 1,
        attributes: ["id", "email", "password"],
        where: {
            email: userEmail
        },
        returning: true,
        plain: true
    })
    .then( (userFound) => {
        return call(userFound);
    })
    .catch( (error) => {
        console.log(error.message);
        return call(error.message);
    });
};

const createUser = (userData, call) => {

    bcrypt.hash(userData.password, 10, function(err, hash) {
        users.create({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: hash
        })
        .then( (newUser) => {
           return call(newUser);
        })
        .catch( (error) => {
            console.log(error.message);
            return call(error.message);
        });
    });
};

const deleteUser = (userID, call) => {

    getUserByID(userID, (response) => {

        //En caso que el usuario no haya sido localizado
        if(response.dataValues === undefined){
            return call({
                status: 404
            });
        }

        users.destroy({
            where: {
                id: userID
            },
            returning: true,
            plain: true
        })
        .then( (deleteResponse) => {
            return call({
                id: response.dataValues.id,
                firstName: response.dataValues.firstName,
                lastName: response.dataValues.lastName,
                email: response.dataValues.email,
            });
        })
        .catch( (error) => {
            console.log(error.message);
            return call({
                status: 500
            });
        });
    });
};

const updateUser = (userID, userData, call) => {

    users.update({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password
    },{
        where: {
            id: userID
        },
        returning: true,
        plain: true
    })
    .then( (response) => {
        let data = response[1].dataValues;

        return call({
            id: data.id,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
        });
    })
    .catch( (error) => {
        console.log(error.message);
        return call(error.message);
    });
};

module.exports = { listUsers, getUserByID, getUserByEmail, createUser, updateUser, deleteUser };