import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import UserRoutes from "./routes/User.js";
import FoodRoutes from "./routes/Food.js";
import AdminRoutes from "./routes/Admin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, ".env") });
console.log("JWT Secret Loaded:", process.env.JWT ? "Yes" : "No");

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true })); // for form data

app.use("/api/user/", UserRoutes);
app.use("/api/food/", FoodRoutes);
app.use("/api/admin/", AdminRoutes);

// error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Hello developers from GFG",
  });
});

const connectDB = () => {
  mongoose.set("strictQuery", true);
  const mongoUrl = process.env.MONGODB_URL || "mongodb+srv://FoodDelivery:Pass123@cluster0.bfkjxep.mongodb.net/fooddelivery";
  mongoose
    .connect(mongoUrl)
    .then(() => console.log("Connected to Mongo DB"))
    .catch((err) => {
      console.error("failed to connect with mongo");
      console.error(err);
    });
};

const startServer = async () => {
  try {
    connectDB();
    app.listen(process.env.PORT || 5000, () => console.log("Server started on port " + (process.env.PORT || 5000)));
  } catch (error) {
    console.log(error);
  }
};

startServer();

export default app;
