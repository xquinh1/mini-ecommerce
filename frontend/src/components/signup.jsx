import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agree) {
      setError("You must agree to the Terms and Privacy Policies.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          role: "user",
        }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        setError(error || "Registration failed.");
        setLoading(false);
        return;
      }

      navigate("/login");
    } catch (err) {
      setError("Something went wrong.");
      setLoading(false);
    }
  };

  // Icons (Heroicons/Outline SVGs)
  const EyeIcon = ({ open }) =>
    open ? (
      // Eye open
      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M1.458 12C2.732 7.943 6.523 5 12 5c5.477 0 9.268 2.943 10.542 7-.955 2.987-3.231 5.523-6.334 6.572M15 19a7 7 0 01-7-7 7 7 0 017-7v0a7 7 0 017 7 7 7 0 01-7 7zm-3-3a4 4 0 006.828-2.828A4 4 0 0012 7a4 4 0 00-3 6.172"
        />
      </svg>
    ) : (
      // Eye closed
      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.875 18.825A10.05 10.05 0 0112 19c-5.477 0-9.268-2.943-10.542-7a10.056 10.056 0 012.527-4.378M6.18 6.178A9.956 9.956 0 0112 5c5.477 0 9.268 2.943 10.542 7a10.06 10.06 0 01-4.584 5.706M3 3l18 18"
        />
      </svg>
    );

  // Social Icons (can be replaced with SVGS or img)
  const social = [
    {
      name: "Google",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 48 48">
          <g>
            <path
              d="M44.5 20H24v8.5h11.7C34.7 32.9 30.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 8 2.9l6-6C34.1 5.1 29.3 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.5 20-21 0-1.3-.1-2.7-.3-4z"
              fill="#fbbc05"
            />
            <path
              d="M6.3 14.7l7 5.1C15.9 16.1 19.6 13 24 13c3 0 5.8 1.1 8 2.9l6-6C34.1 5.1 29.3 3 24 3c-7.3 0-13.7 3.4-17.7 8.7z"
              fill="#ea4335"
            />
            <path
              d="M24 45c5.2 0 10-1.8 13.7-4.9l-6.4-5.2c-2.1 1.5-4.8 2.3-7.3 2.3-6.2 0-11.3-3.7-13.3-9z"
              fill="#34a853"
            />
            <path
              d="M44.5 20H24v8.5h11.7c-1.1 3.1-4.3 7.5-11.7 7.5-4.5 0-8.2-1.5-10.7-4z"
              fill="#4285f4"
            />
          </g>
        </svg>
      ),
    },
    {
      name: "GitHub",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path
            d="M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 9.8 8.207 11.387 0.6 0.113 0.793-0.262 0.793-0.583 0-0.287-0.012-1.244-0.018-2.256-3.338 0.726-4.042-1.61-4.042-1.61-0.546-1.387-1.332-1.756-1.332-1.756-1.088-0.744 0.082-0.729 0.082-0.729 1.204 0.084 1.839 1.237 1.839 1.237 1.07 1.834 2.809 1.304 3.495 0.997 0.109-0.775 0.419-1.305 0.762-1.606-2.665-0.304-5.467-1.334-5.467-5.932 0-1.31 0.469-2.381 1.236-3.221-0.124-0.303-0.535-1.523 0.117-3.176 0 0 1.008-0.323 3.301 1.23 0.96-0.267 1.989-0.399 3.012-0.404 1.023 0.005 2.052 0.137 3.013 0.404 2.291-1.553 3.297-1.23 3.297-1.23 0.653 1.653 0.242 2.873 0.119 3.176 0.769 0.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.625-5.479 5.921 0.43 0.372 0.823 1.104 0.823 2.225 0 1.606-0.015 2.903-0.015 3.296 0 0.324 0.192 0.699 0.799 0.58C20.565 21.796 24 17.298 24 12c0-6.627-5.373-12-12-12z"
          />
        </svg>
      ),
    },
    {
      name: "Twitter",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path
            d="M24 4.557a9.94 9.94 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.194A4.92 4.92 0 0 0 16.616 3c-2.736 0-4.956 2.225-4.956 4.963 0 .39.044.765.127 1.124C7.728 8.863 4.1 7.05 1.671 4.149c-.427.735-.672 1.59-.672 2.499 0 1.723.877 3.242 2.213 4.131a4.904 4.904 0 0 1-2.246-.618v.06c0 2.405 1.71 4.413 3.977 4.866-.418.112-.86.171-1.316.171-.322 0-.635-.03-.94-.086.636 1.98 2.478 3.421 4.66 3.461a9.874 9.874 0 0 1-6.102 2.109c-.396 0-.786-.024-1.171-.069A13.93 13.93 0 0 0 7.548 21c9.142 0 14.307-7.721 14.307-14.417 0-.219 0-.436-.016-.653A10.243 10.243 0 0 0 24 4.557z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl w-full bg-white shadow-xl rounded-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Illustration Section */}
        <div className="md:w-1/2 bg-gray-50 flex flex-col justify-center items-center p-8 relative">
          <div className="bg-gray-100 rounded-xl flex flex-col items-center justify-center w-full h-full min-h-[340px]">
            {/* Illustration */}
            <img
              src="https://illustrations.popsy.co/gray/work-from-home.svg"
              alt="Sign up"
              className="w-56 mx-auto mb-8"
              draggable="false"
            />
            {/* Slider dots */}
            <div className="flex space-x-2 mt-4 mb-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full" />
              <span className="w-2 h-2 bg-gray-300 rounded-full" />
              <span className="w-2 h-2 bg-gray-300 rounded-full" />
            </div>
          </div>
        </div>

        {/* Register Form Section */}
        <div className="md:w-1/2 p-8 flex flex-col relative">
          {/* Logo top right */}
          <div className="flex justify-end mb-4">
            <div className="flex items-center gap-2">
              <svg className="w-7 h-7 text-blue-600" viewBox="0 0 32 32" fill="currentColor">
                <circle cx="16" cy="16" r="15" className="text-blue-100" fill="#e0e7ff"/>
                <circle cx="16" cy="16" r="8" className="text-blue-600" fill="#2563eb"/>
              </svg>
              <span className="font-bold text-lg tracking-tight text-gray-800">Your Logo</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Sign up</h2>
          <p className="text-gray-500 mb-6">Create your account to get started</p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 font-medium text-gray-700" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <label className="block mb-1 font-medium text-gray-700" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-200 pr-10"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-9 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPassword((v) => !v)}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
            <div className="relative">
              <label className="block mb-1 font-medium text-gray-700" htmlFor="confirm-password">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-200 pr-10"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                tabIndex={-1}
                aria-label={showConfirm ? "Hide password" : "Show password"}
                className="absolute right-3 top-9 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setShowConfirm((v) => !v)}
              >
                <EyeIcon open={showConfirm} />
              </button>
            </div>
            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <label htmlFor="terms" className="text-sm leading-5 text-gray-600">
                I agree to the{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policies
                </a>
              </label>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md py-2 px-3 text-xs text-red-600">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-md bg-blue-600 text-white font-medium py-2.5 mt-2 transition flex items-center justify-center gap-2 ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
              style={{ minHeight: 44 }}
            >
              {loading ? (
                <svg className="w-5 h-5 animate-spin text-white" viewBox="0 0 24 24">
                  <circle
                    className="opacity-30"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-90"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              ) : null}
              Sign up
            </button>
          </form>
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-200" />
            <span className="mx-3 text-gray-400 text-sm font-medium">Or Sign up with</span>
            <div className="flex-grow border-t border-gray-200" />
          </div>
          <div className="flex justify-center gap-4 mb-4">
            {social.map(({ name, icon }) => (
              <button
                key={name}
                type="button"
                className="border border-gray-200 rounded-md w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-50 shadow-sm transition"
                aria-label={name}
              >
                {icon}
              </button>
            ))}
          </div>
          <div className="text-center text-sm mt-auto">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline font-medium">
              Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;