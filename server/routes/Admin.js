import express from "express";
import {
  adminLogin,
  getDashboardStats,
  getAllDishes,
  addDish,
  updateDish,
  deleteDish,
  getAllOrdersAdmin,
  getAllUsers,
} from "../controllers/Admin.js";
import { verifyAdmin } from "../middleware/verifyUser.js";

const router = express.Router();

// Public
router.post("/login", adminLogin);

// Protected (admin only)
router.get("/stats", verifyAdmin, getDashboardStats);

router.get("/dishes", verifyAdmin, getAllDishes);
router.post("/dishes", verifyAdmin, addDish);
router.put("/dishes/:id", verifyAdmin, updateDish);
router.delete("/dishes/:id", verifyAdmin, deleteDish);

router.get("/orders", verifyAdmin, getAllOrdersAdmin);
router.get("/users", verifyAdmin, getAllUsers);

export default router;
