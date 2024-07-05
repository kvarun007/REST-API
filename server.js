const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app =express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



const db = mysql.createConnection({
    
    host: "localhost",
    user: "root",
    password: "12345678",
    database: "mydatabase",
    port: 3307
  });
  
  // Connect to MySQL
  db.connect((err) => {
    if (err) {
      throw err;
    }
    console.log('Connected to MySQL database');
  });


//   app.get('/api/users', (req, res) => {
//     db.query('SELECT * FROM varun', (err, results) => {
//       if (err) {
//         res.status(500).send('Error retrieving users from database');
//       } else {
//         res.json(results);
        
//       }
//     });
//   });
  
  app.get('/api/users/', (req, res) => {
    const userId = req.query.id;
    //console.log(userId)
    if(!userId){
        console.log("no id")
        db.query('SELECT * FROM varun', (err, results) => {
            if (err) {
              res.status(500).send('Error retrieving users from database');
            } else {
              res.json(results);
              
            }
          });
    }
    else{
        db.query('SELECT * FROM varun WHERE person = ?', userId, (err, results) => {
            if (err) {
              res.status(500).send(`Error retrieving user with id ${userId} from database`);
            } else if (results.length === 0) {
              res.status(404).send(`User with id ${userId} not found`);
              
            } else {
              res.json(results[0]);
            }
          });
    }
    
  });


  app.post('/api/users', (req, res) => {
    const { person,lastname, firstname } = req.body;
    db.query('INSERT INTO varun (person,lastname, firstname) VALUES (?, ?,?)', [person,lastname, firstname], (err, result) => {
      if (err) {
        res.status(500).send('Error creating new user');
      } else {
        res.status(201).send('User created successfully');
      }
    });
  });

  app.put('/api/users/', (req, res) => {
    const userId = req.query.id;
    const { person,lastname, firstname } = req.body;
    db.query('UPDATE varun SET lastname = ?, firstname = ? WHERE person = ?', [lastname, firstname, userId], (err, result) => {
      if (err) {
        res.status(500).send(`Error updating user with id ${userId}`);
      } else if (result.affectedRows === 0) {
        res.status(404).send(`User with id ${userId} not found`);
      } else {
        res.send('User updated successfully');
      }
    });
  });

  app.delete('/api/users/', (req, res) => {
    const userId = req.query.id;
    db.query('DELETE FROM varun WHERE person = ?', userId, (err, result) => {
      if (err) {
        res.status(500).send(`Error deleting user with id ${userId}`);
      } else if (result.affectedRows === 0) {
        res.status(404).send(`User with id ${userId} not found`);
      } else {
        res.send('User deleted successfully');
      }
    });
  });


  // Start server
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });