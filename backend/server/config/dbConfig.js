const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

// SETTING UP MONGO DB CONNECTION
const connectDB = async () => {

    try {
       const conn = await mongoose.connect(process.env.MONGO_URI, {
        });

        console.log(`Database connected: ${conn.connection.name}`);
   
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);    
    }
};

module.exports = connectDB;


