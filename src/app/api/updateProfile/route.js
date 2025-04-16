import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { connectDB } from "@/lib/mongoClient";
import { hash } from "bcryptjs";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session?.user?.id) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 403 });
    }

    const body = await req.json();
    const { userId, email, username, password, avatar } = body;

    if (session?.user?.id !== userId) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 403 });
    }

    const updateData = {};
    if (email) updateData.email = email;
    if (username) updateData.username = username;
    if (avatar) updateData.avatar = avatar;
    if (password && password.trim() !== "") {
      updateData.password = await hash(password, 10); // Only hash if password is provided
    }

    // If no changes, return early
    if (Object.keys(updateData).length === 0) {
      return new Response(JSON.stringify({ message: "No changes detected" }), { status: 400 });
    }

    const db = await connectDB();
    const users = db.collection("users"); 

    // Update user in MongoDB 
    const result = await users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );

    if (result.modifiedCount > 0) {
      if (avatar) session.user.avatar = avatar;
      if (email) session.user.email = email;
      if (username) session.user.username = username;
    }

    return new Response(JSON.stringify({ message: "Profile updated successfully" }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}
