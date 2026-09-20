const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const query = id ? `SELECT * FROM Users WHERE User_Id = ${id}` : 'SELECT * FROM Users';
    req.db.query(query, function (err, result) {
      if (err) throw err;
      res.status(200).json({ users: result })
    });
  }
  catch (err) {
    console.log(err);
    res.status(500).send()
  }
});

router.post('/register', async (req, res) => {
  try {
    const { email } = req.body;
    const sql = 'SELECT * FROM Users WHERE User_Email = ?';
    const email_value = [email];
    req.db.query(sql, email_value, function (err, result) {
      if (err) throw err;
      if (result.length) {
        res.status(201).json({ message: "Already exists!" });
      }
    });
    const hashedPassword = await bcrypt.hash(req.body.password1, 10);
    const user = { ...req.body, password: hashedPassword };
    delete user['password1'];
    delete user['password2'];
    const query = "INSERT INTO Users (User_First, User_Last, User_Phone, User_Address, User_Email, User_Password ) VALUES ?"
    const values = [Object.values(user)];
    req.db.query(query, [values], function (err, result) {
      if (err) throw err;
      res.status(201).json({ message: 'Success' })
      console.log("Number of records inserted: " + result.affectedRows);
    });

  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
})

router.post('/authenticate', (req, res) => {
  try {
    const query = `SELECT * FROM Users where User_Email = '${req.body.email}'`
    req.db.query(query, async (err, result) => {
      if (!result || !result.length) {
        return res.status(400).send('Cannot find user')
      }
      if (await bcrypt.compare(req.body.password, result[0].User_Password)) {
        res.status(200).json({ message: 'Success', data: result[0] })
      } else {
        res.status(400).json({ message: 'Invalid Credentials!' })
      }
    });

  } catch {
    res.status(500).send()
  }
})

module.exports = router;