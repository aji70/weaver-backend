const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        address: {
            type: String,
            required: true,
            unique: true,
        },
        username: {
            type: String,
            required: true,
        },

        score: { 
            type: Number, 
            default: 0 
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
