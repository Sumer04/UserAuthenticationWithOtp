// app/api/verify-otp/route.ts
import connectdb from '@/lib/database';
import User from '@/model/User';



export const POST=async(req: Request) =>{
  try {
    await connectdb();
    const { mobileNumber, otp } = await req.json();

    // Check if the user exists
    const user = await User.findOne({ mobileNumber });
    if (!user || user.otp !== otp || user.otpExpiresAt < new Date()) {
      return new Response(JSON.stringify({ success: false, message: 'Invalid or expired OTP' }), { status: 400 });
    }

    // OTP verified, clear OTP fields
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    // Create a session
    const sessionData = { userId: user._id, mobileNumber: user.mobileNumber };
    return new Response(JSON.stringify({ success: true, session: sessionData }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error }), { status: 500 });
  }
}
//1DW4NKM5NN6TXJTERXB2944Y twilio reovery code
