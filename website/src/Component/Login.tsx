import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartService } from "../lib/CartService";
import { toast } from "react-toastify";
import { FiMail, FiLock } from "react-icons/fi";

import { LogIn } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState<any>({
    email: "nitin@gmail.com",
    password: "123456",
  });
  const [errors, setErrors] = useState<any>({});
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!form.email) {
      setErrors({ username: "Please enter email" });
      return;
    }
    if (form.password.length < 6) {
      setErrors({ password: "please enter password of (MIN length 6)" });
    }

    if (!form.password) {
      setErrors({ password: "Please enter password" });
    } else {
      try {
        let response = await fetch("https://shopcraft-backend-gitx06ssp-nitinsharma1059-1842s-projects.vercel.app/api/website/login", {
          headers: { "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify({
            email: form.email,
            password: form.password,
            expiresInMins: 10,
          }),
        });
        console.log(response);
        if (response.status === 400) {
          toast.error("Login Failure, Please check your credentials");
          return;
        }

        if (response.status === 200) {
          toast.success("login successfully !!");
        }

        let apiResponse = await response.json();

        let usableToken = {
          validAccessToken: apiResponse.token,
          userId: apiResponse.id,
        };

        localStorage.setItem("auth_token", JSON.stringify(usableToken));
        await CartService.syncAllStorage();

        navigate("/shop");
      } catch (error) {
        console.log(error);
        toast.error("Login Failure, Please check your credentials");
      }
    }
  };

  useEffect(() => {
    setErrors({});
  }, [form]);

  return (
 <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e1e4d] to-[#3a0ca3] px-4">
  <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-2xl text-white relative border border-white/20">
    {/* Icon Header */}
    <div className="flex justify-center mb-6">
      <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-4 rounded-full">
        <LogIn size={30} strokeWidth={2} className="text-white" />
      </div>
    </div>

    <h2 className="text-2xl font-bold text-center mb-2">User Login</h2>
    <p className="text-center text-gray-300 mb-6">
      Sign in to access your account
    </p>

    {/* Email */}
    <div className="mb-4">
      <label className="text-sm block mb-1">Email Address</label>
      <div className="flex items-center bg-[#1e1e4d] rounded-md px-3">
        <FiMail className="text-gray-300 mr-2" />
        <input
          type="email"
          value={form.email}
          onChange={(e) =>
            setForm((ps: any) => ({ ...ps, email: e.target.value }))
          }
          className="w-full py-2 bg-transparent text-white outline-none placeholder:text-gray-400"
          placeholder="user@example.com"
        />
      </div>
      <span className="text-red-400 text-sm">{errors.username}</span>
    </div>

    {/* Password */}
    <div className="mb-4">
      <label className="text-sm block mb-1">Password</label>
      <div className="flex items-center bg-[#1e1e4d] rounded-md px-3">
        <FiLock className="text-gray-300 mr-2" />
        <input
          type="password"
          value={form.password}
          onChange={(e) =>
            setForm((ps: any) => ({ ...ps, password: e.target.value }))
          }
          className="w-full py-2 bg-transparent text-white outline-none placeholder:text-gray-400"
          placeholder="Enter your password"
        />
      </div>
      <span className="text-red-400 text-sm">{errors.password}</span>
    </div>

    {/* Remember me + forgot password */}
    <div className="flex justify-between items-center text-sm text-gray-300 mb-6">
      <label className="flex items-center gap-2">
        <input type="checkbox" className="accent-purple-500" />
        Remember me
      </label>
      <a href="#" className="hover:underline text-blue-400">
        Forgot password?
      </a>
    </div>

    {/* Login button */}
    <button
      onClick={handleSubmit}
      className="w-full py-2 rounded-md bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 transition font-semibold"
    >
      Sign In
    </button>

    <p className="text-center text-xs text-gray-400 mt-4">
      Secure user access <span className="italic font-semibold">only</span>
    </p>
  </div>
</div>


  );
}
