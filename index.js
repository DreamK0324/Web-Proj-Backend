const { Sequelize, Model, DataTypes } = require('sequelize');
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Define the Sequelize configuration and authenticate the connection
const sequelize = new Sequelize('d512eqqtg7m8s', 'triiucjshnbpmf', '0132557da8f583041f643af42be31c9b054f6f6ff5de4150aa4f1269cb415b03', {
  host: 'ec2-52-205-171-232.compute-1.amazonaws.com',
  dialect: 'postgres',
  port: 5432,
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // You may need to set this to true on production
    }
  }
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

// Define the "Employee" model
const Employee = sequelize.define('Employee', {
  employee_first_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  employee_last_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  department_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Define the "Task" model
class Task extends Model { }
Task.init({
  assigned_to: {
    type: DataTypes.INTEGER,
    references: {
      model: Employee,
      key: 'id'
    }
  },
  description: DataTypes.STRING,
  priority_level: DataTypes.INTEGER,
  completion_status: DataTypes.BOOLEAN
}, { sequelize, modelName: 'Task' });

// Create a new employee
app.post('/employees', async (req, res) => {
  try {
    const { employee_first_name, employee_last_name, department_name } = req.body;
    const newEmployee = await Employee.create({
      employee_first_name,
      employee_last_name,
      department_name,
    });
    res.json(newEmployee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create a new task
app.post("/tasks", async (req, res) => {
  try {
    const { assigned_to, description, priority_level, completion_status } = req.body;
    const newTask = await Task.create({
      assigned_to,
      description,
      priority_level,
      completion_status
    });
    res.json(newTask);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// Get all employees
app.get("/employees", async (req, res) => {
  try {
    const allEmployees = await Employee.findAll();
    res.json(allEmployees);
  } catch (err) {
    console.error(err.message);
  }
});

// Get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const allTasks = await Task.findAll();
    res.json(allTasks);
  } catch (err) {
    console.error(err.message);
  }
});

// Get employee by ID
app.get("/employees/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const oneEmployee = await Employee.findByPk(id);
    res.json(oneEmployee);
  } catch (err) {
    console.error(err.message);
  }
});

// Get task by ID
app.get("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Update employee by ID
app.put("/employees/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { employee_first_name, employee_last_name, department_name } = req.body;
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    employee.employee_first_name = employee_first_name;
    employee.employee_last_name = employee_last_name;
    employee.department_name = department_name;
    await employee.save();
    res.json("Employee was updated!");
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Update task by ID
app.put('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { assigned_to, description, priority_level, completion_status } = req.body;
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    task.assigned_to = assigned_to;
    task.description = description;
    task.priority_level = priority_level;
    task.completion_status = completion_status;
    await task.save();
    res.json('Task was updated!');
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete an employee
app.delete('/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    await employee.destroy();
    res.json('Employee was deleted!');
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a task
app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    await task.destroy();
    res.json('Task was deleted!');
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start the server
sequelize.sync().then(() => {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Server has started on port ${port}`);
  });
});
