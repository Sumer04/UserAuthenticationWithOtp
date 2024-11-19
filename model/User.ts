import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobileNumber: { type: String, required: true, unique: true },
  otp: { type: String }, // For storing OTP temporarily
  otpExpiresAt: { type: Date }, // OTP expiration time
});


export default mongoose.models.User || mongoose.model('User', UserSchema);
