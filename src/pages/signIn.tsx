import { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";

import { useAuthStore } from "@/stores/useAuthStore";
import { AuthInput } from "@/components/sign_in/authInput";
import logo from "@/assets/logo.png";
import supabase from "@/helpers/supabase";

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
    <div className="flex fixed inset-0 items-center justify-center">
      <div className="w-full max-w-sm text-center min-w-xl px-4">
        <div className="w-full flex justify-center items-center mb-6 text-center">
          <img
            src={logo}
            alt="Koi Logo"
            className="w-20 h-auto block mx-auto"
          />
        </div>

        <div className="w-full mb-6 text-center">
          <h1 className="text-center mx-auto mb-2 text-4xl font-semibold">
            Log in to your account
          </h1>
          <p className="text-sm text-gray-600 text-center mx-auto">
            Welcome back! Please enter your details.
          </p>
        </div>

        <div className="space-y-4 mb-6 text-left">
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

          <div className="w-full flex justify-center text-center">
            <button
              onClick={handleSignIn}
              className={`w-full p-4 rounded-md
                bg-blue-600 hover:bg-blue-700 text-white
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                transition-colors mx-auto
              `}
            >
              Sign In
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-600 text-center mx-auto">
          Don't have an account?{" "}
          <Link to="/signUp" className="text-blue-600 hover:underline">
            Sign up here.
          </Link>
        </p>
      </div>
    </div>
  );
};
