import React, { useState } from "react";

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    ssn: "",
    phone: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let errors = {};
    // Name validation
    if (!formData.name) {
      errors.name = "Name is required";
    }
    // Address validation
    if (!formData.address) {
      errors.address = "Address is required";
    }
    if (!formData.ssn || !/\d{3}-\d{2}-\d{4}/.test(formData.ssn)) {
      errors.ssn = "Invalid SSN (expected format: XXX-XX-XXXX";
    }
    if (!formData.phone || !/\(\d{3}\)-\d{3}-\d{4}/.test(formData.phone)) {
      errors.phone = "Invalid phone number (expected format: (XXX)-XXX-XXXX)";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch("http://localhost:3001/api/borrowers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log("Account created successfully:", responseData);
      } catch (error) {
        console.error("Failed to create account:", error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Create Borrower Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {formErrors.name && (
            <p className="text-red-500 text-xs italic">{formErrors.name}</p>
          )}
        </div>
        {/* Address Input Field */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="address"
          >
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {formErrors.address && (
            <p className="text-red-500 text-xs italic">{formErrors.address}</p>
          )}
        </div>

        {/* SSN Input Field */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="ssn"
          >
            Social Security Number (SSN)
          </label>
          <input
            type="text"
            name="ssn"
            value={formData.ssn}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="XXX-XX-XXXX"
          />
          {formErrors.ssn && (
            <p className="text-red-500 text-xs italic">{formErrors.ssn}</p>
          )}
        </div>

        {/* Phone Input Field */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="phone"
          >
            Phone Number
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="(XXX)-XXX-XXXX"
          />
          {formErrors.phone && (
            <p className="text-red-500 text-xs italic">{formErrors.phone}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Create Account
        </button>
      </form>
    </div>
  );
};

export default CreateAccount;