import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AuthInput } from "../components/sign_in/authInput";
import logo from "../assets/logo.png";

export const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Signing up with ${email}`);
  };

  return (
    <div
      className="fixed inset-0"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="w-full max-w-sm"
        style={{
          textAlign: "center",
          minWidth: "400px",
          width: "100%",
          padding: "0 1rem",
        }}
      >
        <div
          className="w-full flex justify-center items-center mb-6"
          style={{ textAlign: "center" }}
        >
          <img
            src={logo}
            alt="Koi Logo"
            className="w-20 h-auto"
            style={{ display: "block", margin: "0 auto" }}
          />
        </div>

        <div className="w-full mb-6" style={{ textAlign: "center" }}>
          <h1
            style={{
              textAlign: "center",
              margin: "0 auto 0.5rem auto",
              fontSize: "2.5rem",
              fontWeight: "600",
            }}
          >
            Create an account
          </h1>
          <p
            className="text-sm text-gray-600"
            style={{ textAlign: "center", margin: "0 auto" }}
          >
            Sign up to get started.
          </p>
        </div>

        <form
          onSubmit={handleSignUp}
          className="space-y-4 mb-6"
          style={{ textAlign: "left" }}
        >
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

          <div
            className="w-full flex justify-center"
            style={{ textAlign: "center" }}
          >
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              style={{ margin: "0 auto", width: "100%" }}
            >
              Sign Up
            </button>
          </div>
        </form>
        <p
          className="text-sm text-gray-600"
          style={{ textAlign: "center", margin: "0 auto" }}
        >
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-600 hover:underline">
            Sign in here.
          </Link>
        </p>
      </div>
    </div>
  );
};
