const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

// Middlewares
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Database connection (evitando conectar no ambiente de teste)
if (process.env.NODE_ENV !== "test") {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log("Connected to MongoDB"))
        .catch((err) => console.error("Could not connect to MongoDB:", err));

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

// Import routes
const userRoutes = require("./routes/userRoutes");
app.use("/api", userRoutes);
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/organizations", require("./routes/organizationRoutes"));
app.use("/api/reputation", require("./routes/reputationRoutes"));
app.use("/api/nfts", require("./routes/nftRoutes"));

module.exports = app;
