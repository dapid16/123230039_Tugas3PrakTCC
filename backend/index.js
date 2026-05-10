const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const noteRoutes = require("./routes/noteRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Route dasar
app.get("/", (req, res) => {
  res.send("Notes API is Running!");
});

// Setting Routes & Schema
require("./schema/note"); // Generate Tabel Notes
app.use("/notes", noteRoutes);

// Sync Database dan Jalankan Server
const port = process.env.PORT || 3000;
sequelize.sync().then(() => {
  console.log("Database synced");
  app.listen(port, () => console.log(`Server running on port ${port}`));
}).catch(err => {
  console.error("Failed to sync database:", err);
});