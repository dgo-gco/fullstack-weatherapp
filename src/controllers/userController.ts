import { Request, Response } from "express";
import User from "../models/User";
import * as jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);
require("../middleware/passportJwt");

const example = async (req: Request, res: Response) => {
  let user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, salt),
  });
  console.log(user);
};

const createUser = async (req: Request, res: Response) => {
  let user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, salt),
  });
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.status(200).send({
        msg: "User already exists",
      });
    }
    const token = jwt.sign({ user }, process.env.PUB_KEY!, {
      expiresIn: "1h",
    });
    user.save();
    user.token = token;
    return res.status(200).send({
      msg: "You've been registered",
      user,
    });
  } catch (error) {
    return res.status(500).send({
      msg: "Problems while regsitering",
    });
  }
};

const logIn = async (req: Request, res: Response) => {
  try {
    User.findOne({
      email: req.body.email,
    }).then((user) => {
      //user is my resolved value; returned by the findOne
      if (!user) {
        return res.status(200).send({
          msg: "User not found",
        });
      }
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(200).send({
          msg: "Incorrect password!",
        });
      }
      const token = jwt.sign({ user }, process.env.PUB_KEY!, {
        expiresIn: "1h",
      });
      console.log(user);
      user.token = token;
      return res.status(200).send({
        msg: "Successful log in!",
        token: "Bearer " + token,
      });
    });
  } catch (error) {
    return res.status(500).send({
      msg: "Error while trying to log in.",
    });
  }
};


const accessDashboard = 
  async (req: Request, res: Response) => {
    console.log("correct token");
    try {
      return res.status(200).send({
        msg: "You're here thanks to JWT",
      });
    } catch (error) {
      return res.status(500).send({
        msg: "Not authenticated",
      });
    }
  };

export { example, createUser, logIn, accessDashboard };
