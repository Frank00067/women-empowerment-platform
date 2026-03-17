import dotenv from "dotenv";
import app from "./app";
import { seedData } from "./store";

dotenv.config();

seedData();

const PORT = process.env.PORT || 4000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Women Empowerment API running on port ${PORT}`);
});

