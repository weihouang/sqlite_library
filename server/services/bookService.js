const db = require("../db/database");
const bookQueries = require("../queries/bookQueries");

const getAllBooks = (callback) => {
  db.all(bookQueries.getAllBooks, [], (err, rows) => {
    if (err) {
      callback(err, null);
    } else {
      const enhancedRows = rows.map((row) => ({
        ...row,
      }));
      callback(null, enhancedRows);
    }
  });
};

const searchBooks = (searchQuery, callback) => {
  db.all(bookQueries.searchBooks, [searchQuery, searchQuery], (err, rows) => {
    if (err) {
      callback(err, null);
    } else {
      const enhancedRows = rows.map((row) => ({
        ...row,
      }));
      callback(null, enhancedRows);
    }
  });
};

const searchCheckedOutBooks = (searchQuery, callback) => {
  const query = `
  SELECT 
    bl.ISBN, 
    b.TITLE as title,
    bl.Card_id,
    bl.Date_out,
    bl.Due_date,
    GROUP_CONCAT(a.NAME, ', ') as authors,
    br.Bname as borrowerName
  FROM 
    BOOK_LOANS bl
  JOIN 
    BOOK b ON bl.ISBN = b.ISBN
  LEFT JOIN 
    BOOK_AUTHORS ba ON bl.ISBN = ba.ISBN
  LEFT JOIN 
    AUTHORS a ON ba.AUTHOR_ID = a.AUTHOR_ID
  LEFT JOIN 
    BORROWER br ON bl.Card_id = br.Card_id
  WHERE 
    bl.Date_in IS NULL AND
    (bl.ISBN LIKE '%' || ? || '%' OR 
     bl.Card_id LIKE '%' || ? || '%' OR 
     br.Bname LIKE '%' || ? || '%')
  GROUP BY 
    bl.ISBN, bl.Card_id
`;

  db.all(query, [searchQuery, searchQuery, searchQuery], (err, books) => {
    callback(err, books);
  });
};

module.exports = {
  getAllBooks,
  searchBooks,
  searchCheckedOutBooks,
};
