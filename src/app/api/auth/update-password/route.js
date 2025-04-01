import { connectDB } from "@/lib/mongoClient";
import bcrypt from "bcryptjs";

export const POST = async (req) => {
  try {
    const { token, newPassword } = await req.json();
    const db = await connectDB();
    const users = db.collection("users");

    console.log("token found", token);

    const user = await users.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }, // Fix: Ensure token is still valid
    });

    if (!user) {
      return new Response(
        JSON.stringify({ message: "Invalid or expired token" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await users.updateOne(
      { email: user.email },
      {
        $set: { password: hashedPassword },
        $unset: { resetToken: "", resetTokenExpiry: "" }, // Remove token fields after reset
      }
    );

    return new Response(
      JSON.stringify({ message: "Password updated successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
