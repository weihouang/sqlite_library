const db = require("../db/database");
const borrowerQueries = require("../queries/borrowerQueries");

const insertBorrower = (ssn, name, address, phone) => {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT COUNT(*) AS count FROM BORROWER WHERE SSN = ?",
      [ssn],
      (err, row) => {
        if (err) {
          console.error("Error checking SSN:", err);
          return reject(err);
        }

        if (row && row.count > 0) {
          return reject(
            new Error("Borrower with the given SSN already exists.")
          );
        }

        db.get(
          "SELECT MAX(CAST(SUBSTR(Card_id, 3) AS INTEGER)) AS maxId FROM BORROWER",
          [],
          (err, row) => {
            if (err) {
              console.error("Error fetching max borrower ID:", err);
              return reject(err);
            }

            let nextId = 1;
            if (row && row.maxId) {
              nextId = row.maxId + 1;
            }

            let formattedId = "ID" + String(nextId).padStart(6, "0");

            db.run(
              borrowerQueries.addBorrower,
              [formattedId, ssn, name, address, phone],
              (err) => {
                if (err) {
                  console.error("Error inserting new borrower:", err);
                  return reject(err);
                }
                resolve(formattedId);
              }
            );
          }
        );
      }
    );
  });
};

module.exports = {
  insertBorrower,
};
