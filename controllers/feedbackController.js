import Feedback from "../models/FeedbackModel.js";
import { StatusCodes } from "http-status-codes";

// Submit feedback
export const submitFeedback = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Message is required",
      });
    }

    const feedback = new Feedback({ message: message.trim() });
    await feedback.save();

    res.status(StatusCodes.CREATED).json({
      message: "Feedback submitted successfully",
      feedback: {
        id: feedback._id,
        message: feedback.message,
        createdAt: feedback.createdAt,
      },
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Failed to submit feedback",
    });
  }
};

// Get all feedback (for admin use)
export const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 }).limit(100);

    res.status(StatusCodes.OK).json({
      feedback,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Failed to fetch feedback",
    });
  }
};
