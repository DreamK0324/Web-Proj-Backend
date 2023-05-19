// Instantiate database

// Module dependencies;
const Sequelize = require("sequelize");
const { dbName, dbUser, dbPwd } = require("./utils/configDB");

// Confirmation message (limit these in production);
console.log("Opening database connection");

// This is our entry point, we instantiate the Sequelize instance accordingly;
const db = new Sequelize(dbName, dbUser, dbPwd, {
  host: "containers-us-west-45.railway.app",
  dialect: "postgres",
  port: 5776,
});
// Export our instance of Sequelize, which will be modified with models;
module.exports = db;