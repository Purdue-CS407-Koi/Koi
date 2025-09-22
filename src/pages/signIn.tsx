import { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate, Link } from "@tanstack/react-router";
import { AuthInput } from "../components/sign_in/authInput";
import logo from "../assets/logo.png";
import supabase from "../helpers/supabase";

export const SignInPage = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error);
    };

    if (data && data.user) {
      setUser(data.user);
      navigate({ to: "/" });
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
      <div className="w-full max-w-sm"  style={{ 
          textAlign: "center",
          minWidth: "500px", 
          width: "100%",
          padding: "0 1rem" 
        }}>
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
            Log in to your account
          </h1>
          <p
            className="text-sm text-gray-600"
            style={{ textAlign: "center", margin: "0 auto" }}
          >
            Welcome back! Please enter your details.
          </p>
        </div>

        <div className="space-y-4 mb-6" style={{ textAlign: "left" }}>
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
              onClick={handleSignIn}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              style={{ margin: "0 auto", width: "100%" }}
            >
              Sign In
            </button>
          </div>
        </div>

        <p
          className="text-sm text-gray-600"
          style={{ textAlign: "center", margin: "0 auto" }}
        >
          Don't have an account?{" "}
          <Link to="/signUp" className="text-blue-600 hover:underline">
            Sign up here.
          </Link>
        </p>
      </div>
    </div>
  );
};
