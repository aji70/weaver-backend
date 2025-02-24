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
        reputationScore: {
            type: Number,
            default: 0
        },
        verifiedActions: [{
        type: Schema.Types.ObjectId,
        ref: 'Reputation'
        }],
        ownedNFTs: [{
        type: Schema.Types.ObjectId,
        ref: 'NFT'
          }],
  },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
