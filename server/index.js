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

// CORS — allow Netlify frontend + localhost dev
const allowedOrigins = [
  "https://food-delivery-topaz-seven.vercel.app",
  "http://localhost:3000",
];
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || origin.endsWith(".netlify.app")) {
        return callback(null, true);
      }
      return callback(null, true); // allow all for now; tighten later
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// Ensure DB is connected before handling any route
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

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
  res.status(200).json({ message: "FoodDelivery API is running!" });
});

// MongoDB connection — connect once on module load (works for both local & Vercel)
const mongoUrl = process.env.MONGODB_URL || "mongodb+srv://FoodDelivery:Pass123@cluster0.bfkjxep.mongodb.net/fooddelivery";

let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(mongoUrl);
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
  }
};

connectDB();

// Only listen when running locally (not in Vercel serverless)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

export default app;

