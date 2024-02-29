const borrowerQueries = {
  addBorrower: `
        INSERT INTO BORROWER (CARD_ID, SSN, BNAME, ADDRESS, PHONE) 
        VALUES (?, ?, ?, ?, ?)
    `,
};

module.exports = borrowerQueries;