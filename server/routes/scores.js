const express = require("express");
const jwt = require("jsonwebtoken"); 
const User = require("../models/user");
const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader; 
  console.log(req.headers);
  console.log("body:--------------------\n",req.body);

  console.log("Verifying token", token);
  if (!token) return res.status(401).send("Access Denied");

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
        console.log("reached here");
        console.log(err);
        return res.status(403).send(err);
      }
    console.log(user);
    req.user = user;
    next();
  });
};

// get high score
router.get("/highscore", verifyToken, async (req, res) => {
  try {
  
    const user = await User.findById(req.user.id);
    console.log(user);
    if (!user) return res.status(404).send("User not found");

    res.json({ highScore: user.highScore });
  } catch (error) {
    console.error("Error fetching high score:", error);
    res.status(500).send("Error fetching high score");
  }
});

// Update high score
router.post("/highscore", verifyToken, async (req, res) => {
  const { score } = req.body;
  console.log(score);
  console.log("here score" + score);
  try {
    const user = await User.findById(req.user.id);
    console.log("post highscore user: " + user);
    if (!user) return res.status(404).send("User not found");

    if (score > user.highScore) {
      user.highScore = score;
      await user.save();
      console.log("saved");
      res.send("High score updated");
    } else {
      res.send("No new high score");
    }
  } catch (error) {
    console.error("Error updating high score:", error);
    res.status(500).send("Error updating high score");
  }
});

module.exports = router;
