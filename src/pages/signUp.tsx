import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";

import { AuthInput } from "@/components/sign_in/authInput";
import logo from "@/assets/logo.png";
import { insertUserProfile } from "@/api/users";
import supabase from "@/helpers/supabase";

export const SignUpPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateInput = () => {
    setError("");

    if (!fullName || !email || !password) {
      setError("Please fill in all fields");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    return true;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateInput()) {
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            display_name: fullName,
          },
        },
      });

      if (authError) {
        if (
          authError.message.includes("already registered") ||
          authError.message.includes("User already registered")
        ) {
          setError(
            "This email is already registered. Please use a different email or try signing in instead."
          );
        } else if (authError.message.includes("Invalid email")) {
          setError("Please enter a valid email address");
        } else if (authError.message.includes("Password")) {
          setError(`Password error: ${authError.message}`);
        } else {
          setError(`Sign up failed: ${authError.message}`);
        }
        setIsLoading(false);
        return;
      }

      if (data.user) {
        try {
          await insertUserProfile(data.user.id, fullName);
          alert("Sign up successful! You can now sign in.");
          navigate({ to: "/signIn" });
        } catch (profileError: any) {
          console.error("Error creating user profile:", profileError);
          setError(
            "Account created but profile setup failed. Please try signing in."
          );
        }
      }
    } catch (unexpectedError: any) {
      console.error("Unexpected error:", unexpectedError);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="w-full max-w-sm text-center min-w-[500px] py-0 px-4">
        <div className="w-full flex justify-center items-center mb-6 text-center">
          <img
            src={logo}
            alt="Koi Logo"
            className="block w-20 h-auto my-0 mx-auto"
          />
        </div>

        <div className="w-full mb-6 text-center">
          <h1 className="text-center text-4xl font-semibold mt-0 mb-6 mx-auto">
            Create an account
          </h1>
          <p className="text-sm text-gray-600 text-center my-0 mx-auto">
            Sign up to get started.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="text-sm p-3 text-left rounded-lg mb-4 bg-error-bg text-error">
            {error}
            {error.includes("already registered") && (
              <div className="mt-2">
                <Link
                  to="/signIn"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Go to sign in page →
                </Link>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4 mb-6 text-left">
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
            placeholder="Enter your password (min. 6 characters)"
          />

          <div className="w-full flex justify-center text-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full px-4 py-2 rounded-md my-0 mx-auto
                bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                transition-colors disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>
          </div>
        </form>
        <p className="text-sm text-gray-600 text-center my-0 mx-auto">
          Already have an account?{" "}
          <Link to="/signIn" className="text-blue-600 hover:underline">
            Sign in here.
          </Link>
        </p>
      </div>
    </div>
  );
};
