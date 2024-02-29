import React, { useState, useEffect } from "react";

const Fines = () => {
  const [fines, setFines] = useState([]);
  const [cardIdForPayment, setCardIdForPayment] = useState("");
  const [showAllFines, setShowAllFines] = useState(false);

  useEffect(() => {
    if (showAllFines) {
      fetchCurrentFines();
    } else {
      fetchAllFines();
    }
  },[fines]);

  const fetchCurrentFines = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/currentFines");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setFines(data);
    } catch (error) {
      console.error("Failed to fetch fines:", error);
    }
  };

  const fetchAllFines = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/allFines");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setFines(data);
    } catch (error) {
      console.error("Failed to fetch fines:", error);
    }
  };

  const updateFines = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/updateFines", {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      await fetchCurrentFines();
    } catch (error) {
      console.error("Failed to update fines:", error);
    }
  };

  const handlePayment = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/payFine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cardId: cardIdForPayment }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      await fetchCurrentFines();
    } catch (error) {
      console.error("Failed to pay fines:", error);
    }
  };

  useEffect(() => {
    fetchCurrentFines();
  }, []);
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Library Fines Management</h2>

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={updateFines}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Update Fines
        </button>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={showAllFines}
            onChange={(e) => setShowAllFines(e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="ml-2 text-sm">Filter Previously Paid Fines</span>
        </div>
      </div>

      <div className="space-y-4">
        {fines.map((fine, index) => (
          <div key={index} className="p-4 border border-gray-300 rounded-lg flex justify-between">
            <div>
              <p className="text-lg font-semibold">Card ID: {fine.CARD_ID}</p>
              <p className="text-md">
                Fine Amount: <span className="font-semibold">${fine.TotalFine}</span>
              </p>
            </div>
            <div>
              {!fine.PAID && (
                <button
                  onClick={() => {
                    setCardIdForPayment(fine.CARD_ID);
                    handlePayment();
                  }}
                  className="bg-gray-400 text-white font-bold py-2 px-4 rounded"
                >
                  Pay
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default Fines;