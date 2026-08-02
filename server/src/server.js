import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/database.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect Database
await connectDB();

app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});