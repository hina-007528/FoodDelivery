import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Food from "../models/Food.js";
import Orders from "../models/Orders.js";
import { createError } from "../error.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || "dj0ztx4ir",
  api_key: process.env.CLOUD_API_KEY || "899638664936343",
  api_secret: process.env.CLOUD_API_SECRET || "Ro8BOIbGM6HWhAVRq11ey8FcZ9Y"
});

// ─── Admin Login ─────────────────────────────────────────────────────────────
export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(createError(404, "User not found"));
    if (user.role !== "admin")
      return next(createError(403, "Access denied. Admins only."));
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return next(createError(400, "Incorrect password"));
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT,
      { expiresIn: "7d" }
    );
    return res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
};

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export const getDashboardStats = async (req, res, next) => {
  try {
    const [totalDishes, totalOrders, totalUsers, revenueResult] = await Promise.all([
      Food.countDocuments(),
      Orders.countDocuments(),
      User.countDocuments({ role: "user" }),
      Orders.aggregate([{ $group: { _id: null, total: { $sum: "$total_amount" } } }]),
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;
    return res.status(200).json({ totalDishes, totalOrders, totalUsers, totalRevenue });
  } catch (err) {
    next(err);
  }
};

// ─── Dishes CRUD ─────────────────────────────────────────────────────────────
export const getAllDishes = async (req, res, next) => {
  try {
    const dishes = await Food.find().sort({ createdAt: -1 });
    return res.status(200).json(dishes);
  } catch (err) {
    next(err);
  }
};

export const addDish = async (req, res, next) => {
  try {
    let dishData = { ...req.body };
    if (dishData.img && dishData.img.startsWith("data:image")) {
      const uploadRes = await cloudinary.uploader.upload(dishData.img, { folder: "fooddelivery" });
      dishData.img = uploadRes.secure_url;
    }
    const dish = new Food(dishData);
    const saved = await dish.save();
    return res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
};

export const updateDish = async (req, res, next) => {
  try {
    const { id } = req.params;
    let dishData = { ...req.body };
    if (dishData.img && dishData.img.startsWith("data:image")) {
      const uploadRes = await cloudinary.uploader.upload(dishData.img, { folder: "fooddelivery" });
      dishData.img = uploadRes.secure_url;
    }
    const updated = await Food.findByIdAndUpdate(id, { $set: dishData }, { new: true });
    if (!updated) return next(createError(404, "Dish not found"));
    return res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteDish = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Food.findByIdAndDelete(id);
    return res.status(200).json({ message: "Dish deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// ─── All Orders ───────────────────────────────────────────────────────────────
export const getAllOrdersAdmin = async (req, res, next) => {
  try {
    const orders = await Orders.find()
      .populate({ path: "products.product", model: "Food" })
      .populate({ path: "user", model: "User", select: "name email" })
      .sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

// ─── All Users ───────────────────────────────────────────────────────────────
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: "user" }).select("-password").sort({ createdAt: -1 });
    return res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};
