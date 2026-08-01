import dotenv from "dotenv";
import app from "./app.js";

const PORT = process.env.PORT || 5001;
  
dotenv.config();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});