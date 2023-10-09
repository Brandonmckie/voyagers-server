import mongoose from "mongoose";

const ItinerarySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    country: { type: mongoose.Schema.Types.String },
    title: { type: mongoose.Schema.Types.String },
    price: { type: mongoose.Schema.Types.String },
    introduction: { type: mongoose.Schema.Types.String },
    image: { type: mongoose.Schema.Types.String },
    salesPitch: { type: mongoose.Schema.Types.String },
    // details: { type: mongoose.Schema.Types.String, required: true },
    category: [
      {
        type: mongoose.Schema.Types.String,
        enum: ["stay", "taste", "vibe", "experience"],
        required: true,
      },
    ],
    eachDetail: [
      {
        day: { type: mongoose.Schema.Types.Number },
        dayTitle: { type: mongoose.Schema.Types.String },
        stayDescription: { type: mongoose.Schema.Types.String },
        stayImages: [{ type: mongoose.Schema.Types.String }],
        tasteImages: [{ type: mongoose.Schema.Types.String }],
        tasteDescription: { type: mongoose.Schema.Types.String },
        vibeDescription: { type: mongoose.Schema.Types.String },
        vibeImages: [{ type: mongoose.Schema.Types.String }],
        experienceDescription: { type: mongoose.Schema.Types.String },
        highlights: { type: mongoose.Schema.Types.String },
        experienceImages: [{ type: mongoose.Schema.Types.String }],
        services: [
          {
            type: mongoose.Schema.Types.String,
            enum: ["room service", "wifi", "mini bar", "bath tub & shower"],
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Itinerary", ItinerarySchema);
