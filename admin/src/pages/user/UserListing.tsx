import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthenticationService } from "../../services/AuthenticationService ";
import { Api } from "../../services/ApiService";
import { BsThreeDotsVertical } from "react-icons/bs";
import userAvatar from '../../assets/userAvatar.jpg'
import Spinner from "../../component/Spinner";

export default function UserListing() {
  const [userList, setUserList] = useState<any[]>([]);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const[loading,setLoading]=useState<any>(true)
  const navigate = useNavigate();

  async function fetchUser() {
    setLoading(true)
    if (await AuthenticationService.isAuthenticated()) {
      let userData = await Api("user/search");
      setUserList(userData.response || []);
      setLoading(false)
    }
  }

  async function handleDeleteUser(userId: number) {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      const response = await Api("user/remove", { userId });
      if (response.status === 200) {
        alert("User deleted successfully!");
        fetchUser();
      } else {
        alert("Failed to delete user.");
      }
    } catch (err) {
      console.error("Delete failed", err);
      alert("Error deleting user");
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdowns = document.querySelectorAll(".dropdown-menu");
      dropdowns.forEach((dropdown) => {
        if (!dropdown.contains(event.target as Node)) {
          setOpenDropdown(null);
        }
      });
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="p-8">
      <div className="text-2xl font-bold flex flex-row justify-between mb-6">
        <div>User</div>
        <NavLink
          to="/dashboard/saveusers"
          className="text-xl font-semibold px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 shadow"
        >
          Add User
        </NavLink>
      </div>
      

{loading ?<Spinner />: <div className="overflow-x-auto shadow-md rounded-xl">
        <table className="min-w-full bg-white rounded-xl">
          <thead>
            <tr className="text-left border-b bg-gray-100 text-gray-600">
              <th className="p-4">User</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Gender</th>
              <th className="p-4">Contact</th>
              <th className="p-4">State</th>
              <th className="p-4">Country</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((user: any, index: number) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-4 flex items-center gap-3">
                  <img
                    src={user.profile_picture || userAvatar}
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium">{user.name || "N/A"}</div>
                    <div className="text-gray-500 text-sm">{user.email || "N/A"}</div>
                  </div>
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      user.role === "Admin"
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.role || "User"}
                  </span>
                </td>

                <td className="p-4">
                  <span className="px-3 py-1 text-sm font-medium rounded-full">
                    <span className="text-blue">{user.status}</span>
                  </span>
                </td>

                <td className="p-4">{user.gender || "N/A"}</td>

                <td className="p-4 text-sm text-gray-700">
                  <div className="flex items-center gap-1">📧 {user.email || "N/A"}</div>
                  <div className="flex items-center gap-1">📞 {user.phone_number || "N/A"}</div>
                </td>

                <td className="p-4 text-sm">{user.state || "N/A"}</td>
                <td className="p-4 text-sm">{user.country || "N/A"}</td>

                <td className="p-4 text-center ">
                  <button
                    className="p-1 text-gray-600 hover:text-gray-800 cursor-pointer relative "
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdown(openDropdown === index ? null : index);
                    }}
                  >
                    <BsThreeDotsVertical size={18} />
                  </button>

                  {openDropdown === index && (
                    <div className="dropdown-menu absolute right-0 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                      <div className="flex flex-col justify-center items-center gap-2 p-2">
                        <NavLink
                          to={`/dashboard/saveusers/${user.id}`}
                          className="w-full text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-purple-600 rounded transition"
                        >
                          ✏️ Edit
                        </NavLink>
                        <button
                          className="w-full text-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded transition"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {userList.length === 0 && (
          <div className="p-4 text-center text-gray-500">No users found.</div>
        )}
      </div>}
     
    </div>
  );
}
