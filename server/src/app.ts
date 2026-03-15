import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import courseRoutes from "./routes/courseRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import resourceRoutes from "./routes/resourceRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Women Empowerment Platform API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/resources", resourceRoutes);

export default app;

