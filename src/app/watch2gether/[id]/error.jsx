"use client"
import { useRouter } from "next/navigation";

const ErrorPage = ({ error }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">Oops! Something went wrong.</h1>
      <p className="text-lg mt-2 text-red-400">{error ? error.message : "Unknown error occurred."}</p>
      <button
        onClick={() => router.push("/")}
        className="mt-5 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
      >
        Go Back Home
      </button>
    </div>
  );
};

export default ErrorPage;
