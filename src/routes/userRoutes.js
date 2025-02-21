const express = require("express");
const { registerUser, getUserProfile, getUserScore } = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerUser);
router.get("/profile/:address", getUserProfile);
router.get("/score/:address", getUserScore);

module.exports = router;
