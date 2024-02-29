const express = require('express');
const router = express.Router();
const fineService = require('../services/fineService');
const db = require("../db/database");

router.post('/updateFines', (req, res) => {
  fineService.updateFines((err) => {
    if (err) {
      res.status(500).send("Error updating fines");
    } else {
      res.send("Fines updated successfully");
    }
  });
});

router.get('/currentFines', (req, res) => {
  fineService.displayCurrentFine((err, rows) => {
    if (err) {
      res.status(500).send("Error retrieving current fines");
    } else {
      res.json(rows);
    }
  });
});

router.get('/allFines', (req, res) => {
  fineService.displayAllFine((err, rows) => {
    if (err) {
      res.status(500).send("Error retrieving all fines");
    } else {
      res.json(rows);
    }
  });
});

router.post('/payFine', (req, res) => {
  const { cardId } = req.body;
  fineService.payFine(cardId, (err) => {
    if (err) {
      res.status(500).send("Error processing fine payment");
    } else {
      res.send("Fine paid successfully");
    }
  });
});

router.post('/executeQuery', (req, res) => {
    const { query } = req.body;
    console.log(query)
    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});


module.exports = router;