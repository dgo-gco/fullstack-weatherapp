import mongoose from "mongoose";
const Schema = mongoose.Schema;
import {UserInterface} from "../interfaces/userInterface"

const userSchema = new Schema<UserInterface>({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlenght: 5,
  },
  token: {
    type: String
  }
});


const User = mongoose.model("User", userSchema);
export default User;