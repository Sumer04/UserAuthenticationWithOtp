import { NextResponse } from 'next/server';
import twilio from 'twilio';
import connectdb from '@/lib/database';
import User from '@/model/User';

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

const isValidPhoneNumber = (number: string): boolean => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
  return phoneRegex.test(number);
};

export const POST = async (req: Request) => {
  try {
    await connectdb();

    const { mobileNumber } = await req.json();

    // Validate phone number
    if (!isValidPhoneNumber(mobileNumber)) {
      return NextResponse.json(
        { success: false, message: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ mobileNumber });
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    // Send OTP
    await client.messages.create({
      body: `Your OTP is ${otp}. It is valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: '+15005550006',
    });

    return NextResponse.json({ success: true, message: 'OTP sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in /send-otp:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
};
