// app/api/register/route.ts

import connectdb from "@/lib/database";
import User from "@/model/User";


export const POST =async(req: Request) =>{
  try {
    await connectdb()
    const { name, email, password, mobileNumber } = await req.json();

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ success: false, message: 'User already exists' }), { status: 400 });
    }

    // Save user to the database
    const newUser = new User({ name, email, password, mobileNumber });
    await newUser.save();

    return new Response(JSON.stringify({ success: true, message: 'User registered successfully' }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error }), { status: 500 });
  }
}
