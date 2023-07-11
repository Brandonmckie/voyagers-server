import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import cors from "cors";
import passport from "passport";
import passportJWT from "passport-jwt";

import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import stripeRouter from "./routes/stripe.js";
import webhookRouter from "./routes/webhookRoutes.js";
import itineraryRouter from "./routes/itinerary.js";
import config from "./config/config.js";
import { handleWebhooks } from "./controllers/webhookController.js";
import bodyParser from "body-parser";

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

var app = express();

app.use("/webhooks", bodyParser.raw({ type: "application/json" }), webhookRouter);
app.use(express.static("public"));
app.use('/img', express.static(path.join(__dirname, 'img')));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// Passport JWT implementation
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwtSecretKey,
    },
    (jwtPayload, done) => {
      // This function will be called when a JWT token is provided in a request
      // You can use this callback to validate the user, fetch user data from a database, etc.
      // In this example, we assume a simple user object with an 'id' property is stored in the token
      const user = { id: jwtPayload.id };
      return done(null, user);
    }
  )
);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/billing", stripeRouter);
app.use("/itinerary", itineraryRouter);

export default app;
