const express = require("express");
const passport = require('passport');
const passportLocal = require('passport-local');
const cors = require('cors');
const session = require('express-session');
const dotenv = require('dotenv')
const connectDB = require('./server/config/dbConfig')
const authRoutes = require('./server/routes/authRoutes')
require('./server/config/passportConfig')

// Load environment variables from .env file
dotenv.config()

// INITIALIZING APP
const app = express();

//CONNECT DB
connectDB();

//MIDDLEWARES
const corsOption = {
    origin: ["http://localhost:8001"],
    credentials: true,
};

app.use(cors(corsOption))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({
    secret: process.env.SESSION_SECRET || secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000 * 60,
    }
}));

app.use(passport.initialize());
app.use(passport.session());

//ROUTES
app.use('/api/auth', authRoutes)

//LISTEN APP PORT
const PORT =  process.env.PORT || 9000

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
});

