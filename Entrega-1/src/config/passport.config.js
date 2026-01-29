import passport from "passport";
import jwt from "passport-jwt";
import local from "passport-local";
import { UserModel } from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;


const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['coderCookieToken'];
    }
    return token;
};

export const initializePassport = () => {
    
    passport.use("register", new LocalStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, username, password, done) => {
            const { first_name, last_name, age, cart } = req.body;
            try {
                let user = await UserModel.findOne({ email: username });
                if (user) return done(null, false, { message: "User already exists" });

                const newUser = {
                    first_name, last_name, email: username, age,
                    password: createHash(password),
                    cart,
                    role: 'user'
                };
                let result = await UserModel.create(newUser);
                return done(null, result);
            } catch (error) {
                return done(error);
            }
        }
    ));

    
    passport.use("login", new LocalStrategy(
        { usernameField: "email" },
        async (username, password, done) => {
            try {
                const user = await UserModel.findOne({ email: username });
                if (!user) return done(null, false, { message: "User not found" });
                if (!isValidPassword(user, password)) return done(null, false, { message: "Wrong password" });
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    
    passport.use("current", new JWTStrategy(
        {
            jwtFromRequest: ExtractJWT.fromExtractors([
                ExtractJWT.fromAuthHeaderAsBearerToken(), 
                cookieExtractor 
            ]),
            secretOrKey: "coderSecret",
        },
        async (jwt_payload, done) => {
            try {
                return done(null, jwt_payload);
            } catch (error) {
                return done(error);
            }
        }
    ));
};