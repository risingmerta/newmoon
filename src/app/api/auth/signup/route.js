import { hash } from "bcryptjs";
import { connectDB } from "@/lib/mongoClient";
import { imageData } from "@/data/imageData";

// Function to get a random image from imageData
const getRandomImage = () => {
  const categories = Object.keys(imageData.hashtags);
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const images = imageData.hashtags[randomCategory].images;
  return images[Math.floor(Math.random() * images.length)];
};

export async function POST(req) {
  try {
    const db = await connectDB();
    const users = db.collection("users");

    const { email, username, password } = await req.json();

    if (!email || !username || !password) {
      return Response.json({ message: "All fields are required" }, { status: 400 });
    }

    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return Response.json({ message: "Email already in use" }, { status: 400 });
    }

    const existingUsername = await users.findOne({ username });
    if (existingUsername) {
      return Response.json({ message: "Username already taken" }, { status: 400 });
    }

    const hashedPassword = await hash(password, 10);
    const avatar = getRandomImage();
    const timeOfJoining = new Date(); // Store the timestamp when the user signs up

    await users.insertOne({ email, username, password: hashedPassword, avatar, timeOfJoining });

    return Response.json({ message: "User registered successfully", avatar, timeOfJoining }, { status: 201 });
  } catch (error) {
    return Response.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
