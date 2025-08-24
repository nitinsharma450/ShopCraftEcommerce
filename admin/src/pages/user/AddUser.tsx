import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Api } from "../../services/ApiService";
import { AuthenticationService } from "../../services/AuthenticationService ";

export default function AddUser() {
  const [userForm, setUserForm] = useState<any>({});
  const [imagePreview, setImagePreview] = useState<string>("");
  const [errors, setErrors] = useState<any>({});
  const navigate = useNavigate();
  const { userId } = useParams();

  async function submit() {
    const newErrors: any = {};

    if (!userForm.name || userForm.name.trim() === "") {
      newErrors.name = "Name is required";
    }

    if (!userForm.email || userForm.email.trim() === "") {
      newErrors.email = "Email is required";
    } else if (!userForm.email.includes("@")) {
      newErrors.email = "@ is required in email";
    }

    if (!userForm.phone_number || userForm.phone_number.trim() === "") {
      newErrors.phone = "Phone number is required";
    }

    if (!userForm.role || userForm.role === "select user") {
      newErrors.role = "Role is required";
    }

    if (!userForm.status || userForm.status === "Select status") {
      newErrors.status = "Status is required";
    }

    if (!userForm.gender || userForm.gender === "") {
      newErrors.gender = "Gender is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const formData = new FormData();
    for (const key in userForm) {
      if (userForm[key]) {
      if (key === "profile_picture") {
  formData.append("image", userForm[key]); // 👈 Send it as "image"
} else {
  formData.append(key, userForm[key]);
}

      }
    }

    if (await AuthenticationService.isAuthenticated()) {
      let endpoint=userId?'user/update':'user/create'

      const response = await Api(endpoint, formData); 
      if (response.status === 200) {
        alert(userId?"User update successfully !!":"user add successfully");
        navigate("/dashboard/userlisting");
      } else {
        alert(userId?"Unable to update user !!":"unable to add user");
      }
    }
  }

  async function fetchData(userId: number) {
    if (await AuthenticationService.isAuthenticated()) {
      let response = await Api("user/searchById", { userId });
       
      setUserForm(response.data);
      if (response.data.profile_picture) {
        setImagePreview(`/uploads/${response.response.profile_picture}`); 
      }
    }
  }

  useEffect(() => {
    if (userId) {
      fetchData(Number(userId));
    }
  }, [userId]);

  useEffect(() => {
    setErrors({});
  }, [userForm]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setUserForm((prev: any) => ({
        ...prev,
        profile_picture: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  }

  return (
    <div className="m-10 p-10">
      <div className="flex flex-row gap-5">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 mb-4 border rounded-md hover:bg-gray-200 cursor-pointer"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold mb-6">
          {userId ? "Update User" : "Add New User"}
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-4 bg-white p-6 rounded shadow">
        {/* Name */}
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            placeholder="Enter name"
            className="w-full border rounded px-3 py-2"
            value={userForm.name || ""}
            onChange={(e) =>
              setUserForm({ ...userForm, name: e.target.value })
            }
          />
          <span className="text-red-400 text-sm font-bold">{errors.name}</span>
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter email"
            className="w-full border rounded px-3 py-2"
            value={userForm.email || ""}
            onChange={(e) =>
              setUserForm({ ...userForm, email: e.target.value })
            }
          />
          <span className="text-red-400 text-sm font-bold">{errors.email}</span>
        </div>

        {/* Phone */}
        <div>
          <label className=" font-medium mb-1">Phone Number</label>
          <input
            
            placeholder="Enter phone number"
            className="w-full border rounded px-3 py-2"
            value={userForm.phone_number}
            onChange={(e) =>
              setUserForm({ ...userForm, phone_number: e.target.value })
            }
          />
          <span className="text-red-400 text-sm font-bold">{errors.phone}</span>
        </div>

        {/* Profile Picture Upload */}
        <div>
          <label className="block font-medium mb-1">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            className="w-full border rounded px-3 py-2"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 w-16 h-16 rounded-full object-cover"
            />
          )}
        </div>

        {/* Role */}
        <div>
          <label className="block font-medium mb-1">Role</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={userForm.role || "select user"}
            onChange={(e) =>
              setUserForm({ ...userForm, role: e.target.value })
            }
          >
            <option value="select user">select user</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>
          <span className="text-red-400 text-sm font-bold">{errors.role}</span>
        </div>

        {/* State */}
        <div>
          <label className="block font-medium mb-1">State</label>
          <input
            type="text"
            placeholder="Enter state"
            className="w-full border rounded px-3 py-2"
            value={userForm.state || ""}
            onChange={(e) =>
              setUserForm({ ...userForm, state: e.target.value })
            }
          />
        </div>

        {/* Country */}
        <div>
          <label className="block font-medium mb-1">Country</label>
          <input
            type="text"
            placeholder="Enter country"
            className="w-full border rounded px-3 py-2"
            value={userForm.country || ""}
            onChange={(e) =>
              setUserForm({ ...userForm, country: e.target.value })
            }
          />
        </div>


        <div>
          <label className="block font-medium mb-1">password</label>
          <input
            type="text"
            placeholder="Enter Password"
            className="w-full border rounded px-3 py-2"
            value={userForm.password || ""}
            onChange={(e) =>
              setUserForm({ ...userForm, password: e.target.value })
            }
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block font-medium mb-1">Gender</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={userForm.gender || ""}
            onChange={(e) =>
              setUserForm({ ...userForm, gender: e.target.value })
            }
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <span className="text-red-400 text-sm font-bold">
            {errors.gender}
          </span>
        </div>

        {/* Status */}
        <div>
          <label className="block font-medium mb-1">Status</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={userForm.status || ""}
            onChange={(e) =>
              setUserForm({ ...userForm, status: e.target.value })
            }
          >
            <option value="">Select status</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
          </select>
          <span className="text-red-400 text-sm font-bold">
            {errors.status}
          </span>
        </div>
      </div>

      <div className="flex justify-center items-center mt-4">
        <button
          onClick={submit}
          className="p-4 hover:bg-purple-600 text-white font-bold bg-purple-500 cursor-pointer rounded-2xl"
        >
          Save User
        </button>
      </div>
    </div>
  );
}
