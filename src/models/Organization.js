const mongoose = require("mongoose");


const organizationSchema =  new mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
   tier: {
    type: String,
    enum: ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'],
    default: 'BRONZE'
  },
    socialLinks: {
    website: String,
    twitter: String,
    discord: String,
    telegram: String
  },
  nftRewards: [{
    type: Schema.Types.ObjectId,
    ref: 'NFT'
  }]
},
{ timestamps: true }
);

module.exports = mongoose.model("Organization", organizationSchema);

