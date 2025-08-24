import { useEffect, useState } from "react";
import { BiLogIn } from "react-icons/bi";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { Api } from "../services/ApiService";
import { ApiConfig } from "../configs/ApiConfig";
import { toast } from "react-toastify";


export default function AdminLogin() {
  const [loginForm, setLoginForm] = useState<any>({
    email: "admin@gmail.com",
    password: "123456",
  });
  const [error, setError] = useState<any>({});

  let navigate = useNavigate();

  async function adminLogin() {
    if (!loginForm.email) {
      setError({ email: "EMAIL IS REQUIRED !!" });
    } else if (!loginForm.email.includes("@")) {
      setError({ email: "@ required" });
    } else if (!loginForm.password) {
      setError({ password: "PLEASE ENTER PASSWORD !" });
    } else {
      try {
        var response = await Api('login',{
         email: loginForm.email,
          password: loginForm.password,
          expiresInMins: 10,
      });
      
      
    if(response.status==200){
     toast.success('login successfull')
    }
      
    console.log(response.data)
      localStorage.setItem(ApiConfig.Token, response.data.token);
      localStorage.setItem(ApiConfig.AdminId, response.data.admin_id);
      navigate("/dashboard");
      } catch (error) {
          console.log(error);
         toast.error('login failed')
      }
    }
  }

  useEffect(() => {
    setError({});
  }, [loginForm]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e1e2f] via-[#3b0d61] to-[#1e1e2f] p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-lg shadow-lg p-8 border border-white/20 text-white">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-gradient-to-tr from-purple-500 to-blue-500 p-4 rounded-full mb-4">
            <BiLogIn size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-1">Admin Panel</h2>
          <p className="text-sm text-white/70">
            Sign in to access your dashboard
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Email Address</label>
          <div className="flex items-center bg-white/10 border border-white/20 rounded px-3 py-2">
            <FaEnvelope className="mr-2 text-white/70" />
            <input
              type="email"
              placeholder="admin@company.com"
              value={loginForm.email}
              onChange={(e) =>
                setLoginForm({ ...loginForm, email: e.target.value })
              }
              className="bg-transparent focus:outline-none text-white w-full placeholder-white/60"
            />
          </div>
          <p className="font-bold text-red-400 text-sm">{error.email}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Password</label>
          <div className="flex items-center bg-white/10 border border-white/20 rounded px-3 py-2">
            <FaLock className="mr-2 text-white/70" />
            <input
              type="password"
              placeholder="Enter your password"
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
              className="bg-transparent focus:outline-none text-white w-full placeholder-white/60"
            />
            <AiOutlineEye className="ml-2 text-white/60 cursor-pointer" />
          </div>
          <p className="text-sm font-bold text-red-400">{error.password}</p>
        </div>

        <div className="flex items-center justify-between text-sm mb-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-purple-600" />
            Remember me
          </label>
          <a href="#" className="text-purple-300 hover:underline">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          onClick={() => {
            adminLogin();
          }}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-2 rounded hover:opacity-90 transition cursor-pointer"
        >
          Sign In
        </button>

        <p className="text-xs text-center mt-6 text-white/50">
          Secure admin access only
        </p>
      </div>
    </div>
  );
}
