import express from "express";
import passport from "passport";
import bcrypt from "bcryptjs";
const userRouter = express.Router();
require("../middleware/passportJwt");
import {
  example,
  createUser,
  logIn,
  accessDashboard,
} from "../controllers/userController";

userRouter.use(passport.initialize());

userRouter.get("/", (req, res) => {
  res.send("heeey youre in the users page");
});

userRouter.post("/example", example);

userRouter.post("/register", createUser);

userRouter.post("/login", logIn);

userRouter.get(
  "/dashboard",
  passport.authenticate("jwt", { session: false }),
  accessDashboard
);

export default userRouter;
