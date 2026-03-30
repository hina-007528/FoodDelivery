import mongoose from "mongoose";
import dotenv from "dotenv";
import Food from "./models/Food.js";

dotenv.config({ path: './.env' });

const mongoUrl = process.env.MONGODB_URL || "mongodb+srv://FoodDelivery:Pass123@cluster0.bfkjxep.mongodb.net/fooddelivery";

const dishes = [
  {
    name: "Classic Cheeseburger",
    desc: "A juicy beef patty topped with melted cheddar cheese, lettuce, tomato, and our secret sauce.",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop",
    price: { org: 12.99, mrp: 15.99, off: 18 },
    category: ["Burgers"],
    ingredients: ["Beef Patty", "Cheddar Cheese", "Lettuce", "Tomato", "Bun"]
  },
  {
    name: "Spicy Zinger Burger",
    desc: "Crispy chicken fillet with a spicy kick, served with mayo and fresh lettuce.",
    img: "https://images.unsplash.com/photo-1513185158878-8d8c182b01f1?q=80&w=1000&auto=format&fit=crop",
    price: { org: 10.99, mrp: 13.99, off: 21 },
    category: ["Burgers"],
    ingredients: ["Chicken Fillet", "Spicy Coating", "Mayo", "Lettuce", "Bun"]
  },
  {
    name: "Margherita Pizza",
    desc: "The classic Italian pizza with fresh basil, mozzarella, and tomato sauce.",
    img: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=1000&auto=format&fit=crop",
    price: { org: 14.99, mrp: 18.99, off: 21 },
    category: ["Pizzas"],
    ingredients: ["Mozzarella", "Basil", "Tomato Sauce", "Olive Oil"]
  },
  {
    name: "Pepperoni Feast",
    desc: "Loaded with extra pepperoni and mozzarella on a crispy crust.",
    img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=1000&auto=format&fit=crop",
    price: { org: 16.99, mrp: 21.99, off: 22 },
    category: ["Pizzas"],
    ingredients: ["Pepperoni", "Mozzarella", "Pizza Dough", "Marinara Sauce"]
  },
  {
    name: "Chicken Dum Biryani",
    desc: "Fragrant basmati rice cooked with tender chicken and aromatic spices.",
    img: "https://bonmasala.com/wp-content/uploads/2022/10/mutton-biriyani-recipe.jpeg",
    price: { org: 18.99, mrp: 24.99, off: 24 },
    category: ["Biriyanis"],
    ingredients: ["Basmati Rice", "Chicken", "Saffron", "Mint", "Spices"]
  },
  {
    name: "Hyderabadi Mutton Biryani",
    desc: "A rich and spicy rice dish with slow-cooked mutton.",
    img: "https://vaya.in/news/wp-content/uploads/2018/03/Mutton-Biryani.jpg",
    price: { org: 22.99, mrp: 29.99, off: 23 },
    category: ["Biriyanis"],
    ingredients: ["Mutton", "Basmati Rice", "Fried Onions", "Yogurt", "Spices"]
  },
  {
    name: "Chocolate Lava Cake",
    desc: "A warm chocolate cake with a gooey molten center, served with vanilla ice cream.",
    img: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1000&auto=format&fit=crop",
    price: { org: 7.99, mrp: 9.99, off: 20 },
    category: ["Desserts"],
    ingredients: ["Dark Chocolate", "Butter", "Eggs", "Sugar", "Vanilla Ice Cream"]
  },
  {
    name: "Blueberry Cheesecake",
    desc: "Creamy cheesecake topped with fresh blueberries and a graham cracker crust.",
    img: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=1000&auto=format&fit=crop",
    price: { org: 8.99, mrp: 11.99, off: 25 },
    category: ["Desserts"],
    ingredients: ["Cream Cheese", "Blueberries", "Graham Crackers", "Cream"]
  },
  {
    name: "Iced Caramel Macchiato",
    desc: "Refreshing coffee with milk, vanilla syrup, and a caramel drizzle.",
    img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=1000&auto=format&fit=crop",
    price: { org: 4.99, mrp: 6.49, off: 23 },
    category: ["Beverages"],
    ingredients: ["Espresso", "Milk", "Caramel Sauce", "Ice"]
  },
  {
    name: "Mango Smoothie",
    desc: "A thick and creamy blend of fresh mangoes and yogurt.",
    img: "https://images.unsplash.com/photo-1483137140003-ce77b1022244?q=80&w=1000&auto=format&fit=crop",
    price: { org: 5.99, mrp: 7.99, off: 25 },
    category: ["Beverages"],
    ingredients: ["Fresh Mango", "Greek Yogurt", "Honey", "Ice"]
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(mongoUrl);
    console.log("Connected to MongoDB for Seeding");

    await Food.deleteMany({});
    console.log("Existing dishes cleared");

    await Food.insertMany(dishes);
    console.log("Database seeded successfully with all categories");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
