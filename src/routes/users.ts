import express from "express";
import User from "../models/User";
import * as jwt from "jsonwebtoken";
import passport from "passport";
import bcrypt from "bcryptjs";
const userRouter = express.Router();
const salt = bcrypt.genSaltSync(10);
require('../middleware/passportJwt')

userRouter.use(passport.initialize());

userRouter.get("/", (req, res) => {
  res.send('heeey toure in the users page')
});

userRouter.post("/example", async (req, res) => {
    let user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, salt),
      });
    console.log(user);
  });

userRouter.post("/register", async (req, res) => {
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
    user.save();
    return res.status(200).send({
      msg: "You've been registered",
      user,
    });
  } catch (error) {
    return res.status(500).send({
      msg: "Problems while regsitering",
    });
  }
});

userRouter.post("/login", async (req, res) => {
    console.log('the req body', req.body);
    
  try {
    User.findOne({
      email: req.body.email,
    }).then((user) => {
        console.log('oonly user', user);
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
        expiresIn: "1d",
      });  
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
});

userRouter.get(
  "/dashboard",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
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
  }
);

export default userRouter;
