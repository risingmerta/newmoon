import { connectDB } from "@/lib/mongoClient";
import bcrypt from "bcrypt";

export const POST = async (req) => {
  try {
    const { token, newPassword } = await req.json();
    const db = await connectDB();
    const users = db.collection("users");

    const user = await users.findOne({
      resetToken: "dc1c095078e8fe32f7b99a8885956e6a1c1868b6b5d9372625f714271774f813",
      resetTokenExpiry: { $gt: new Date() }, // Fix: Ensure token is still valid
    });

    if (!user) {
      return new Response(JSON.stringify({ message: "Invalid or expired token" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
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
