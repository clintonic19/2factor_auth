const express = require("express");
const passport = require('passport');
const { registerUser, loginUser, logoutUser, userStatus, setup2fa, verify2fa, reset2fa } = require("../controllers/authControllers");
const { protected } = require("../middlewares/protectedRoute");

const router = express.Router()

//REGISTRATION ROUTE
router.post("/register", registerUser );

//LOGIN ROUTE
router.post("/login", passport.authenticate('local'), loginUser );

//LOGOUT ROUTE
router.post("/logout", logoutUser );

// STATUS ROUTE
router.get("/status", userStatus );


//2FA setup
router.post("/2fa/set-up", protected, setup2fa );

//VERITY 2FA
router.post("/2fa/verify", protected, verify2fa );

// RESET 2FA
router.post("/2fa/reset", protected, reset2fa );


module.exports = router;
