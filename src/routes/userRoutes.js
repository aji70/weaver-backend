const express = require("express");
const { registerUser, getUserProfile, getUserScore, getAllUsers } = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerUser);
router.get("/profile/:address", getUserProfile);
router.get("/score/:address", getUserScore);
router.get("/users", getAllUsers);

module.exports = router;
