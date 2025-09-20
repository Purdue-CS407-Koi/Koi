import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AuthInput } from "../components/sign_in/authInput";

export const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Signing up with ${email}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-6 border rounded-lg shadow-md max-w-sm w-full bg-white text-center">
        <h1 className="text-2xl font-bold mb-2">Create an account</h1>
        <p className="text-sm text-gray-600 mb-4">Sign up to get started.</p>

        <form onSubmit={handleSignUp}>
          <AuthInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />

          <AuthInput
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4 text-center">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-600 hover:underline">
            Sign in here.
          </Link>
        </p>
      </div>
    </div>
  );
};
