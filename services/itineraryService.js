import Itinerary from "../models/Itinerary.js";
import User from "../models/User.js";
import { mediaUpload } from "../utils/amazonUpload.js";
import { v4 as uuidv4 } from "uuid";

class ItineraryService {
  async addItinerary(values) {
    try {
      let itinerary = await Itinerary.create(values);
      return itinerary;
    } catch (err) {
      console.log(err);
    }
  }

  async getListing(query, limit) {
    try {
      const itineraries = await Itinerary.find(query).populate("userId").limit(limit);

      // let filteredItineraries = itineraries.filter((each) => each.userId.stripeConnected);

      // let filteredItineraries = itineraries.filter((each) => {
      //   if (each.userId?.stripeConnected) {
      //     return each;
      //   }
      // });

      return itineraries;
    } catch (err) {
      console.log(err);
    }
  }

  async getSingleItinerary(id) {
    try {
      try {
        const itineraries = await Itinerary.findById(id).populate("userId");
        console.log("\n\n\n\n Itinerary data");
        return itineraries._doc;
      } catch (err) {
        console.log("\n\n\n\n Erorr", err);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteDay(id, data) {
    try {
      const itinerary = await Itinerary.findByIdAndUpdate(id, { $set: { eachDetail: data } });
      return itinerary;
    } catch (error) {
      console.log(error);
    }
  }

  parseImages(files, data) {
    let images = [];
    try {
      let eachDetail = JSON.parse(data.eachDetail);
      let data0 = eachDetail.map((each, idx) => {
        let objData = {
          stayImages: each.stayImages ? [...each.stayImages] : [],
          tasteImages: each.tasteImages ? [...each.tasteImages] : [],
          experienceImages: each.experienceImages ? [...each.experienceImages] : [],
          vibeImages: each.vibeImages ? [...each.vibeImages] : [],
          ...each,
        };

        files
          .filter((file) => file.fieldname !== "image")
          .map(async (file, idx) => {
            if (file.fieldname.includes(`eachDetail[${each.day}].stayImages[`)) {
              let filename;
              if (file?.originalname) {
                filename = file?.originalname;
              } else {
                filename = file[0]?.originalname;
              }
              let key = `uploads/${uuidv4()}-${filename}`;
              objData = {
                ...objData,
                stayImages: [
                  ...objData.stayImages,
                  `https://${process.env.S3_BUCKETNAME}.s3.amazonaws.com/${key}`,
                ],
              };
              images.push({ file, key });
            }

            if (file.fieldname.includes(`eachDetail[${each.day}].experienceImages[`)) {
              let filename;
              if (file?.originalname) {
                filename = file?.originalname;
              } else {
                filename = file[0]?.originalname;
              }
              let key = `uploads/${uuidv4()}-${filename}`;
              objData = {
                ...objData,
                experienceImages: [
                  ...objData.experienceImages,
                  `https://${process.env.S3_BUCKETNAME}.s3.amazonaws.com/${key}`,
                ],
              };
              images.push({ file, key });
              // await mediaUpload(file, key);
            }

            if (file.fieldname.includes(`eachDetail[${each.day}].vibeImages[`)) {
              let filename;
              if (file?.originalname) {
                filename = file?.originalname;
              } else {
                filename = file[0]?.originalname;
              }
              let key = `uploads/${uuidv4()}-${filename}`;
              objData = {
                ...objData,
                vibeImages: [
                  ...objData.vibeImages,
                  `https://${process.env.S3_BUCKETNAME}.s3.amazonaws.com/${key}`,
                ],
              };
              images.push({ file, key });
            }

            if (file.fieldname.includes(`eachDetail[${each.day}].tasteImages[`)) {
              let filename;
              if (file?.originalname) {
                filename = file?.originalname;
              } else {
                filename = file[0]?.originalname;
              }
              let key = `uploads/${uuidv4()}-${filename}`;
              objData = {
                ...objData,
                tasteImages: [
                  ...objData.tasteImages,
                  `https://${process.env.S3_BUCKETNAME}.s3.amazonaws.com/${key}`,
                ],
              };
              images.push({ file, key });
            }
          });

        return objData;
      });
      return { data0, images };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async updateItinerary(data, itineraryId) {
    try {
      // console.log("Data", data, "Data");
      const itinerary = await Itinerary.findByIdAndUpdate(itineraryId, { $set: data });

      // await itinerary.save();
      return itinerary;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async deleteItinerary(id, userId) {
    try {
      const itinerary = await Itinerary.deleteOne({ _id: id });
      return itinerary;
    } catch (err) {
      console.log(err);
    }
  }

  async TopCountries(id, userId) {
    try {
      const topCountries = await Itinerary.aggregate([
        {
          $group: {
            _id: "$country",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $limit: 5,
        },
      ]);
      return topCountries;
    } catch (err) {
      console.log(err);
    }
  }
  async singleuserItinerary(username) {
    let name = username.toLowerCase();
    try {
      let user = await User.findOne({ username: name });
      // console.log(user);
      const itinerary = await Itinerary.find({ userId: user._id }).populate("userId");
      // console.log(itinerary);
      return itinerary;
    } catch (err) {
      console.log(err);
    }
  }

  validateItineraryInput(data, files) {
    try {
      let errors = {};
      // validate Title
      if (!data.title || data.title?.trim() === "") {
        errors.title = "Title field shouldn't be empty";
      }

      // validate Country
      if (!data.country || data.country?.trim() === "") {
        errors.country = "Country field shouldn't be empty";
      }

      // validate Price
      // if (!data.price || data.price?.trim() === "") {
      //   errors.price = "Price field shouldn't be empty";
      // }

      // validate Introduction
      // if (!data.introduction || data.introduction?.trim() === "") {
      //   errors.introduction = "Introduction field shouldn't be empty";
      // }

      // validate Image
      if (!data.image && (!files || !files.find((each) => each.fieldname === "image"))) {
        errors.image = "Images shouldn't be empty";
      }

      // validate Sales Pitch
      // if (!data.salesPitch || data.salesPitch?.trim() === "") {
      //   errors.salesPitch = "Sales Pitch field shouldn't be empty";
      // }

      // validate category
      data.category = JSON.parse(data.category);
      if (!data.category || data.category.length < 1) {
        errors.category = "Category field shouldn't be empty";
      }

      return {
        errors,
        isValid: Object.keys(errors).length === 0,
        values: {
          country: data.country,
          price: data.price,
          category: data.category,
          introduction: data.introduction,
          salesPitch: data.salesPitch,
          image: data.image,
          eachDetail: data.eachDetail,
          title: data.title,
        },
      };
    } catch (error) {
      console.log(error);
    }
  }
}

export default new ItineraryService();
