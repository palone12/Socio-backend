import express from "express";
import { registerController } from "../controllers/authController.js";
import User from "../Model/User.js";
import bcrypt from "bcrypt";
const router = express.Router();
//Register EndPoint

router.post("/register", registerController);
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json("user not found");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(400).json("wrong password");

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
