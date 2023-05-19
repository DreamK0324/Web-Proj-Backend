// register models, set up associations between tables, 
// and generate barrel file for the models;

const Employee = require("./Employee");
const Task = require("./Task");

Task.belongsTo(Employee);
Employee.hasMany(Task);

module.exports = {
  Employee,
  Task,
};