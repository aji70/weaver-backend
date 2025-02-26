const mongoose = require("mongoose");


const reputationSchema =  new mongoose.Schema({
   user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  action: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  proof: {
    type: String,
    require: true,
  },
    verificationStatus: {
    type: String,
    enum: ['PENDING', 'VERIFIED', 'REJECTED'],
    default: 'PENDING'
  },
  verifiedAt: Date,
  verifiedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  organization: {
    type: Schema.Types.ObjectId,
    ref: 'Organization'
  }
},
{ timestamps: true }
);

module.exports = mongoose.model("Reputation", reputationSchema);
