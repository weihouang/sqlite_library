import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-semibold">
          <Link to="/" className="hover:text-gray-300">
            Library Catalog
          </Link>
        </div>
        <div className="flex gap-4">
          <Link to="/" className="hover:text-gray-300">
            Home
          </Link>
          <Link to="/fines" className="hover:text-gray-300">
            Fines
          </Link>
          <Link to="/checkin" className="hover:text-gray-300">
            CheckIn
          </Link>
          <Link to="/executor" className="hover:text-gray-300">
            GUI
          </Link>
          <Link to="/account" className="hover:text-gray-300">
            Create Borrower
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;