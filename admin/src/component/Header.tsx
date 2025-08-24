import { useEffect, useState } from 'react';
import { ApiConfig } from '../configs/ApiConfig';
import { Api } from '../services/ApiService';

import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaCalendarAlt, FaRegEdit } from 'react-icons/fa';
import { AuthenticationService } from '../services/AuthenticationService ';
import adminAvatar from '../assets/adminAvatar.jpg'
import { ImCross } from 'react-icons/im';



export default function Header() {
  const [adminData, setAdminData] = useState<any>({});
  const [showModal, setShowModal] = useState(false);
  const[editprofileModel,setEditProfileModel]=useState(false)
  const[adminForm,setAdminForm]=useState<any>({})



async function save() {
  if (await AuthenticationService.isAuthenticated()) {
    const formData = new FormData();

    // Append all fields
    for (const key in adminForm) {
      if (adminForm[key] !== undefined && adminForm[key] !== null) {
        formData.append(key, adminForm[key]);
      }
    }

    try {
      const response = await Api("user/update", formData);
      if (response.status == 200) {
        alert("Updated successfully!");
        setEditProfileModel(false);
        fetchAdmin(); // Refresh data
      } else {
        alert("Update failed.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred.");
    }
  }
}


  async function fetchAdmin() {
    if (await AuthenticationService.isAuthenticated()) {
      const admin_id = localStorage.getItem(ApiConfig.AdminId);
      if (!admin_id) {
        alert("Admin ID not found in localStorage");
        return;
      }

      const response = await Api("user/searchByIdAdmin", { userId: admin_id });
      if (!response) {
        alert("Admin not found");
        return;
      }

      setAdminData(response.data);
    }
  }

  useEffect(() => {
    fetchAdmin();
  }, []);

  return (
    <>
      {/* HEADER */}
      <header className="flex items-center justify-between px-8 py-4 bg-white shadow-sm sticky top-0 z-10">
        {/* Search Bar */}
        <div className="w-full max-w-md">
          <input
            type="text"
            placeholder="🔍 Search..."
            className="w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Profile Section */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800">{adminData?.name}</p>
            <p className="text-xs text-gray-500">{adminData?.email}</p>
          </div>
          <div className="w-10 h-10 cursor-pointer" onClick={() => setShowModal(true)}>
            <img
              src={adminData?.profile_picture || adminAvatar}
            
              alt="Admin"
              className="w-full h-full rounded-full object-cover border border-gray-300 shadow-sm"
            />
          </div>
        </div>
      </header>

      {/* MODAL */}
      {showModal && (
       <div className="fixed inset-0 bg-black/50 z-50  flex items-center justify-center ">

          <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 relative">
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-600 text-xl font-bold hover:text-black cursor-pointer"
            >
             <ImCross size={15} />
            </button>
        
        <p className='font-bold text-xl p-2'>Admin Profile</p>
            {/* Admin Info */}
          <div className="flex items-center justify-between bg-green-100 rounded-2xl p-6 shadow-md mb-6">
  <div className="flex items-center gap-5">
    <img
      src={adminData?.profile_picture || adminAvatar}
      alt="Avatar"
      className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
    />
    <div>
      <h2 className="text-xl font-semibold text-gray-800">{adminData?.name}</h2>
      <p className="text-sm text-gray-600 capitalize">{adminData?.role}</p>
      <p className="text-xs text-gray-500">ID: {adminData?.id}</p>
    </div>
  </div>

  <button className="flex items-center gap-2 bg-white border cursor-pointer border-gray-300 hover:bg-gray-50 transition px-4 py-2 rounded-xl text-sm text-gray-700 shadow-sm" onClick={()=>{setEditProfileModel(true); setShowModal(false); setAdminForm(adminData);}}>
    <FaRegEdit className="text-gray-600" />
    <span>Edit Profile</span>
  </button>
</div>
            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-md">
                <FaEnvelope className="text-gray-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-800">{adminData?.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-md">
                <FaPhoneAlt className="text-gray-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-800">{adminData?.phone_number}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-md">
                <FaMapMarkerAlt className="text-gray-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-sm font-medium text-gray-800">
                    {adminData?.state}, {adminData?.country}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-md">
                <FaCalendarAlt className="text-gray-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="text-sm font-medium text-green-600">{adminData?.status}</p>
                </div>
              </div>
            </div>
          </div>



         

        </div>
      )}

  {editprofileModel && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
    <div className="bg-white rounded-xl p-6 w-full max-w-2xl relative shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
        <button onClick={() => setEditProfileModel(false)} className="text-gray-500 hover:text-black">
          <ImCross size={18} />
        </button>
      </div>

      {/* Profile Picture Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
        <div className="flex items-center gap-4">
          <img
           src={
  adminForm.profile_picture instanceof File
    ? URL.createObjectURL(adminForm.profile_picture)
    : adminForm.profile_picture || adminData?.profile_picture || adminAvatar
}
            alt="Preview"
            className="w-16 h-16 rounded-full object-cover border border-gray-300"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setAdminForm({ ...adminForm, profile_picture: e.target.files?.[0] })
            }
            className="text-sm"
          />
        </div>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={adminData.name}
            onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={adminData.email}
            onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            value={adminData.role}
            onChange={(e) => setAdminForm({ ...adminForm, role: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-purple-500"
          >
            <option value="admin">Admin</option>
            <option value="superadmin">Superadmin</option>
            <option value="user">User</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={adminData.status}
            onChange={(e) => setAdminForm({ ...adminForm, status: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-purple-500"
          >
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
          <input
            type="text"
            value={adminData.state}
            onChange={(e) => setAdminForm({ ...adminForm, state: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="text"
            value={adminData.phone_number}
            onChange={(e) => setAdminForm({ ...adminForm, phone_number: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
          <input
            type="text"
            value={adminData.country}
            onChange={(e) => setAdminForm({ ...adminForm, country: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select
            value={adminData.gender}
            onChange={(e) => setAdminForm({ ...adminForm, gender: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-purple-500"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Password */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="text"
            value={adminData.password}
            onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
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


    </>
  );
}
