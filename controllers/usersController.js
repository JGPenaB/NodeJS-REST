const userService = require("../services/userService");

const getUsers = (req, res, next) => {

    res.json({content: "Lista de usuarios"});
}


const getUserByID = (req, res, next) => {

    res.json({content: "Usuario "+req.params.id, id: req.params.id});
}


module.exports = { getUsers, getUserByID };