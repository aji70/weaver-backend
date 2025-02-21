const User = require("../models/User");

const registerUser = async (req, res) => {
    try {
        const { address, username } = req.body;

        if (!address || !username) {
            return res.status(400).json({ message: "Address and username are required" });
        }

        const existingUser = await User.findOne({ address });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = new User({ address, username });
        await user.save();

        res.status(201).json({
            message: "User registered successfully",
            user,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findOne({ address: req.params.address });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            address: user.address,
            username: user.username,
            createdAt: user.createdAt,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const getUserScore = async (req, res) => {
    try {
        const user = await User.findOne({ address: req.params.address });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            address: user.address,
            score: user.score,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports = {
    registerUser,
    getUserProfile,
    getUserScore,
};
