import {ShoppingCart, User } from "lucide-react";
import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { matchPath, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AuthenticationService } from "../lib/AuthenticationService";
import { Api } from "../lib/ApiService";
import { ImCross } from "react-icons/im";
import { TbLogout } from "react-icons/tb";

export default function Header() {
  const [profileModel, showProfileModel] = useState(false);
  const [updateProfileModel, setUpdateProfileModel] = useState(false);
  const [updateProfile, setUpdateProfile] = useState<any>({});
  const [Profile, setUserProfile] = useState<any>({});
  const [signupModel, showSignupModal] = useState(false);
  const [signupForm, setSignupForm] = useState<any>({
    name: "",
    email: "",
    password: "",
    confpassword: "",
    phone_number: "",
    gender: "",
    role: "",
    state: "",
    country: "",
    status: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<any>({});
  const [logoutButton, showLogoutButton] = useState(true);
  const [loginButton, showLoginButton] = useState(true);

  let location = useLocation();
  let navigate = useNavigate();

  const allowedRoutes = [
    "/signup",
    "/login",
    "/faqs",
    "/Home",
    "/Blogs",
    "/cart",
    "/shop",
    "/Contact",
    "/details/:id",
    "/"
  ];

  function isRouteAllowed(pathname: string) {
    return allowedRoutes.some((route) =>
      matchPath({ path: route, end: true }, pathname)
    );
  }

let response = localStorage.getItem("auth_token");
let jsonResponse: any = null;
let token: string | null = null;

try {
  if (response) {
    jsonResponse = JSON.parse(response);
    token = jsonResponse?.validAccessToken;
  }
} catch (error) {
  console.error("Invalid auth_token in localStorage", error);
}



  async function userProfile() {
    let userId = "";
    if (await AuthenticationService.isAuthenticated()) {
      let response = localStorage.getItem("auth_token");
      if (response) {
        const parsedResponse = JSON.parse(response);
        userId = parsedResponse.userId;
      }
      if (userId) {
        let userData = await Api("user", { userId });
        if (userData) setUserProfile(userData);
      }
    }
  }

  useEffect(() => {
    userProfile();
  }, []);

  useEffect(() => {
    if (!token && !isRouteAllowed(location.pathname)) {
      showLoginButton(true);
      showLogoutButton(false);
      navigate("/login");
    } else {
      showLoginButton(false);
      showLogoutButton(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const validate = () => {
    const newErrors: any = {};
    if (!signupForm.name) newErrors.name = "Name is required!";
    if (!signupForm.email) newErrors.email = "Email is required!";
    else if (!/\S+@\S+\.\S+/.test(signupForm.email))
      newErrors.email = "Invalid email!";
    if (!signupForm.password) newErrors.password = "Password is required!";
    else if (signupForm.password.length < 6)
      newErrors.password = "Minimum 6 characters";
    if (signupForm.confpassword !== signupForm.password)
      newErrors.confpassword = "Passwords do not match!";
    if (!signupForm.phone) newErrors.phone = "Phone is required!";
    else if (!/^[0-9]{10}$/.test(signupForm.phone))
      newErrors.phone = "Invalid phone number!";
    if (!signupForm.gender) newErrors.gender = "Select gender!";
    if (!signupForm.role) newErrors.role = "Select role!";
    if (!signupForm.state) newErrors.state = "State is required!";
    if (!signupForm.country) newErrors.country = "Country is required!";
    if (!imageFile) newErrors.image = "Image is required!";
    return newErrors;
  };

  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const formData = new FormData();
    for (const key in signupForm) formData.append(key, signupForm[key]);
    if (imageFile) formData.append("image", imageFile);

    try {
      const response = await Api("signup", formData);
      console.log("User registered:", response);
      if (response.status == 200) {
        alert("REGISTER SUCCESSFULLY !!");
      }
      showSignupModal(false);
    } catch (error) {
      console.error("Signup failed:", error);
      alert(error);
    }
  };
  async function save() {
    const formData = new FormData();
    for (const key in updateProfile) formData.append(key, updateProfile[key]);
    if (imageFile) formData.append("profile_picture", imageFile);

    if (await AuthenticationService.isAuthenticated()) {
      try {
        let response = await Api("userprofileupdate", formData);
        if (response.status == 200) {
          alert("update successfully !!");
        }
      } catch (error) {
        alert(error);
      }
    }
  }
 
  return (
    <div className="w-full bg-white shadow-md px-6 py-4 sticky top-0 z-50">
 
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left - Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-purple-500 to-blue-500 w-10 h-10 flex items-center justify-center rounded-lg">
            <span className="text-white font-bold text-lg">SC</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">ShopCraft</h1>
            <p className="text-xs text-gray-500 -mt-1">Your Shopping Destination</p>
          </div>
        </div>

        {/* Center - Nav Links */}
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <NavLink
            to="/faqs"
            className={({ isActive }) =>
              isActive ? "text-purple-600 font-semibold" : "text-gray-700 hover:text-purple-500"
            }
          >
            FAQS
          </NavLink>
          <NavLink
            to="/shop"
            className={({ isActive }) =>
              isActive ? "text-purple-600 font-semibold" : "text-gray-700 hover:text-purple-500"
            }
          >
            SHOP
          </NavLink>
     
{token && (
   
    <NavLink
            to="/myorders"
            className={({ isActive }) =>
              isActive ? "text-purple-600 font-semibold" : "text-gray-700 hover:text-purple-500"
            }
          >
            My Orders
          </NavLink>
)}
      
     

          {loginButton && (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "text-purple-600 font-semibold" : "text-gray-700 hover:text-purple-500"
              }
            >
              Login
            </NavLink>
          )}
         
        </nav>

        {/* Right - Icons */}
        <div className="flex gap-4 items-center text-gray-600">
         
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              isActive ? "text-purple-500" : "hover:text-purple-500"
            }
          >
            <ShoppingCart size={18} />
          </NavLink>
        
          <button onClick={() => showSignupModal(true)} title="Signup">
            <User className="hover:text-purple-600 cursor-pointer" size={18} />
          </button>
          <button onClick={() => showProfileModel(true)} title="Profile">
            <CgProfile className="hover:text-purple-600 cursor-pointer" size={20} />
          </button>

           {logoutButton && (
            <NavLink to="/logout" className="text-red-500 hover:text-red-600 ">
              <TbLogout size={22} />
            </NavLink>
          )}
        </div>
      </div>
   
      {/* Signup Modal */}
      {signupModel && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl w-full max-w-xl p-6 shadow-2xl relative">
            <button
              onClick={() => showSignupModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
            >
              <ImCross size={18} />
            </button>
            <h2 className="text-2xl font-bold text-center mb-6">User Signup</h2>
            <form
              className="grid grid-cols-2 gap-4 text-sm"
              onSubmit={register}
            >
              {/* Image Upload */}
              <div className="col-span-2">
                <label className="block font-medium mb-1">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setImageFile(file);
                    if (file) {
                      setImagePreviewUrl(URL.createObjectURL(file));
                    } else {
                      setImagePreviewUrl(null);
                    }
                  }}
                />
                {errors.image && (
                  <p className="text-red-500 text-xs mt-1">{errors.image}</p>
                )}

                {imagePreviewUrl && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-600 mb-1">
                      Selected Image Preview:
                    </p>
                    <img
                      src={imagePreviewUrl}
                      alt="Preview"
                      className="h-24 w-24 rounded-lg object-cover border"
                    />
                  </div>
                )}
              </div>

              {/* All other fields */}
              {Object.entries(signupForm).map(([key]) => (
                <div key={key} className="col-span-1">
                  <label className="block font-medium mb-1">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                  {["gender", "role", "status"].includes(key) ? (
                    <select
                      className="w-full border rounded px-3 py-2"
                      onChange={(e) =>
                        setSignupForm({ ...signupForm, [key]: e.target.value })
                      }
                    >
                      <option value="">Select</option>
                      {key === "gender" &&
                        ["Male", "Female", "Other"].map((opt) => (
                          <option key={opt}>{opt}</option>
                        ))}
                      {key === "role" &&
                        ["Admin", "User"].map((opt) => (
                          <option key={opt}>{opt}</option>
                        ))}
                      {key === "status" &&
                        ["Active", "Suspended"].map((opt) => (
                          <option key={opt}>{opt}</option>
                        ))}
                    </select>
                  ) : (
                    <input
                      type={key.includes("password") ? "password" : "text"}
                      className="w-full border rounded px-3 py-2"
                      onChange={(e) =>
                        setSignupForm({ ...signupForm, [key]: e.target.value })
                      }
                    />
                  )}
                  {errors[key] && (
                    <p className="text-red-500 text-xs">{errors[key]}</p>
                  )}
                </div>
              ))}

              <div className="col-span-2 mt-2">
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded"
                >
                  Register Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {profileModel && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => showProfileModel(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
            >
              <ImCross size={20} />
            </button>

            <h2 className="text-2xl font-bold mb-4">Admin Profile</h2>

            {/* Profile Header */}
            <div className="bg-green-100 rounded-xl p-4 flex items-center justify-between mb-6 shadow">
              <div className="flex items-center gap-4">
                <img
                  src={Profile.profile_picture || "/default-avatar.png"}
                  alt="User Avatar"
                  className="w-16 h-16 rounded-full object-cover border border-white shadow"
                />
                <div>
                  <h3 className="text-lg font-bold">{Profile.name}</h3>
                  <p className="text-sm text-gray-600">{Profile.role}</p>
                  <p className="text-xs text-gray-500">
                    ID: {Profile.id || "N/A"}
                  </p>
                </div>
              </div>
              <button
                className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border hover:shadow font-medium text-sm"
                onClick={() => {
                  setUpdateProfileModel(true);
                  setUpdateProfile(Profile);
                  showProfileModel(false);
                }}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 17l-5-5m0 0l5-5m-5 5h12"
                  />
                </svg>
                Edit Profile
              </button>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 rounded p-4 flex items-center gap-3">
                <span className="text-gray-500">📧</span>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium">{Profile.email}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded p-4 flex items-center gap-3">
                <span className="text-gray-500">📞</span>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-medium">{Profile.phone_number}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded p-4 flex items-center gap-3">
                <span className="text-gray-500">📍</span>
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="font-medium">
                    {Profile.state}
                    {Profile.country}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded p-4 flex items-center gap-3">
                <span className="text-gray-500">📅</span>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <p
                    className={`font-medium ${
                      Profile.status === "Active"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {Profile.status?.toLowerCase()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {updateProfileModel && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl relative shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
              <button
                onClick={() => {
                  setUpdateProfileModel(false);
                }}
                className="text-gray-500 hover:text-black"
              >
                <ImCross size={18} />
              </button>
            </div>

            {/* Profile Picture Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture
              </label>
              <div className="flex items-center gap-4">
                <img
                  src={
                    updateProfile.profile_picture instanceof File
                      ? URL.createObjectURL(updateProfile.profile_picture)
                      : updateProfile.profile_picture ||
                        updateProfile?.profile_picture
                  }
                  alt="Preview"
                  className="w-16 h-16 rounded-full object-cover border border-gray-300"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setUpdateProfile({
                      ...updateProfile,
                      profile_picture: e.target.files?.[0],
                    })
                  }
                  className="text-sm"
                />
              </div>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={updateProfile.name}
                  onChange={(e) =>
                    setUpdateProfile({ ...updateProfile, name: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={updateProfile.email}
                  onChange={(e) =>
                    setUpdateProfile({
                      ...updateProfile,
                      email: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={updateProfile.role}
                  onChange={(e) =>
                    setUpdateProfile({ ...updateProfile, role: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-purple-500"
                >
                  <option value="admin">Admin</option>
                  <option value="superadmin">Superadmin</option>
                  <option value="user">User</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={updateProfile.status}
                  onChange={(e) =>
                    setUpdateProfile({
                      ...updateProfile,
                      status: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={updateProfile.state}
                  onChange={(e) =>
                    setUpdateProfile({
                      ...updateProfile,
                      state: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={updateProfile.phone_number}
                  onChange={(e) =>
                    setUpdateProfile({
                      ...updateProfile,
                      phone_number: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={updateProfile.country}
                  onChange={(e) =>
                    setUpdateProfile({
                      ...updateProfile,
                      country: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  value={updateProfile.gender}
                  onChange={(e) =>
                    setUpdateProfile({
                      ...updateProfile,
                      gender: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* Password */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="text"
                  value={updateProfile.password}
                  onChange={(e) =>
                    setUpdateProfile({
                      ...updateProfile,
                      password: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Update Button */}
            <div className="mt-6 text-right">
              <button
                onClick={save}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-md shadow-md transition"
              >
                Update Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
