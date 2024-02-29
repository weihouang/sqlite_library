const checkinQueries = {
  getAllLoan: `    
    SELECT BOOK_LOANS.CARD_ID, BORROWER.BNAME, ISBN from BORROWER,BOOK_LOANS where BOOK_LOANS.CARD_ID=BORROWER.CARD_ID;`,
};

module.exports = getAllLoan;
