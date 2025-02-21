const mongoose = require("mongoose");
const config = require("./config");
//Make database connection here
const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        //log success message
        console.log("MongoDB connected successfully");
    } catch (error) {
        //catch errors here
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};
module.exports = connectDB;
