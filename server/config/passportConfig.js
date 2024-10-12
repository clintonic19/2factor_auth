const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user');

passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: 'password'
  }, async (email, password, done) => {
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return done(null, false, { message: "User Not Found" });
        }
        const isMatchedPassword = await bcrypt.compare(password, user.password);
            if(isMatchedPassword){
                return done(null, user);
        }else{
            return done(null, false, { message: "Incorrect Email and Password" });
        }
    } catch (error) {
        return done(error);
        
    }
    }
  ));

//   PASSPORT SERIALIZATION SESSION
  passport.serializeUser( async (user, done) => {
    try {
        done(null, user.id);
        console.log('Serialize User Function');  
    } catch (error) {
        done(error)       
    }   
});

passport.deserializeUser(async(_id, done)=>{
    try {
        const user = await User.findById(_id)
        done(null, user);
        console.log('Deserialize User Function');   
    } catch (error) {
        done(error);    
    }  
});


