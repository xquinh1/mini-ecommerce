import { useState } from "react"
import { Eye } from "lucide-react"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Login failed")

      localStorage.setItem("token", data.token)
      window.location.href = "/"
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        {/* LEFT */}
        <div className="px-16 py-12 flex flex-col justify-center">

          <div className="flex items-center gap-2 mb-8">
            <div className="w-6 h-6 bg-blue-600 rounded-full" />
            <span className="font-semibold text-gray-700">Your Logo</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Login
          </h2>

          <p className="text-gray-400 mb-6 text-sm">
            Login to access your travelwise account
          </p>

          <form onSubmit={handleLogin} className="space-y-4">

            <input
              type="email"
              placeholder="your email"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="relative">
              <input
                type="password"
                placeholder="**************"
                className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Eye className="absolute right-3 top-2.5 text-gray-400 w-4 h-4 cursor-pointer" />
            </div>

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 text-gray-500">
                <input type="checkbox" className="w-4 h-4" />
                Remember me
              </label>

              <a href="#" className="text-blue-600 hover:underline font-medium">
                Forgot Password
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-md text-white text-sm font-medium ${
                loading
                  ? "bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {error && (
              <p className="text-red-500 text-sm text-center">
                {error}
              </p>
            )}
          </form>

          <div className="text-sm text-center mt-6 text-gray-500">
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:underline font-medium">
              Sign up
            </a>
          </div>

          {/* divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-sm">
              Or login with
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* social */}
          <div className="flex gap-4 mt-4">
            <button className="flex-1 h-10 border rounded-md flex items-center justify-center overflow-hidden hover:bg-gray-50">
                <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" className="max-w-full max-h-full object-contain" />
            </button>

            <button className="flex-1 h-10 border rounded-md flex items-center justify-center overflow-hidden hover:bg-gray-50">
              <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" className="max-w-full max-h-full object-contain" />
            </button>

            <button className="flex-1 h-10 border rounded-md flex items-center justify-center overflow-hidden hover:bg-gray-50">
              <img src="https://cdn-icons-png.flaticon.com/512/0/747.png" className="max-w-full max-h-full object-contain" />
            </button>
          </div>

        </div>

        {/* RIGHT */}
        <div className="hidden md:flex items-center justify-center bg-gray-50 h-full">
          <div className="bg-gray-100 rounded-2xl p-10 flex flex-col items-center justify-center">
    
            <img
              src="https://illustrations.popsy.co/gray/work-from-home.svg"
              className="w-40 md:w-64 lg:w-80 max-w-full h-auto object-contain"
            />

            <div className="flex gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full" />
              <div className="w-2 h-2 bg-gray-300 rounded-full" />
              <div className="w-2 h-2 bg-gray-300 rounded-full" />
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default Login
