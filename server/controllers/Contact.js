import Contact from "../models/Contact.js";
import { createError } from "../error.js";

export const contactUs = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return next(createError(400, "All fields are required"));
    }
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    return res.status(201).json({ message: "Message sent successfully" });
  } catch (err) {
    next(err);
  }
};
