import { useEffect, useState } from "react";
import { Api } from "../../services/ApiService";
import { AuthenticationService } from "../../services/AuthenticationService ";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { IoIosAdd } from "react-icons/io";
import Spinner from "../../component/Spinner";
import { LuLoader } from "react-icons/lu";

export default function ProductCategoryListing() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterForm, setFilterForm] = useState<any>({});

  const fetchCategories = async () => {
    setLoading(true);
    const isAuthenticated = await AuthenticationService.isAuthenticated();
    if (isAuthenticated) {
      const response = await Api("product-category/search");
      setCategories(response);
    }
    setLoading(false);
  };

  async function filter() {
    if (await AuthenticationService.isAuthenticated()) {
      let response = await Api("product-category/filter", filterForm);

      setCategories(response.data);
    }
  }

  useEffect(() => {
    if (filterForm.key && filterForm.key.trim() !== "") {
      filter();
    } else {
      fetchCategories();
    }
  }, [filterForm]);

  const remove = async (id: number) => {
    if (!confirm("Are you sure you want to delete this record ?")) {
      return;
    }
    setCategories((cx: any) =>
      cx.map((c: any) => (c.id == id ? { ...c, deleting: true } : c))
    );
    var r = await Api("product-category/remove", { id });
    if (r.status == 200) {
      fetchCategories();
    } else {
      setCategories((cx: any) =>
        cx.map((c: any) => (c.id == id ? { ...c, deleting: false } : c))
      );
      alert("Unable to delete");
    }
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (

        
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-purple-100 px-4 py-10">
          {/* Top Add Button */}
  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
  {/* Search Input */}
  <div className="flex-1 min-w-[250px]">
    <input
      type="text"
      placeholder="🔍 Search category..."
      className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
      onChange={(e) =>
        setFilterForm({ ...filterForm, key: e.target.value })
      }
    />
  </div>

  {/* Add Category Button */}
  <NavLink
    to="/product-category/create"
    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-full shadow-md text-sm font-semibold transition"
  >
    <IoIosAdd size={22} /> Add Category
  </NavLink>
</div>


          {/* Main Card */}
          <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-purple-700 mb-6 border-b pb-3">
              🗂️ Product Categories
            </h2>

            {categories.length === 0 ? (
              <p className="text-gray-500 text-center">No categories found.</p>
            ) : (
              <ul className="space-y-4">
                {categories.map((category: any, index) => (
                  <li
                    key={category.id || index}
                    className="flex justify-between items-center bg-purple-50 hover:bg-purple-100 transition p-4 rounded-lg shadow-sm"
                  >
                    <span className="text-base sm:text-lg font-medium text-purple-800">
                      {category.name}
                    </span>
                    <div className="flex gap-4 text-xl">
                      <button
                        onClick={() => remove(category.id)}
                        className="text-red-600 hover:text-red-700 transition"
                      >
                        {category.deleting ? (
                          <LuLoader className="animate-spin" />
                        ) : (
                          <MdDelete />
                        )}
                      </button>

                      <NavLink
                        to={"/product-category/update/" + category.id}
                        className="text-blue-600 hover:text-blue-700 transition cursor-pointer"
                      >
                        <FaEdit />
                      </NavLink>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}
