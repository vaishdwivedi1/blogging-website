import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import Token from "../model/token.js";
import User from "../model/user.js";

dotenv.config();

export const singupUser = async (req, res) => {
  try {
    const { username, name, password } = req.body;

    // Basic validation (You can expand this as needed)
    if (!username || !name || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ msg: "username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, name, password: hashedPassword });
    await user.save();

    return res.status(200).json({ msg: "Signup successful" });
  } catch (error) {
    console.error("Error during signup:", error); // Log the error
    return res
      .status(500)
      .json({ msg: "Error while signing up user", error: error.message });
  }
};

export const loginUser = async (request, response) => {
  let user = await User.findOne({ username: request.body.username });
  if (!user) {
    return response.status(400).json({ msg: "Username does not match" });
  }

  try {
    let match = await bcrypt.compare(request.body.password, user.password);
    if (match) {
      const accessToken = jwt.sign(user.toJSON(), "rsdrsd", {
        expiresIn: "15m",
      });
      const refreshToken = jwt.sign(user.toJSON(), "rsdrsd");

      const newToken = new Token({ token: refreshToken });
      await newToken.save();

      response.status(200).json({
        accessToken: accessToken,
        refreshToken: refreshToken,
        name: user.name,
        username: user.username,
      });
    } else {
      response.status(400).json({ msg: "Password does not match" });
    }
  } catch (error) {
    response.status(500).json({ msg: "error while login the user" });
  }
};

export const logoutUser = async (request, response) => {
  const token = request.body.token;
  await Token.deleteOne({ token: token });

  response.status(204).json({ msg: "logout successfull" });
};
