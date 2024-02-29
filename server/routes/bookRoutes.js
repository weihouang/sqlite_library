const express = require("express");
const router = express.Router();
const bookService = require("../services/bookService");
const db = require("../db/database");

router.post("/books/search", (req, res) => {
  const searchQuery = req.body.query;
  if (searchQuery) {
    bookService.searchBooks(searchQuery, (err, books) => {
      if (err) {
        res.status(500).send("Error searching books");
      } else {
        res.status(200).json(books);
      }
    });
  } else {
    bookService.getAllBooks((err, books) => {
      if (err) {
        res.status(500).send("Error fetching books");
      } else {
        res.status(200).json(books);
      }
    });
  }
});

router.get("/checkin/search", (req, res) => {
  const { searchQuery } = req.query;
  bookService.searchCheckedOutBooks(searchQuery, (err, books) => {
    if (err) {
      res.status(500).send("Error searching for checked-out books");
    } else {
      res.status(200).json(books);
    }
  });
});

router.post("/checkin", (req, res) => {
  const { cardNumber, books } = req.body;

  const updatePromises = books.map((book) => {
    return new Promise((resolve, reject) => {
      const { ISBN } = book;
      db.run(
        "UPDATE BOOK_LOANS SET Date_in = CURRENT_DATE WHERE ISBN = ? AND Card_id = ? AND Date_in IS NULL",
        [ISBN, cardNumber],
        (err) => {
          if (err) {
            console.error("Error updating book loan for check-in:", err);
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  });

  Promise.all(updatePromises)
    .then(() => {
      res.send("Check-in process completed.");
    })
    .catch((err) => {
      res.status(500).send("Error processing check-in.");
    });
});

router.post("/checkout", (req, res) => {
  const { cardNumber, books } = req.body;
  const currentDateFormatted = new Date().toISOString().split("T")[0];

  db.get(
    "SELECT COUNT(*) AS count FROM BORROWER WHERE Card_id = ?",
    [cardNumber],
    (err, row) => {
      if (err) {
        console.error("Error checking card number:", err);
        return res.status(500).send("Error processing checkout.");
      }

      if (row.count === 0) {
        return res.status(400).send("Borrower card ID does not exist.");
      }

      db.get(
        "SELECT COUNT(*) AS count FROM BOOK_LOANS WHERE Card_id = ? AND Due_date > ?",
        [cardNumber, currentDateFormatted],
        (err, row) => {
          if (err) {
            console.error("Error fetching book loans count:", err);
            return res.status(500).send("Error processing checkout.");
          }

          if (row.count + books.length > 3) {
            return res
              .status(400)
              .send("Checkout limit exceeded. Max 3 books allowed per card.");
          }

          books.forEach((book, index) => {
            const { ISBN, dayOut, dueDate } = book;
            db.run(
              "INSERT INTO BOOK_LOANS (ISBN, Card_id, Date_out, Due_date) VALUES (?, ?, ?, ?)",
              [ISBN, cardNumber, dayOut, dueDate],
              (err) => {
                if (err) {
                  console.error("Error inserting book loan:", err);
                  return res
                    .status(500)
                    .send("Error processing checkout for ISBN " + ISBN);
                }

                if (index === books.length - 1) {
                  res.send("Checkout process initiated.");
                }
              }
            );
          });
        }
      );
    }
  );
});

module.exports = router;
