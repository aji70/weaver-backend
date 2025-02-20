const User = require("../models/User");

const registerUser = async (req, res) => {
    try {
        const existingUser = await User.findOne({ address: req.body.address });
        if(existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findOne({ address: req.params.address });
        
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserScore = async (req, res) => {
    try {
        const user = await User.findOne({ address: req.params.address });
        if(!user) {
            return res.status(404).json({ message: "User not found "});
        }
        res.json({ address: user.address, score: user.score });
    } catch(error) {
        res.status(500).json({message: error.message });
    }
};

module.exports = {
    registerUser,
    getUserProfile,
    getUserScore,
};