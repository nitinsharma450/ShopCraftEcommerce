import { NavLink, useLocation } from "react-router-dom";
import { FaTachometerAlt, FaBoxOpen, FaUsers, FaSignOutAlt } from "react-icons/fa";

export default function SidebBar() {

  let location=useLocation()
 

  return (
    <aside className="h-screen w-64 bg-white border-r shadow-md p-6  top-0">
      <div className="text-2xl font-bold text-purple-600 mb-10">
        E-commerce Dashboard
      </div>

      <nav className="flex flex-col gap-4">
      
          <NavLink
          
            to={'/dashboard'}
            className={`flex items-center gap-3 px-4 py-2 rounded-md transition hover:bg-purple-100 ${
        location.pathname === "/dashboard"
          ? "bg-purple-100 text-purple-700 font-semibold"
          : "text-gray-700"
      }`}
          >
            <span className="text-lg">{ <FaTachometerAlt />}</span>
            <span>Overview</span>
          </NavLink>

          <NavLink
          
            to={'/dashboard/product'}
           className={`flex items-center gap-3   px-4 py-2 rounded-md transition hover:bg-purple-100 ${
        location.pathname === "/dashboard/product"
          ? "bg-purple-100 text-purple-700 font-semibold"
          : "text-gray-700"
      }`}
          >
            <span className="text-lg">{ <FaBoxOpen />}</span>
            <span>product</span>
          </NavLink>

            <NavLink
          
            to={'/dashboard/userlisting'}
           className={`flex items-center gap-3 px-4 py-2 rounded-md transition hover:bg-purple-100 ${
        location.pathname === "/dashboard/userlisting"
          ? "bg-purple-100 text-purple-700 font-semibold"
          : "text-gray-700"
      }`}
          >
            <span className="text-lg">{ <FaUsers />}</span>
            <span>Users</span>
          </NavLink>
      
      <NavLink
          
            to={'/product-category'}
           className={`flex items-center gap-3 px-4 py-2 rounded-md transition hover:bg-purple-100 ${
        location.pathname === "/dashboard/product-category"
          ? "bg-purple-100 text-purple-700 font-semibold"
          : "text-gray-700"
      }`}
          >
            <span className="text-lg">{ <FaUsers />}</span>
            <span>Product-Category</span>
          </NavLink>

        <button
          onClick={() => {
            localStorage.removeItem("admin_auth_token");
            window.location.href = "/";
          }}
          className="mt-10 flex items-center gap-3 px-4 py-2 rounded-md text-red-600 hover:bg-red-100 transition"
        >
          <FaSignOutAlt className="text-lg" />
          Logout
        </button>
      </nav>
    </aside>
  );
}
