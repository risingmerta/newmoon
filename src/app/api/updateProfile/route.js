import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next"; // Ensure it's correctly imported
import { connectDB } from "@/lib/mongoClient";
import { hash } from "bcryptjs";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions); // No req parameter needed in App Router!

    if (!session || !session.user || !session.user.id) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 403 });
    }

    const body = await req.json();
    const { userId, email, username, password, avatar } = body;

    if (session.user.id !== userId) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 403 });
    }

    const db = await connectDB();
    const users = db.collection("users");

    // Prepare the update data
    const updateData = { email, username, avatar };

    // Hash the password if updating
    if (password) {
      updateData.password = await hash(password, 10);
    } 

    // Update user in MongoDB
    const result = await users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );

    if (result.modifiedCount > 0) {
      session.user.avatar = avatar;
      session.user.email = email;
      session.user.username = username;
    }

    return new Response(JSON.stringify({ message: "Profile updated successfully" }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}
