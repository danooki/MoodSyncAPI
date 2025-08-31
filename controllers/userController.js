import User from "../models/UserModel.js";
import { getMyCircle } from "../services/circleService.js";
import { questions } from "../config/dailyQuestions.js";

// Helper function to check if all questions are answered
const checkAllQuestionsAnswered = (answeredQuestions) => {
  const totalQuestions = Object.keys(questions).length;
  const answeredCount = answeredQuestions?.length || 0;
  return {
    allAnswered: answeredCount >= totalQuestions,
    answeredCount,
    totalQuestions,
    remainingCount: Math.max(0, totalQuestions - answeredCount),
  };
};

// Helper function to get detailed questions information
const getDetailedQuestionsInfo = (userDailyScore) => {
  const answeredQuestions = userDailyScore?.answeredQuestions || [];
  const questionsStatus = checkAllQuestionsAnswered(answeredQuestions);

  // Get detailed info about each question
  const questionsDetail = Object.keys(questions).map((questionId) => {
    const question = questions[questionId];
    const isAnswered = answeredQuestions.includes(questionId);

    return {
      id: questionId,
      text: question.text,
      isAnswered,
      choices: Object.keys(question.choices).map((choiceId) => ({
        id: choiceId,
        text: question.choices[choiceId].text,
        points: question.choices[choiceId].points,
      })),
    };
  });

  return {
    summary: questionsStatus,
    details: questionsDetail,
  };
};

// GET ME - Returns comprehensive user information
const getMe = async (req, res) => {
  try {
    // Get user data (excluding password)
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get user's circle information
    const circle = await getMyCircle(req.userId);

    // Get detailed questions information
    const questionsInfo = getDetailedQuestionsInfo(user.dailyScore);

    // Prepare response with organized structure
    const response = {
      message: `This is all the information about user "${user.displayName}".`,

      // 1. MAIN USER INFO
      user: {
        id: user._id,
        displayName: user.displayName,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },

      // 2. CIRCLE INFO (if applicable)
      circle: circle
        ? {
            id: circle._id,
            name: circle.circleName,
            isOwner: circle.owner.toString() === req.userId.toString(),
            memberCount: circle.members.length,
            createdAt: circle.createdAt,
          }
        : null,

      // 3. DAILY QUESTIONS SUMMARY
      dailyQuestions: {
        summary: questionsInfo.summary,
        currentScore: user.dailyScore || null,
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Error in getMe:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { getMe };
