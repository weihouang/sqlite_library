const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database("./db/library.db", (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Connected to the library database.");
  }
});

module.exports = db;