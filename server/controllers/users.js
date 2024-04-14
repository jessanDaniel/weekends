import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.js";

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // ! searching for the existing user in the database using email...

    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(200).json({ message: "This user does'nt exist" });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect)
      return res.status(200).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      "test",
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: existingUser, token, message: "yes" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signup = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(200).json({ message: "Sorry, User already exists" });

    if (password !== confirmPassword)
      return res.status(200).json({ message: "The passwords does not match" });

    const hashedPassword = await bcrypt.hash(password, 12); // * the second parameter is the difficulty level, usually 12 is preferable...

    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });

    const token = jwt.sign({ email: result.email, id: result._id }, "test", {
      expiresIn: "1h",
    });

    res.status(200).json({ result, token, message: "yes" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Oops something went wrong" });
  }
};
