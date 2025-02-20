const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Rotas chamando as funções do controller
router.post("/register", userController.registerUser);
router.get("/profile/:address", userController.getUserProfile);
router.get("/score/:address", userController.getUserScore);

module.exports = router;
