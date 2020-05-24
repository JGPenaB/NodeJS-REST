const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config.js")[env];

const sequelize = new Sequelize(
    config.database, 
    config.username,
    config.password, 
    config
);
const users = sequelize.import("../models/user");