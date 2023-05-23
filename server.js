// Import database setup utils
const createDB = require('./database/utils/createDB');
const seedDB = require('./database/utils/seedDB');

// Import Sequelize instance
const db = require('./database');

// Sync and seed the database
const syncDatabase = async () => {
  try {
    await db.sync({ force: true });
    console.log('------ Synced to db ------');
    await seedDB();
    console.log('------ Successfully seeded db ------');
  } catch (err) {
    console.error('syncDB error:', err);
  }
};

// Import express library
const express = require('express');

// Create express server
const app = express();

// Express router: Import routes
const apiRouter = require('./routes');

// Initialize express server
const cors = require('cors');

// Handle request data
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Ignore browser requests for favicon file
app.get('/favicon.ico', (req, res) => res.status(204));

// Define a route
app.get('/hello', (request, response) => {
  response.send('hello world!');
});

// Mount apiRouter
app.use('/api', apiRouter);

// Handle page not found
app.use((req, res, next) => {
  const error = new Error('Not Found, Please Check URL!');
  error.status = 404;
  next(error);
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  console.log(req.originalUrl);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});

const bootApp = async () => {
  // Create local database if it doesn't exist
  await createDB();

  // Call syncDatabase to create tables and seed data
  await syncDatabase();

  // Start the server
  const PORT = 5001;
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
};

// Program starts here
bootApp();
