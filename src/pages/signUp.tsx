import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { AuthInput } from "../components/sign_in/authInput";
import logo from "../assets/logo.png";
import supabase from "../helpers/supabase";

export const SignUpPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          display_name: fullName,
        },
      },
    });

    if (error) {
      alert(error);
    }

    if (data) {
      alert("Sign up successful!");
      navigate({ to: "/signIn" });
    }
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
          minWidth: "500px",
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
            label="Name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your name"
          />
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
          <Link to="/signIn" className="text-blue-600 hover:underline">
            Sign in here.
          </Link>
        </p>
      </div>
    </div>
  );
};
