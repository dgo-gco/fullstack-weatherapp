const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
import User from '../models/User'
import passport from "passport";
import dotenv from 'dotenv'
dotenv.config()
const opts: any = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.PUB_KEY!;

passport.use(
  new JwtStrategy(opts, function (jwt_payload: any, done: any) {
    User.findOne({ id: jwt_payload.id }).then((user: any) => {
      if (!user) {
        return done(false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);