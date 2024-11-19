import mongoose from "mongoose";
const connectdb = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
    }
    await mongoose.connect(process.env.MONGO_URI, {
      // todo: change db name
      dbName: "CarRental"
    })
    console.log("mongodb is successfully connected");
  } catch (error) {
    console.log("mongodbv not connected successfully");
  }
}
export default connectdb