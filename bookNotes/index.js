const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');
const app = express();
const port = 3000;

const db = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'notes',
  password: 'root',
  port: 5432,
});

// Async function to connect to the database
const connectDB = async () => {
  try {
    await db.connect();
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    process.exit(1); // Exit the process on database connection failure
  }
};

// Graceful shutdown
const shutdown = () => {
  console.log('Closing database connection');
  db.end();
  process.exit(0);
};

// Connect to the database and start the server
connectDB().then(() => {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.set('view engine', 'ejs');

  app.get('/', async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM book_note');
      const books = result.rows;
      res.render('index', { books });
    } catch (err) {
      console.error('Error querying the database:', err.message);
      res.status(500).send('Internal Server Error');
    }
  });

  // Graceful shutdown on SIGINT (Ctrl+C)
  process.on('SIGINT', shutdown);

  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
