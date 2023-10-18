import User from "../models/User.js";
import itineraryService from "../services/itineraryService.js";
import ItineraryModel from "../models/Itinerary.js";
import { mediaUpload } from "../utils/amazonUpload.js";
import { s3Uploadv3 } from "../utils/s3Bucket.js";

class Itinerary {
  async addItinierary(req, res) {
    try {
      let { values, errors, isValid } = itineraryService.validateItineraryInput(
        req.body,
        req.files
      );

      const { data0, images } = itineraryService.parseImages(req.files, req.body);

      if (!isValid) {
        return res.status(400).json(errors);
      }
      let url0 = await s3Uploadv3(images);
      let image = req.files.find((each) => each.fieldname === "image");
      let url = await mediaUpload(image);
      console.log(image, 23);
      let itinerary = await itineraryService.addItinerary({
        ...values,
        userId: req.user.id,
        image: url,
        eachDetail: data0,
      });
      console.log(itinerary, 30);
      return res.send(itinerary);
    } catch (error) {
      console.log(error);
    }
  }

  async getItineraries(req, res) {
    try {
      let query = req.query;
      if (query.region) {
        query.country = query.region;
        delete query.region;
      }
      let limit;

      if (query.limit) {
        limit = query.limit;
        delete query.limit;
      }

      // query["userId.stripeConnected"] = true;

      const itineraries = await itineraryService.getListing(query, limit);

      return res.send(itineraries);
    } catch (error) {
      console.log(error);
    }
  }

  async sendEmail(req, res) {
    try {
      const user = await User.findById(req.user.id).select("+email");
      console.log(user);
      if (!user) {
        return;
      }
      let data = await itineraryService.getSingleItinerary(req.params.id);

      let transporter = nodemailer.createTransport({
        host: "smtp.office365.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.SENDER_EMAIL,
          pass: process.env.SENDER_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
      let mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: process.env.RECEIVER_EMAIL,
        subject: "Checkout Completed",
        text: `Checkout has been completed for itinerary ID: ${req.params.id} `,
        // html: "<b>Hello world?</b>", // html body
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          // return { message: "email" };
        } else {
          console.log("Message sent: %s", info.messageId);
        }
      });
    } catch (error) {
      console.log("email not sent!");
      console.log(error);
    }
  }

  async TopCountries(req, res) {
    try {
      let topCountries = await itineraryService.TopCountries();
      res.send(topCountries);
    } catch (error) {
      console.log(error);
    }
  }

  async getuserItinerary(req, res) {
    try {
      let itineraries = await itineraryService.singleuserItinerary(req.query.username);
      res.send(itineraries);
    } catch (error) {
      console.log(error);
    }
  }

  async getPurchasedItineraries(req, res) {
    try {
      let user = await User.findById(req.user.id).select("boughtItineraries");

      let query = req.query;
      if (query.region) {
        query.country = query.region;
        delete query.region;
      }
      let limit;

      query._id = { $in: user.boughtItineraries };

      if (query.limit) {
        limit = query.limit;
        delete query.limit;
      }

      // query["userId.stripeConnected"] = true;

      const itineraries = await itineraryService.getListing(query, limit);
      return res.send(itineraries);
    } catch (err) {
      console.log(err);
    }
  }

  async getMyItineraries(req, res) {
    try {
      let query = req.query;
      if (query.region) {
        query.country = query.region;
        delete query.region;
      }
      let limit;

      if (query.limit) {
        limit = query.limit;
        delete query.limit;
      }

      query.userId = req.user.id;

      const itineraries = await itineraryService.getListing(query, limit);
      return res.send(itineraries);
    } catch (err) {
      console.log(err);
    }
  }

  async getSingleItinerary(req, res) {
    try {
      let { itineraryId } = req.params;
      const itinerary = await itineraryService.getSingleItinerary(itineraryId);
      return res.send(itinerary);
    } catch (err) {
      console.log(err);
    }
  }

  async updateItinerary(req, res) {
    try {
      let { values, errors, isValid } = itineraryService.validateItineraryInput(
        req.body,
        req.files
      );
      const { data0, images } = itineraryService.parseImages(req.files, req.body);
      let itineraryId = req.params.itineraryId;

      if (!isValid) {
        return res.status(400).json(errors);
      }
      let url0 = await s3Uploadv3(images);
      let image = req.files?.find((each) => each.fieldname === "image");
      let url;
      if (image) {
        url = await mediaUpload(image);
      }

      let itinerary = await itineraryService.updateItinerary(
        {
          ...values,
          userId: req.user.id,
          image: url ? url : req.body.image,
          eachDetail: data0,
        },
        itineraryId
      );
      return res.send(itinerary);
    } catch (err) {
      console.log(err);
    }
  }

  async deleteDay(req, res) {
    try {
      const itinerary = await itineraryService.deleteDay(req.body.itineraryId, req.body.newValues);
      return res.send(itinerary);
    } catch (err) {
      console.log(err);
    }
  }

  async deleteItinerary(req, res) {
    try {
      const itinerary = await ItineraryModel.findById(req.params.itinerary);

      if (!itinerary) {
        return res.status(400).json({ message: "Itinerary not found or you or not authorized" });
      }
      if (itinerary.userId.toString() === req.user.id) {
        const itinerary = await itineraryService.deleteItinerary(req.params.itinerary);
        const query = {};

        query.userId = req.user.id;

        const itineraries = await itineraryService.getListing(query);

        if (itinerary.deletedCount === 1) {
          return res.json(itineraries);
        }

        return res.status(500).send({ message: "Something went wrong" });
      }

      return res.status(400).json({ message: "You are not authorized to delete this itinerary" });
    } catch (err) {
      console.log(err);
    }
  }
}

export default new Itinerary();
