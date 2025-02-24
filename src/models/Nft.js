const mongoose = require("mongoose");

const nftSchema =  new mongoose.Schema({
     tokenId: {
    type: String,
    required: true,
    unique: true
  },
  contractAddress: {
    type: String,
    require: true,
  },
    metadata: {
    name: String,
    description: String,
    image: String,
    attributes: [{
      trait_type: String,
      value: String
    }]
  },
  organization: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
},
{ timestamps: true }
);

module.exports = mongoose.model("Nft", nftSchema);
