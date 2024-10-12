const express = require('express');

// PROTECTED ROUTE
const protected = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    res.status(401).json({ error: 'Please Login to access this route' });
}

module.exports = { protected };