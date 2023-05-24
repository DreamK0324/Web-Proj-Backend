const { Sequelize, Model, DataTypes } = require('sequelize');
const express = require("express");
const app = express();
const cors = require("cors");


// middleware
app.use( cors() );
app.use( express.json() );

// specific routes
const sequelize = new Sequelize('d25c0l5l7t7n59', 'jihqumowedxuin', 'beeefa2bddc9eda2b7ebb00417458ee5d5d19967bc4f5722fd0b8f8534c398ac', {
    host: 'ec2-34-236-103-63.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Set this to true on production
      }
    }
  });

sequelize.authenticate()
  .then(() => {
    console.log('Successfully established connection.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

// Defining the "Employee" model
const Employee = sequelize.define('Employee', {
    employee_first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    employee_last_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    department_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});


// Defining the "Task" model
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

// Creating a employee
app.post('/employees', async (req, res) => {
    try {
        const { employee_first_name, employee_last_name, department_name } = req.body;

        // Creating a new employee
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

// Creating a task 
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


// Getting all employees //http://localhost:4000/employees
app.get("/employees", async (req, res) => {
    try {
        const allEmployees = await Employee.findAll();
        res.json(allEmployees);
    } catch (err) {
        console.error(err.message);
    }
});


// Getting all tasks // http://localhost:4000/tasks
app.get("/tasks", async (req, res) => {
    try {
        const allTasks = await Task.findAll();
        res.json(allTasks);
    } catch (err) {
        console.error(err.message);
    }
});

// Getting employee by id // http://localhost:4000/employees/1
app.get("/employees/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const oneEmployee = await Employee.findByPk(id);
        res.json(oneEmployee);
    } catch (err) {
        console.error(err.message);
    }
});

// Getting task by id // http://localhost:4000/tasks/2
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


// Editing employee by id // http://localhost:4000/employees/
app.put("/employees/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { employee_first_name, employee_last_name, department_name } = req.body;

        // Find the employee by ID
        const employee = await Employee.findByPk(id);

        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        // Updating the employee's properties
        employee.employee_first_name = employee_first_name;
        employee.employee_last_name = employee_last_name;
        employee.department_name = department_name;

        // Saving the updated employee
        await employee.save();

        res.json("Employee was updated!");
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});


// Editing a task
app.put('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { assigned_to, description, priority_level, completion_status } = req.body;

        // Finding the task by ID
        const task = await Task.findByPk(id);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Updating the task's properties
        task.assigned_to = assigned_to;
        task.description = description;
        task.priority_level = priority_level;
        task.completion_status = completion_status;

        // Saving the updated task
        await task.save();

        res.json('Task was updated!');
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});




// Deleting a employee
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

// Deleting a task
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

// Listening to the server
sequelize.sync().then(() => {
    const port = process.env.PORT || 4006;
    app.listen(port, () => {
      console.log(`Server has started on port ${port}`);
    });
  });
  