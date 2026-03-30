import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/User.js";
import dotenv from "dotenv";

dotenv.config({ path: './.env' });

const mongoUrl = process.env.MONGODB_URL || "mongodb+srv://FoodDelivery:Pass123@cluster0.bfkjxep.mongodb.net/fooddelivery";

const createAdmin = async () => {
  try {
    await mongoose.connect(mongoUrl);
    console.log("Connected to MongoDB");

    const adminEmail = "admin@foodeli.com";
    const adminPassword = "adminpassword123";

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(adminPassword, salt);

    const admin = new User({
      name: "Admin User",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();
    console.log("Admin user created successfully");
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();
