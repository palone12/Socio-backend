import User from "../Model/User.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
export const registerController = async (req, res) => {
  const { username, password, email } = req.body;
  const newUser = new User({
    username,
    email,
    password: await hashPassword(password),
  });
  try {
    const user = await newUser.save();
    return res.status(200).send({
      success: true,
      user,
      message: "User Registered Successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: "false",
      message: "User Registeration Failed",
    });
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json("user not found");

    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }

    res.status(200).send({
      success: true,
      message: "User Logged in Successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
    });
  }
};
