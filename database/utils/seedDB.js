const { Employee, Task } = require("../models");

const seedDB = async () => {
  const dummyEmployee = await Employee.create({
    firstname: "Melissa",
    lastname: "Lynch",
    department: "Computer Science",
  });
  const dummyEmployee2 = await Employee.create({
    firstname: "Walter",
    lastname: "White",
  });

  const dummyTask = await Task.create({
    description: "Paperwork",
    priority: "Low",
  });


  const dummyTask2 = await Task.create({
    description: "Answer emails",
    priority: "Medium",
    isComplete: "false",
  });

  await dummyTask.setEmployee(dummyEmployee);
  await dummyTask2.setEmployee(dummyEmployee2);
};

module.exports = seedDB;