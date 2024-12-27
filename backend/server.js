require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");

// Import routes
const authRoutes = require("../routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("../routes/adminRoutes");

const { errorHandler } = require("./middlewares/errorMiddleware");
const logger = require("./utils/logger");

// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());
require("../config/passport")(passport);

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => logger.info("MongoDB connected"))
    .catch((err) => logger.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
