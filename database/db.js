import mongoose from 'mongoose';
const mongoURI= "mongodb://localhost:27017/urNotebook";
const connectToMongo = async() => {
    try {
          await mongoose.connect(mongoURI);
            console.log("Connected to MongoDB");
       }
    catch (error) {
        console.log("Error connecting to MongoDB:", error);    
    }
}; 
export {connectToMongo};
