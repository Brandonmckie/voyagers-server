import express from "express";
import UserController from "../controllers/users.js";
import passport from "passport";
import upload from "../utils/multer.js";
import multerUpload from "../utils/multerUpload.js";
var router = express.Router();

/* GET users listing. */
router.post("/login", UserController.login);
router.post("/forgotpassword", UserController.forgotPassword);
router.post("/verifyCode", UserController.verifyCode);
router.post("/reenter-password", UserController.reenterPassword);

router.post("/add-user", UserController.addUser);
router.get(
  "/verify-token",
  passport.authenticate("jwt", { session: false }),
  UserController.verifyToken
);
router.get(
  "/get-profile",
  passport.authenticate("jwt", { session: false }),
  UserController.getUser
);
router.get("/get-userprofile", UserController.userProfile);
router.get("/get-countries", UserController.getCountries);
router.patch(
  "/",
  [passport.authenticate("jwt", { session: false }), multerUpload.any()],
  UserController.updateUser
);

export default router;
