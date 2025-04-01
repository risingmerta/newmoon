import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongoClient";
import { compare } from "bcryptjs";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongoClient";
import { imageData } from "@/data/imageData"; // Import imageData

// Function to get a random image from imageData
const getRandomImage = () => {
  const categories = Object.keys(imageData.hashtags);
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const images = imageData.hashtags[randomCategory].images;
  return images[Math.floor(Math.random() * images.length)];
};

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const db = await connectDB();
        const users = db.collection("users");

        const user = await users.findOne({ email: credentials.email });
        if (!user) throw new Error("User not found");

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid credentials");

        // Assign a random avatar if the user doesn't have one
        let avatar = user.avatar || getRandomImage();

        // Update the user record if they didn't have an avatar before
        if (!user.avatar) {
          await users.updateOne({ email: credentials.email }, { $set: { avatar } });
        }

        return {
          id: user._id,
          email: user.email,
          username: user.username,
          avatar,
          timeOfJoining: user.timeOfJoining, // Include timeOfJoining
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.avatar = user.avatar;
        token.timeOfJoining = user.timeOfJoining; // Include timeOfJoining in token
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.avatar = token.avatar;
      session.user.timeOfJoining = token.timeOfJoining; // Include timeOfJoining in session
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
