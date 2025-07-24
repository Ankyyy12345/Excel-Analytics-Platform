import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: "string",
      required: true,
    },
    email: {
      type: "String",
      required: true,
      unique: true,
    },
    password: {
      type: "String",
      required: true,
    },
    role: {
      type: "String",
      default: "user",
    },
    file: {
        type: "String",
    }
  },
  { timestamps: true }
);

const User =  mongoose.models?.User || mongoose.model("User", userSchema);
export default User;