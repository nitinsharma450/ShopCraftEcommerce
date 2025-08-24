import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LuLoader } from "react-icons/lu";
import { FiFilter, FiSearch } from "react-icons/fi";
import { AuthenticationService } from "../lib/AuthenticationService";
import { Api } from "../lib/ApiService";
 

export default function Shop() {
  let checkout_id: any;
  let navigate=useNavigate();
  const [product, setProduct] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState<any[]>([]);
  const [filterKey, setFilterKey] = useState<any>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [skip, setSkip] = useState(0);
  const limit = 15;
  const range = 2;
  const [paginated, setPaginated] = useState({
    total: 0,
    limit: limit,
    skip: 0,
  });

  async function filterProduct() {
   
      
      if (!filterKey || filterKey === "all") {
        loadProducts(); // Load all products
        return;
      }
      console.log(filterKey)

      try {
        setLoading(true);
        let response = await Api("product/filter", { filterKey });

        if (response && response.data) {
          setProduct(response.data); // set filtered data
        }
        setLoading(false)
      } catch (err) {
        console.error("Error filtering products:", err);
      } 
    
  }

  async function loadProducts() {
    const details = localStorage.getItem("auth_token");
    let token = "";

    if (details) {
      const updateDetails = JSON.parse(details);
      token = updateDetails.validAccessToken;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:9999/api/website/getproduct`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const products = await response.json();
      setPaginated(products);
      setProduct(products.products);
    } catch (err) {
      console.error("Error loading products:", err);
    }

    setLoading(false);
  }
 async function checkout(id:Number){

  if(await AuthenticationService.isAuthenticated()){
    let storage_response=localStorage.getItem('auth_token');

     let jsonResponse=JSON.parse(storage_response || '')
    let payload={
      user_id:jsonResponse.userId,
      product_id:id,
      quantity:1
    }
     let apiResponse=await Api('buynow/checkout',payload)
   checkout_id=apiResponse.data

   if(apiResponse.status==200){
  navigate(`/checkout/${checkout_id}`)
   }
  }
  else{
    navigate('/login')
  }
}

 async function getProductCategories() {

    try {
      const response = await Api("category/search");  
      console.log("Category response:", response);
      setCategories(response);  
    
  }
  catch (err) {
      console.error("Failed to load categories:", err);
    }
}


  useEffect(() => {
    getProductCategories();
    loadProducts();
  }, []);

  useEffect(() => {
    filterProduct();
  }, [filterKey]);

  const pages = Math.ceil(paginated.total / limit);
  const start_range = currentPage <= range ? 0 : currentPage - range;
  const end_range = currentPage <= 1 ? range * 2 : currentPage + (range + 1);

  return (
    <>
      {/* Search & Filter Bar */}
      <div className="w-full px-5 py-6 bg-gray-100 shadow-sm ">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          {/* Search Bar */}
          <div className="relative w-full md:w-1/2 bg-white" >
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search for products..."
              onChange={(e) => setFilterKey(e.target.value)}  
              
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm shadow-sm"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-500 text-lg" />
            <select
              onChange={(e) => setFilterKey(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm shadow-sm"
            >
              <option value="all">All Categories</option>
              {categories.map((value: any, index) => (
                <option key={index} value={value.name}>
                  {value.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto">
        {loading ? (
          <div className="h-[100px] flex items-center justify-center">
            <LuLoader className="animate-spin h-6 w-6" />
          </div>
        ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-6 bg-gray-100">
  {product.length>0 ? product.map((item: any) => (
    <div >
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden relative group">
        
        {/* Image */}
        <NavLink to={`/details/${item.id}`} key={item.id} className="aspect-square overflow-hidden bg-gray-100">
       <img
  src={item.image_url}
  alt={item.title}
  className="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-105"
/>

        </NavLink>

        {/* Info */}
        <div className="p-4 space-y-1">
          <h3 className="text-sm font-bold text-gray-800 truncate">{item.title}</h3>
          <p className="text-xs text-gray-500">
            <span className="font-semibold">Brand:</span> {item.brand}
          </p>
          <p className="text-xs text-gray-500">
            <span className="font-semibold">Category:</span> {item.category}
          </p>

          {/* Action Row */}
          <div className="flex items-center justify-between mt-3">
            <button 
            onClick={()=>checkout(item.id)}
              className="flex items-center gap-1 cursor-pointer text-white text-sm px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow"
            >
              🛒 Buy Now
            </button>
            <p className="text-lg font-bold text-blue-700">₹{item.price}</p>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {item.rating > 4.5 && (
            <span className="bg-red-500 text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase shadow">🔥 Hot</span>
          )}
          {item.discountPercentage >= 15 && (
            <span className="bg-green-600 text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase shadow">New</span>
          )}
          {item.discountPercentage > 30 && (
            <span className="bg-blue-600 text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase shadow">
              {Math.floor(item.discountPercentage)}% Off
            </span>
          )}
        </div>
      </div>
    </div>
  )):(
    <div className="col-span-full text-center text-gray-500 text-lg font-semibold">
      🚫 No product found
    </div>
  )}
</div>

        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 py-4">
          {currentPage > 1 && (
            <button
              onClick={() => {
                setCurrentPage((c) => c - 1);
                setSkip(paginated.limit * currentPage - 1);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow"
            >
              Prev
            </button>
          )}

          {Array.from({ length: pages }, (_, i) => i)
            .slice(start_range, end_range)
            .map((index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentPage(index);
                  setSkip(paginated.limit * index);
                }}
                className={`px-4 py-2 rounded-full ${
                  index === currentPage
                    ? "bg-blue-700 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {index + 1}
              </button>
            ))}

          {currentPage < pages - 1 && (
            <button
              onClick={() => {
                setCurrentPage((c) => c + 1);
                setSkip(paginated.limit * currentPage + 1);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </>
  );
}
