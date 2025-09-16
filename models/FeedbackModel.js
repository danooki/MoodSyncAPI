import mongoose from "mongoose";
const { Schema } = mongoose;

const FeedbackSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
      maxlength: [500, "Feedback message must be under 500 characters ;)"],
    },
  },
  { timestamps: true }
);

const Feedback = mongoose.model("Feedback", FeedbackSchema);
export default Feedback;
