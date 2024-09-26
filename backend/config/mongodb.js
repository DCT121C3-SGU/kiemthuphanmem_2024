import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        console.log("db connected");
    });

    await mongoose.connect(`${process.env.MONGODB_URI}`, {
        dbName: 'cafewebsite',  // Specify the database name here
    });
};

export default connectDB;
