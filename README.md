# Multi-Factor Authentication (MFA)

This document provides a step-by-step guide for implementing Multi-Factor Authentication (MFA) using Time-Based One-Time Passwords (TOTP) in a web application. 

## The implementation includes the following features:
- User registration   - POST REQUEST
- User login          - POST REQUEST
- User logout         - POST REQUEST
- Checking login status - GET REQUEST
- Setting up a Time-Based Token (TOTP) - POST REQUEST
- Verifying the Time-Based Token (TOTP) - POST REQUEST
- Resetting the TOTP token  - POST REQUEST

## Language
- Backend Framework: Node.js 
- Database: MongoDB,
- Authentication:  jsonwebtoken for session management
- MFA Library: speakeasy for generating TOTP tokens

This documentation covers the essential features of implementing Multi-Factor Authentication (MFA) using TOTP. 
The flow includes user registration, login, logout, verifying, setting up and resetting MFA tokens.
