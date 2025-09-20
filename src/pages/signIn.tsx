
import { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate, Link } from "@tanstack/react-router";
import { AuthInput } from "../components/sign_in/authInput";

export const SignInPage = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    // Replace with Supabase `signInWithPassword` later
    setUser({ id: "test-user-123", email });
    navigate({ to: "/" });
  };

  return (
    <div>
      {/*</div><div className="flex items-center justify-center bg-gray-50">*/}
      {/* <div className="p-6 border rounded-lg shadow-md max-w-sm w-full bg-white"> */}
      <h1 className="text-2xl font-bold mb-1 text-center">
        Log in to your account
      </h1>
      <p className="text-sm text-gray-600 mb-6 text-center">
        Welcome back! Please enter your details.
      </p>

      {/* <div className="flex flex-col items-start mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div className="flex flex-col items-start mb-6">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div> */}
      {/* <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div> */}
      
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
        onClick={handleSignIn}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Sign In
      </button>

      <p className="text-sm text-gray-600 mt-4 text-center">
        Don’t have an account?{" "}
        <Link to="/signUp" className="text-blue-600 hover:underline">
          Sign up here.
        </Link>
      </p>
      {/* </div> */}
    </div>
  );
};
