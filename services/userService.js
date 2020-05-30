const bcrypt = require("bcrypt");
const models = require("../database/models");

const listUsers = (call) => {

    models.User.findAll({
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

    models.User.findByPk(userID)
    .then( (userFound) => {
        return call(userFound);
    })
    .catch( (error) => {
        console.log(error.message);
        return call(error.message);
    });
};

const getUserByEmail = (userEmail, call) => {
    models.User.findAll({
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
        models.User.create({
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
            return call(null);
        }

        models.User.destroy({
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
            return call(error);
        });
    });
};

const updateUser = (userID, userData, call) => {

    getUserByID(userID, (response) => {
        if(response === null){
            return call(null);
        }

        models.User.update({
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
            return call(error);
        });
    })

};

module.exports = { listUsers, getUserByID, getUserByEmail, createUser, updateUser, deleteUser };