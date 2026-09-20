require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const config = require('./config/dbConfig');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const eventsRouter = require('./routes/events');

// dependencies 
const app = express();

// create mysql connection
const db = mysql.createConnection(config)

// // connect to mysql
db.connect(err => {
   if (err) {
      throw err;
   }
   console.log('db connection established!');
})

// middleware
app.use(express.static('view'));
app.use(cors());
app.use(express.json());
app.use(function (req, res, next) {
   req.db = db;
   next();
});

// routes(APIs)
app.use('/api', indexRouter);
app.use('/api/events', eventsRouter);
app.use('/api/users', usersRouter);

const PORT = process.env.PORT || 8080;

// Start Server 
app.listen(PORT, () => {
   console.log('Server is running!');
});