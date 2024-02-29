const express = require("express");
const cors = require("cors");
const db = require("./db/database");
const app = express();
const PORT = process.env.PORT || 3001;
const bookRoutes = require("./routes/bookRoutes");
const borrowerRoutes = require("./routes/borrowerRoutes");
const fineRoutes = require("./routes/fineRoutes")
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", bookRoutes);
app.use("/api", borrowerRoutes);
app.use("/api", fineRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("SIGINT", () => {
  console.log(
    "Closing the database connection and shutting down the server..."
  );
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Database connection closed.");
  });
  process.exit(0);
});