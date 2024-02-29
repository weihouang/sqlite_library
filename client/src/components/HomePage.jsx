import React, { useState } from "react";
import Modal from "./Modal";
const HomePage = () => {
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [books, setBooks] = useState([]);
  const [cardId, setCardId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = async () => {
    await fetchBooks();
  };
  const toggleBookSelection = (bookId) => {
    setSelectedBooks((prevSelectedBooks) => {
      if (prevSelectedBooks.includes(bookId)) {
        return prevSelectedBooks.filter((id) => id !== bookId);
      } else {
        if (prevSelectedBooks.length < 3) {
          return [...prevSelectedBooks, bookId];
        } else {
          alert("You can only select up to 3 books.");
          return prevSelectedBooks;
        }
      }
    });
  };
  const handleCheckout = () => {
    setIsCheckoutModalOpen(true);
  };
  const handleConfirmCheckout = async () => {
    setIsCheckoutModalOpen(false);
    const currentDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(currentDate.getDate() + 14);
    const formatDate = (date) => {
      let d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();
      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;
      return [year, month, day].join("-");
    };
    const checkoutData = {
      cardNumber: cardId,
      books: selectedBooks.map((isbn) => ({
        ISBN: isbn,
        dayOut: formatDate(currentDate),
        dueDate: formatDate(dueDate),
      })),
    };
    try {
      const response = await fetch("http://localhost:3001/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      await fetchBooks();
    } catch (error) {
      console.error("Checkout failed:", error);
    }
    setSelectedBooks([]);
    setCardId("");
  };
  const fetchBooks = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/books/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchQuery }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Failed to search books:", error);
    }
  };
  const renderCheckoutContent = () => (
    <>
      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
        Enter Card ID for Checkout
      </h3>
      <input
        type="text"
        value={cardId}
        onChange={(e) => setCardId(e.target.value)}
        className="p-2 border border-gray-300 rounded w-full mb-4"
      />
      <button
        className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
        onClick={handleConfirmCheckout}
      >
        Confirm Checkout
      </button>
    </>
  );
  return (
    <div className="container mx-auto p-4">
      <div className="text-center my-10">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to the Library Catalog
        </h1>
        <p className="text-lg mb-8">Search Books</p>
        <div className="flex justify-center">
          <input
            type="text"
            placeholder="Search by title, author, or ISBN..."
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
        </div>{" "}
      </div>

      <div className="my-10">
        <div className="grid grid-cols-1 gap-6">
          {books.map((book) => (
            <div
              key={book.ISBN}
              className="border border-gray-300 rounded-lg p-4 mb-4 flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-bold">{book.title}</h3>
                <p className="text-gray-600">
                  {book.authors ? book.authors : "Author not available"}
                </p>
                <p className="text-gray-600">ISBN: {book.ISBN}</p>
                <p className="text-gray-600">Status: {book.availability}</p>
              </div>
              {
                <button
                  onClick={() => toggleBookSelection(book.ISBN)}
                  disabled={book.availability === "Checked Out"}
                  className={`text-sm font-semibold py-1 px-2 rounded ${
                    book.availability === "Checked Out"
                      ? "bg-red-500 text-white"
                      : selectedBooks.includes(book.ISBN)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {book.availability === "Checked Out"
                    ? "Not Available"
                    : selectedBooks.includes(book.ISBN)
                    ? "Selected"
                    : "Select"}
                </button>
              }
            </div>
          ))}
        </div>
      </div>
      <div className="fixed bottom-4 right-4 flex flex-col space-y-2">
        <button
          onClick={handleCheckout}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-lg"
        >
          Check Out
        </button>
      </div>
      <Modal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
      >
        {renderCheckoutContent()}
      </Modal>
    </div>
  );
};
export default HomePage;
