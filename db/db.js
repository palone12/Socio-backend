import mongoose from "mongoose";
import colors from "colors";
export const connect = () => {
  //   console.log(process.env.MONGO_URL);
  mongoose.connect(process.env.MONGO_URL);
  console.log(`Mongo DB Connected`.bgYellow.white);
};
