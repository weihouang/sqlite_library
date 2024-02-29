const bookQueries = {
    getAllBooks: `
    SELECT 
        b.ISBN, 
        b.TITLE as title, 
        GROUP_CONCAT(a.NAME, ', ') as authors,
        CASE
            WHEN EXISTS (SELECT 1 FROM BOOK_LOANS bl WHERE bl.ISBN = b.ISBN AND bl.Date_in IS NULL) THEN 'Checked Out'
            ELSE 'Available'
        END as availability
    FROM 
        BOOK b
    LEFT JOIN 
        BOOK_AUTHORS ba ON b.ISBN = ba.ISBN
    LEFT JOIN 
        AUTHORS a ON ba.AUTHOR_ID = a.AUTHOR_ID
    GROUP BY 
        b.ISBN`,

searchBooks: `    
    SELECT 
        b.ISBN, 
        b.TITLE as title,
        (SELECT GROUP_CONCAT(a.NAME) FROM AUTHORS a JOIN BOOK_AUTHORS ba ON a.AUTHOR_ID = ba.AUTHOR_ID WHERE ba.ISBN = b.ISBN) as authors,
        CASE
            WHEN EXISTS (SELECT 1 FROM BOOK_LOANS bl WHERE bl.ISBN = b.ISBN AND bl.Date_in IS NULL) THEN 'Checked Out'
            ELSE 'Available'
        END as availability
    FROM 
        BOOK b
    WHERE 
        b.TITLE LIKE '%' || ? || '%' OR 
        b.ISBN LIKE '%' || ? || '%'
    GROUP BY 
        b.ISBN`,

    
  insertBookLoan: `
    INSERT INTO BOOK_LOANS (ISBN, Card_no, Date_out, Due_date) VALUES (?, ?, datetime('now'), ?)`,
    
  isBookCheckedOut: `
    SELECT COUNT(*) AS count FROM BOOK_LOANS WHERE ISBN = ? AND Date_in IS NULL`,
};

module.exports = bookQueries;