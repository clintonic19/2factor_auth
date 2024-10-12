const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const speakeasy = require('speakeasy');
const qrCode = require('qrcode');
const jwt = require('jsonwebtoken');


// REGISTER USER AUTH
const registerUser = async(req, res) => {
    try {
        const { email, password } = req.body
        // const genSalt = bcrypt.genSalt(10)
        // const hashPassword = await bcrypt.hash(password, genSalt)
       
        const user = new User({
            email,
            password,
            is2FaActive: false,
        });
        console.log('New user', user);
        await User.create(user);
        return res.status(201).json({ message: 'User Registered Successfully', user});
    } catch (error) {
        res.status(500).json({ error: 'Error Registering User', message: error.message})   
    }
}


//LOGIN FUNCTION
const loginUser = async(req, res) => {
    try {
        // console.log('Login User', req.body)
        res.status(200).json({ message: 'User Logged In Successfully',
            email: req.user.email,
            is2FaActive: req.user.is2FaActive,
        })
    } catch (error) {
        res.status(500).json({ error: 'Unable to Login User', message: error.message})   
    }       
    }
  

// LOGOUT USER FUNCTION
const logoutUser = async(req, res) => {
    try {
        if(!req.user)
            res.status(401).json({ error: 'Already Logout', message: error.message})
        req.logout((err) =>{
            if(err) return res.status(400).json({ err: 'Please Login to Logout', message: err.message});
            res.status(200).json({ message: 'Logout Successful' });
        });

    } catch (error) {
        res.status(500).json({ error: 'Unable to Login User', message: error.message})
    }
}

// CHECK STATUS
const userStatus = async(req, res) => {
    try {
        if(req.user){
            res.status(200).json({
                message: 'User status is Verified',
                email: req.user.email,
                is2FaActive: req.user.is2FaActive,
            });
        } else{
            res.status(401).json({ message: "Unauthorized User, Please Login to Continue"})
        }
    } catch (error) {
        res.status(401).json({ error: 'Access Denied Please verify status', message: error.message})   
        
    }
}

// SETUP 2FA AUTH FUNCTION
const setup2fa = async(req, res) => {
    try {
        const user = req.user;
        let secret = speakeasy.generateSecret();
        user.twoFactorSecret = secret.base32;
        user.is2FaActive = true;
        await user.save();

        // INJECTING THE QRCODE AND THE TOKEN
        const url = speakeasy.otpauthURL({
            secret: secret.base32,
            label: `${req.user.email}`,
            issuer: "www.innovatonhub.com",
            encoding: "base32"
        })
        const qrCodeImageUrl = await qrCode.toDataURL(url)
        res.status(200).json({ message: '2FA Setup Successful', qrCode: qrCodeImageUrl });
    } catch (error) {
        res.status(500).json({ error: 'Error Setting up 2FA', message: error.message})
    }   
}

// VERIFY 2FA AUTH
const verify2fa = async(req, res) => {
    try {
        const { token } = req.body;
        const user = req.user;

// VERIFY TIME BASE OTP
        const verify = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token
        });

        // CHECK TO VERIFY 2FA AUTH...

        if(verify){
            const jwtToken = jwt.sign({email: user.email }, process.env.JWT_SECRET,
                { expiresIn: "1h" }
            )
            res.json({ message: '2FA Verification Successful', token: jwtToken });
        } else{
            res.status(401).json({ message: "Invalid 2FA Verification Token" })
        }        
    } catch (error) {
        res.status(500).json({ error: 'Error Setting up 2FA Verification', message: error.message})
    };
};

// RESET 2FA AUTH
const reset2fa = async(req, res) => {
    try {
        const user = req.user;
        user.twoFactorSecret = "";
        user.is2FaActive = false
        await user.save();
        res.status(200).json({ message: '2FA Reset Successful' });
    } catch (error) {
        res.status(500).json({ error: 'Error Setting up 2FA Reset', message: error.message})       
    }
};

module.exports = {
    registerUser, loginUser, logoutUser, userStatus, setup2fa, verify2fa, reset2fa 
}