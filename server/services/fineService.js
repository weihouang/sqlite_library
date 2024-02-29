
const db = require("../db/database");
const updateFineQueries = require("../queries/fineQueries");

const updateFines = (callback) => {
  db.serialize(() => {
    db.run(updateFineQueries.updateFine1);
    db.run(updateFineQueries.updateFine2);
    db.run(updateFineQueries.updateFine3);
    db.run(updateFineQueries.updateFine4, (err) => {
      callback(err);
    });
  });
};

const displayCurrentFine = (callback) => {
  db.all(updateFineQueries.displayCurrentFine, (err, rows) => {
    callback(err, rows);
  });
};

const displayAllFine = (callback) => {
  db.all(updateFineQueries.displayAllFine, (err, rows) => {
    callback(err, rows);
  });
};

const payFine = (cardId, callback) => {
  db.run(updateFineQueries.payFine, [cardId], (err) => {
    callback(err);
  });
};

module.exports = {
  updateFines,
  displayCurrentFine,
  displayAllFine,
  payFine,
};