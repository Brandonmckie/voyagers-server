import express from "express";
import passport from "passport";
import Itinerary from "../controllers/itinerary.js";
import upload from "../utils/multer.js";
import multerUpload from "../utils/multerUpload.js";
var router = express.Router();

/* GET users listing. */
// router.post("/", [passport.authenticate("jwt", { session: false }), upload.any()], Itinerary.addItinierary);
router.post(
  "/",
  [passport.authenticate("jwt", { session: false }), multerUpload.any()],
  Itinerary.addItinierary
);
router.get("/", Itinerary.getItineraries);
router.get(
  "/purchased",
  passport.authenticate("jwt", { session: false }),
  Itinerary.getPurchasedItineraries
);
router.get(
  "/list/me",
  passport.authenticate("jwt", { session: false }),
  Itinerary.getMyItineraries
);
router.get("/sendEmail/:id", passport.authenticate("jwt", { session: false }), Itinerary.sendEmail);
router.get("/view/:itineraryId", Itinerary.getSingleItinerary);
router.get("/userItinerary", Itinerary.getuserItinerary);

router.delete(
  "/:itinerary",
  passport.authenticate("jwt", { session: false }),
  Itinerary.deleteItinerary
);
router.patch("/deleteDay", passport.authenticate("jwt", { session: false }), Itinerary.deleteDay);
router.get("/topCountries", Itinerary.TopCountries);
router.patch(
  "/:itineraryId",
  [passport.authenticate("jwt", { session: false }), multerUpload.any()],
  Itinerary.updateItinerary
);
// router.post("/add-user", UserController.addUser);
// router.get("/verify-token", passport.authenticate("jwt", { session: false }), UserController.verifyToken);

export default router;
