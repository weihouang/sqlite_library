import React, { useState } from "react";

const CheckIn = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/checkin/search?searchQuery=${encodeURIComponent(
          searchQuery
        )}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const books = await response.json();
      setSearchResults(books);
    } catch (error) {
      console.error("Failed to search checked-out books:", error);
      setSearchResults([]);
    }
  };

  const handleCheckIn = async (isbn, cardId) => {
    const cardNumber = cardId;
  
    const booksToCheckIn = [{ ISBN: isbn }];
  
    try {
      const response = await fetch('http://localhost:3001/api/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardNumber, books: booksToCheckIn }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.text();
      setSearchResults(searchResults.filter(book => book.ISBN !== isbn));
  
    } catch (error) {
      console.error('Failed to check in the book:', error);
    }
  };
  

  return (
    <div className="container mx-auto p-4">
      <div className="text-center my-10">
        <h1 className="text-4xl font-bold mb-4">Book Check-In</h1>
        <p className="text-lg mb-8">
          Search for checked out books by ISBN, Card Number, or Cardholder's
          Name
        </p>
        <div className="flex justify-center">
          <input
            type="text"
            placeholder="Search by ISBN, Card Number, or Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-4 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg w-1/2"
          />
          <button
            onClick={handleSearch}
            className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-8 rounded-r-lg"
          >
            Search
          </button>
        </div>
      </div>

      <div className="my-10">
        <div>
          {searchResults.length > 0 && (
            searchResults.map((book) => (
              <div
                key={book.ISBN}
                className="border border-gray-300 rounded-lg p-4 mb-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-bold">{book.title}</h3>
                  <p>ISBN: {book.ISBN}</p>
                  <p>Borrower Name: {book.borrowerName}</p>
                  <p>Card ID: {book.CARD_ID}</p>
                  <p>Date Out: {book.DATE_OUT}</p>
                </div>
                <button
                  onClick={() => handleCheckIn(book.ISBN, book.CARD_ID)}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Check In
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckIn;