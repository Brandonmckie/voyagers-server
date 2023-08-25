import mongoose, { Schema, model } from "mongoose";
import hashPassword from "../utils/hashPassword.js";

const UserSchema = new Schema({
  username: { type: Schema.Types.String, required: true },
  email: { type: Schema.Types.String, required: true, select: true },
  password: { type: Schema.Types.String, required: true, select: false },
  accountId: { type: Schema.Types.String, select: false },
  isCompleted: { type: Schema.Types.Boolean },
  role: {
    type: Schema.Types.String,
    enum: ["user", "seller"],
    default: "user",
  },
  image: { type: Schema.Types.String },
  boughtItineraries: [{ type: Schema.Types.ObjectId, ref: "Itinerary" }],
  stripeConnected: { type: Schema.Types.Boolean, default: false },
  code: { type: Schema.Types.Number },
  userInfo: {
    name: {
      type: Schema.Types.String,
    },
    voyageStyle: [Schema.Types.String],
    country: Schema.Types.String,
    visitedCountries: [{ label: Schema.Types.String, value: Schema.Types.String }],
    visitedWonders: [{ label: Schema.Types.String, value: Schema.Types.String }],
    bio: Schema.Types.String,
  },
});

// Hash the user's password before saving it
UserSchema.pre("save", hashPassword);

export default model("User", UserSchema);
