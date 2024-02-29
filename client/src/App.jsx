import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CreateAccount from "./components/CreateAccount";
import HomePage from "./components/HomePage";
import CheckIn from "./components/CheckIn";
import Fines from "./components/Fines"
import DatabaseQueryExecutor from "./components/DatabaseExecuter"

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/account" element={<CreateAccount />} />
        <Route path="/checkin" element={<CheckIn />} />
        <Route path="/fines" element={<Fines />} />
        <Route path="/executor" element={<DatabaseQueryExecutor />} />
      </Routes>
    </>
  );
};

export default App;