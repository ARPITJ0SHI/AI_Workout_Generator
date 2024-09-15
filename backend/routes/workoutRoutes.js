const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../model/user");
const Workout = require("../model/workout");
const LoggedWorkout = require("../model/logWorkouts");


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/generate-workout", authMiddleware, async (req, res) => {
  try {
    const { prompt } = req.body;

    
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const finalPrompt = `
      Generate a workout routine for a user with the following profile:
      Age: ${user.age}
      Gender: ${user.gender}
      Height: ${user.height} cm
      Weight: ${user.weight} kg
      Fitness Goal: ${user.goal}
      Experience Level: ${user.experience}
      Available Equipment: ${user.equipment.join(", ")}
      Workout Type Preference: ${user.workoutType}
      Workout Frequency: ${user.workoutFrequency}
      Health Condition: ${user.healthCondition || "None"}
      
      User's request: ${prompt}
      
      Please provide a detailed workout routine including the following details ONLY:
      1. Workout name
      2. Duration
      3. Difficulty level
      4. A list of exercises with sets, reps, and weight:
      [
      Exercise:
      Sets:
      Reps:
      Weight:
      ]
      Ensure the workout is tailored to the user's profile and request.
    `;

    console.log("Final Prompt:", finalPrompt);

    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(finalPrompt);
    const response = await result.response.text();
    

    let cleanedResponse = response.split('\n')
      .map(line => line.replace(/\*/g, '').trim())
      .filter(line => line.length > 0)
      .join('\n');
    
    console.log("Cleaned Response:", cleanedResponse);

    res.json({ workout: cleanedResponse });
  } catch (error) {
    console.error("Error generating workout:", error);
    res.status(500).json({ error: "Failed to generate workout", details: error.message });
  }
});



router.post("/save-workout", authMiddleware, async (req, res) => {
  try {
    const { name, content, duration, difficulty } = req.body;
    const userId = req.user._id;

    const newWorkout = new Workout({
      user: userId,
      name,
      content,
      duration,
      difficulty
    });

    await newWorkout.save();

    res.status(201).json({ message: "Workout saved successfully", workout: newWorkout });
  } catch (error) {
    console.error("Error saving workout:", error);
    res.status(500).json({ error: "Failed to save workout", details: error.message });
  }
});

router.get("/saved-workouts", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const savedWorkouts = await Workout.find({ user: userId }).sort({ createdAt: -1 });
    res.json(savedWorkouts);
  } catch (error) {
    console.error("Error fetching saved workouts:", error);
    res.status(500).json({ error: "Failed to fetch saved workouts", details: error.message });
  }
});


router.get("/generated-workouts", authMiddleware, async (req, res) => {
  try {
    const generatedWorkouts = await Workout.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(generatedWorkouts);
  } catch (error) {
    console.error("Error fetching generated workouts:", error);
    res.status(500).json({ error: "Failed to fetch generated workouts", details: error.message });
  }
});


router.post("/log-workout", authMiddleware, async (req, res) => {
  try {
    const { name, date, duration, difficulty, exercises, notes } = req.body;
    const newLoggedWorkout = new LoggedWorkout({
      user: req.user._id,
      name,
      date,
      duration,
      difficulty,
      exercises,
      notes
    });

    await newLoggedWorkout.save();
    res.status(201).json({ message: "Workout logged successfully", workout: newLoggedWorkout });
  } catch (error) {
    console.error("Error logging workout:", error);
    res.status(500).json({ error: "Failed to log workout", details: error.message });
  }
});

router.get("/logged-workouts", authMiddleware, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10; 
    const loggedWorkouts = await LoggedWorkout.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(limit);
    res.json(loggedWorkouts);
  } catch (error) {
    console.error("Error fetching logged workouts:", error);
    res.status(500).json({ error: "Failed to fetch logged workouts", details: error.message });
  }
});
module.exports = router;