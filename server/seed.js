import mongoose from "mongoose";
import dotenv from "dotenv";
import Food from "./models/Food.js";

dotenv.config();

const foodItems = [
  // Burgers
  {
    name: "Classic Cheeseburger",
    desc: "A juicy beef patty with melted cheese, lettuce, tomato, and our special sauce.",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    price: { org: 12.99, mrp: 15.99, off: 19 },
    category: ["Burgers"],
    ingredients: ["Beef Patty", "Cheese", "Lettuce", "Tomato", "Special Sauce"],
  },
  {
    name: "Bacon BBQ Burger",
    desc: "Beef patty topped with crispy bacon, cheddar cheese, onion rings, and BBQ sauce.",
    img: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5",
    price: { org: 14.50, mrp: 17.50, off: 17 },
    category: ["Burgers"],
    ingredients: ["Beef Patty", "Bacon", "Cheddar", "Onion Rings", "BBQ Sauce"],
  },
  {
    name: "Mushroom Swiss Burger",
    desc: "A savory blend of sautéed mushrooms and melted Swiss cheese on a beef patty.",
    img: "https://images.unsplash.com/photo-1550547660-d9450f859349",
    price: { org: 13.99, mrp: 16.99, off: 18 },
    category: ["Burgers"],
    ingredients: ["Beef Patty", "Mushrooms", "Swiss Cheese", "Garlic Aioli"],
  },
  // Pizzas
  {
    name: "Pepperoni Pizza",
    desc: "Classic pepperoni pizza with signature tomato sauce and mozzarella cheese.",
    img: "https://images.unsplash.com/photo-1628840042765-356cda07504e",
    price: { org: 18.50, mrp: 22.00, off: 16 },
    category: ["Pizzas"],
    ingredients: ["Pepperoni", "Cheese", "Tomato Sauce"],
  },
  {
    name: "Margherita Pizza",
    desc: "Fresh basil, mozzarella cheese, and sliced tomatoes on a thin crust.",
    img: "https://images.unsplash.com/photo-1574071318508-1cdbad80ad38",
    price: { org: 16.00, mrp: 19.00, off: 15 },
    category: ["Pizzas"],
    ingredients: ["Fresh Basil", "Mozzarella", "Tomato", "Olive Oil"],
  },
  {
    name: "BBQ Chicken Pizza",
    desc: "Grilled chicken, red onions, and cilantro on top of tangy BBQ sauce.",
    img: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
    price: { org: 19.99, mrp: 24.99, off: 20 },
    category: ["Pizzas"],
    ingredients: ["Grilled Chicken", "Red Onion", "Cilantro", "BBQ Sauce"],
  },
  // Biriyanis
  {
    name: "Chicken Biryani",
    desc: "Fragrant basmati rice cooked with tender chicken and aromatic spices.",
    img: "https://images.unsplash.com/photo-1563379091339-03b17af4a4af",
    price: { org: 15.00, mrp: 18.00, off: 17 },
    category: ["Biriyanis"],
    ingredients: ["Chicken", "Basmati Rice", "Aromatic Spices"],
  },
  {
    name: "Mutton Biryani",
    desc: "Traditional goat meat biryani with rich flavors and succulent meat pieces.",
    img: "https://images.unsplash.com/photo-1589302188045-391db6962eca",
    price: { org: 19.50, mrp: 23.00, off: 15 },
    category: ["Biriyanis"],
    ingredients: ["Mutton", "Basmati Rice", "Saffron", "Yogurt"],
  },
  {
    name: "Veg Hyderabadi Biryani",
    desc: "Mixed seasonal vegetables slow-cooked with basmati rice in Hyderabadi style.",
    img: "https://images.unsplash.com/photo-1645177623570-ad2cfa7af65c",
    price: { org: 13.00, mrp: 16.00, off: 19 },
    category: ["Biriyanis"],
    ingredients: ["Mixed Veggies", "Basmati Rice", "Mint", "Fried Onions"],
  },
  // Desserts
  {
    name: "Chocolate Lava Cake",
    desc: "Warm chocolate cake with a gooey molten center.",
    img: "https://images.unsplash.com/photo-1624353335566-3d7115bad33a",
    price: { org: 7.99, mrp: 9.99, off: 20 },
    category: ["Desserts"],
    ingredients: ["Chocolate", "Flour", "Eggs", "Sugar"],
  },
  {
    name: "New York Cheesecake",
    desc: "Rich and creamy cheesecake with a graham cracker crust and berry topping.",
    img: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad",
    price: { org: 8.50, mrp: 10.50, off: 19 },
    category: ["Desserts"],
    ingredients: ["Cream Cheese", "Graham Cracker", "Sugar", "Berries"],
  },
  {
    name: "Gulab Jamun",
    desc: "Sweet milk-solid based dumplings soaked in rose-flavored sugar syrup.",
    img: "https://images.unsplash.com/photo-1589119908995-c6837fa14848",
    price: { org: 6.00, mrp: 7.50, off: 20 },
    category: ["Desserts"],
    ingredients: ["Milk Solids", "Sugar Syrup", "Cardamom"],
  },
  // Beverages
  {
    name: "Iced Caramel Macchiato",
    desc: "Freshly steamed milk with vanilla-flavored syrup marked with espresso and topped with a caramel drizzle.",
    img: "https://images.unsplash.com/photo-1485808191679-5f86510681a2",
    price: { org: 5.50, mrp: 6.50, off: 15 },
    category: ["Beverages"],
    ingredients: ["Espresso", "Milk", "Vanilla Syrup", "Caramel Sauce"],
  },
  {
    name: "Mango Smoothie",
    desc: "Creamy blend of fresh mangoes, yogurt, and a touch of honey.",
    img: "https://images.unsplash.com/photo-1525385133335-84282291c523",
    price: { org: 6.99, mrp: 8.50, off: 18 },
    category: ["Beverages"],
    ingredients: ["Mango", "Yogurt", "Honey", "Ice"],
  },
  {
    name: "Mint Mojito",
    desc: "Refreshing lime and mint cooler with a splash of club soda.",
    img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd",
    price: { org: 4.99, mrp: 6.00, off: 17 },
    category: ["Beverages"],
    ingredients: ["Lime", "Mint Leaves", "Sugar", "Soda"],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB for seeding...");
    
    await Food.deleteMany({});
    console.log("Existing food items cleared.");
    
    await Food.insertMany(foodItems);
    console.log("Sample food items added successfully!");
    
    await mongoose.connection.close();
    console.log("Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();
