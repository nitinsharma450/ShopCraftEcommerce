import { useEffect, useState } from "react";
import { AuthenticationService } from "../../services/AuthenticationService ";
import { Api } from "../../services/ApiService";
import { NavLink } from "react-router-dom";
import { IoAddSharp } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import Spinner from "../../component/Spinner";
import { FaIndianRupeeSign } from "react-icons/fa6";

export default function ProductListing() {
  const [getProduct, showGetProduct] = useState<any[]>([]);
  const [keyForm, setKeyForm] = useState<any>({});
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const[categories,setCategories]=useState<any>([]);
  const [loading, setLoading] = useState(false);

  async function showProduct() {
    if (await AuthenticationService.isAuthenticated()) {
      setLoading(true);
      try {
        const product = await Api("product/searchAll");
        showGetProduct(product.data);
      
      
      } catch (error) {
        alert(error);
      }
      setLoading(false);
    }
  }

 async function fetchCategory(){

 if(await AuthenticationService.isAuthenticated()){


  let response=await Api('product-category/suggest')
  console.log("res", response.data)
  setCategories(response);
  console.log(categories)
 }

}


  async function filter() {
    if (await AuthenticationService.isAuthenticated()) {
      const response = await Api("product/filter", keyForm);
      console.log("catye",response)
      if (response && response.data) {
        showGetProduct(response.data);
      } else {
        showGetProduct([]); // No results fallback
      }
    }
  }

  async function handleDelete(productId: number) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      const response = await Api("product/remove", { productId });

      if (response.status === 200) {
        alert("Product deleted successfully!");
        showProduct();
      } else {
        alert("Failed to delete product.");
      }
    } catch (err) {
      console.error("Delete failed", err);
      alert("Error deleting product");
    }
  }
useEffect(()=>{
 fetchCategory()
},[])
 

 useEffect(() => {
  if (keyForm.key && keyForm.key.trim() !== "") {
    filter();
  } else {
    showProduct(); 
  }
}, [keyForm]);


  // Close dropdown on outside click
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
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="p-10 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">🛍️ Product Management</h1>
        <NavLink
          to={"/addproduct"}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-full shadow-md text-sm font-semibold transition"
        >
          <IoAddSharp size={18} />
          Add Product
        </NavLink>
      </div>

      {/* Search Input */}
     <div className="flex items-center justify-between w-full border border-gray-200 rounded-xl shadow-sm mb-10 p-4">
  {/* 🔍 Search Input */}
  <div className="flex items-center flex-1 px-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5 text-gray-400 mr-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
    </svg>
    <input
      type="text"
      placeholder="Search products..."
      className="w-full outline-none bg-transparent text-gray-700 placeholder-gray-400"
      onChange={(e) => setKeyForm({ ...keyForm, key: e.target.value })}
    />
  </div>

  {/* Divider (Optional) */}
  <div className="mx-2 h-6 w-px bg-gray-300" />

  {/* 🔽 Filter Dropdown */}
  <div className="flex items-center space-x-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2H3V4zM3 9h18v2H3V9zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
    </svg>
    <select
      className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      onChange={(e) => setKeyForm({...keyForm,key:e.target.value})}
    >
    <option value="">ALL</option>

     {
      categories?.map((value:any)=>(
        <option>{value.name}</option>
      ))
     }
      {/* Add more categories */}
    </select>
  </div>
</div>


      {/* Content */}
      {loading ? (
        <Spinner />
      ) : getProduct.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
          <table className="min-w-full text-sm text-left">
            <thead className="text-xs text-gray-600 uppercase bg-gray-100">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {getProduct.map((product: any, index: number) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <div className="font-semibold text-gray-800">{product.title}</div>
                      <div className="text-gray-500 text-sm truncate max-w-[200px]">
                        {product.description}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                      {product.category || "Uncategorized"}
                    </span>
                  </td>

                  <td className="px-6 py-4 font-bold text-gray-800">
                    <div className="flex items-center gap-1">
                      <FaIndianRupeeSign className="text-sm mt-[2px]" />
                      {Number(product.price).toFixed(2)}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`font-medium ${product.stock < 20 ? "text-orange-500" : ""}`}>
                      {product.stock}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {product.availabilityStatus === "Out Of Stock" ? (
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                        inactive
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
                        active
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      className="p-1 text-gray-600 hover:text-gray-800 cursor-pointer relative"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdown(openDropdown === index ? null : index);
                      }}
                    >
                      <BsThreeDotsVertical size={18} />
                    </button>

                    {openDropdown === index && (
                      <div className="dropdown-menu absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-150 overflow-clip">
                        <div className="flex flex-col justify-center items-center h-24 gap-2 px-2 py-2">
                          <NavLink
                            to={`/product/update/${product.id}`}
                            className="w-full text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-purple-600 rounded transition"
                          >
                            ✏️ Edit
                          </NavLink>
                          <button
                            className="w-full text-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded transition"
                            onClick={() => handleDelete(product.id)}
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
        </div>
      ) : (
        <p className="text-center text-gray-500 py-10">No products available.</p>
      )}
    </div>
  );
}
