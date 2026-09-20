const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  req.db.query(
    "SELECT * FROM Events",
    function (err, result) {
      if (err) res.status(500);
      res.status(200).json({ events: result });
    }
  );
});

router.get("/user/:id", (req, res) => {
  const userId = req.params.id;
  req.db.query(
    `SELECT * FROM Events  e
    LEFT outer JOIN  EventRegistrations er  ON e.Event_Id = er.Event_Id
     where er.User_Id = ${userId}
    ORDER BY e.Event_Id;`,
    function (err, result) {

      if (err) {
        console.log(err)
        res.status(500);
      }
      else {
        res.status(200).json({ events: result });
      }
    }
  );
});

router.post("/register", (req, res) => {
  try {
    const { userId, eventId } = req.body;
    req.db.query(`Select * from EventRegistrations WHERE User_Id = ${userId} AND Event_Id = ${eventId}`, function (err, result) {
      if (err) throw err;
      if (result.length) {
        res.status(201).json({ message: "Already exists!" });
      }
    });
    const query =
      "INSERT INTO EventRegistrations (User_Id, Event_Id) VALUES ?";
    const values = [[userId, eventId]];
    req.db.query(query, [values], function (err, result) {
      if (err) throw err;
      res.status(201).json({ message: "Success" });
      console.log("Number of records inserted: " + result.affectedRows);
    });
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

module.exports = router;
