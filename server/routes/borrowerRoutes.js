const express = require("express");
const router = express.Router();
const borrowerService = require("../services/borrowerService.js");

router.post("/borrowers", (req, res) => {
  const { ssn, name, address, phone } = req.body;

  borrowerService
    .insertBorrower(ssn, name, address, phone)
    .then((newBorrowerId) => {
      res
        .status(201)
        .json({
          message: "Borrower added successfully",
          borrowerId: newBorrowerId,
        });
    })
    .catch((error) => {
      if (error.message === "Borrower with the given SSN already exists.") {
        res.status(409).json({ error: error.message });
      } else {
        console.error("Error adding new borrower:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });
});  

module.exports = router;