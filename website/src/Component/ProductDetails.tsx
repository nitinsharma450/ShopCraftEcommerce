import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import CenterSpinner from "./CenterSpinner";
import { ApiConfig } from "../data/ApiConfig";
import { CartService } from "../lib/CartService";
import { toast } from "react-toastify";

export default function ProductDetails() {
  const param = useParams();
  const [productDetails, setProductDetails] = useState<any>(null);
  const [filterProduct, setFilterProduct] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadDetails() {
    setLoading(true);
    let token = "";
    try {
      const response = localStorage.getItem("auth_token");
      if (response) {
        let updated_response = JSON.parse(response);
        token = updated_response.validAccessToken;
      }

      const details = await fetch(
        ApiConfig.Endpoint + "product/detail/" + param.id,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const UpdatedDetails = await details.json();


      setProductDetails(UpdatedDetails);
      console.log("ewew",UpdatedDetails);
      const category = UpdatedDetails.category;

      

      const restProduct = await fetch(
        ApiConfig.Endpoint + "product/search/" + category,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updateRestProduct = await restProduct.json();
      const ArrayrestProduct = updateRestProduct.products;

      setFilterProduct(
        ArrayrestProduct.filter((p: any) => p.category === category)
      );
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
    setLoading(false);
  }

 async function addcart(product: any) {
  const key = ApiConfig.CartLocalStorageKey;

  // ✅ Load existing product IDs from localStorage
  let stored = localStorage.getItem(key);
  let productIds: any[] = stored ? JSON.parse(stored) : [];

  // ✅ Add product ID if not already in the list
  if (!productIds.includes(product.id)) {
    productIds.push(product.id);
    localStorage.setItem(key, JSON.stringify(productIds));
    toast.success('product added to cart successfully')
  }

  // ✅ Update cart
  await CartService.updateCart(product, 1);
}


  useEffect(() => {
    loadDetails();
  }, [param]);

  return (
    <>
      {loading && <CenterSpinner />}

      {!loading && productDetails && (
        <>
         <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-xl mt-10">
  {/* Product Section */}
  <div className="flex flex-col lg:flex-row items-start gap-8">
    
    {/* Left: Image */}
    <div className="flex-1">
      <div className="rounded-xl border bg-gray-50 p-4 shadow-sm">
        <img
          src={productDetails.image_url}
          alt={productDetails.title}
          className="w-full h-auto object-contain rounded-xl"
        />
      </div>
      {/* Tags */}
      <div className="mt-3 flex flex-wrap gap-2">
        {JSON.parse(productDetails.tags || "[]").map((tag: string, idx: number) => (
          <span
            key={idx}
            className="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>

    {/* Right: Details */}
    <div className="flex-1 space-y-4">
      <h1 className="text-3xl font-bold text-gray-800">{productDetails.title}</h1>
      <p className="text-gray-600 text-sm">{productDetails.description}</p>

      <div className="text-sm text-gray-500 space-y-1">
        <p><strong>Brand:</strong> {productDetails.brand}</p>
        <p><strong>Category:</strong> {productDetails.category}</p>
        <p><strong>Warranty:</strong> {productDetails.warrantyInformation}</p>
        <p><strong>Shipping:</strong> {productDetails.shippingInformation}</p>
        <p>
          <strong>Availability:</strong>{" "}
          <span className={productDetails.availabilityStatus === "Out of Stock" ? "text-red-500" : "text-green-600"}>
            {productDetails.availabilityStatus}
          </span>
        </p>
        <p><strong>Stock:</strong> {productDetails.stock}</p>
      </div>

      <div className="text-lg font-semibold text-green-600">
        ₹{productDetails.price}{" "}
        <span className="text-sm text-gray-400 ml-2">
          ({productDetails.discountPercentage}% OFF)
        </span>
      </div>

      <p className="text-yellow-600 font-medium">⭐ {productDetails.rating} Rating</p>

      <div className="flex gap-4 mt-4">
        <button
          onClick={() => addcart(productDetails)}
          className="px-6 py-2 cursor-pointer rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow"
        >
          Add to Cart
        </button>
       
      </div>

      {/* Dimensions */}
      <div className="mt-4">
        <h3 className="font-bold text-sm text-gray-800 mb-1">Dimensions:</h3>
        <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
          <li>Width: {productDetails.dimensions?.width} cm</li>
          <li>Height: {productDetails.dimensions?.height} cm</li>
          <li>Depth: {productDetails.dimensions?.depth} cm</li>
          <li>Weight: {productDetails.weight} g</li>
        </ul>
      </div>
    </div>
  </div>

  {/* Reviews */}
  <div className="mt-10 border-t pt-6">
    <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
    <div className="space-y-4">
      {productDetails.reviews?.length > 0 ? (
        productDetails.reviews.map((review: any, index: number) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="font-semibold text-gray-800">{review.reviewerName}</p>
            <p className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString()}</p>
            <p className="text-sm text-yellow-600">⭐ {review.rating}</p>
            <p className="text-sm text-gray-700">{review.comment}</p>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-400">No reviews yet.</p>
      )}
    </div>
  </div>
</div>


          {/* Related Products */}
       <div className="max-w-6xl mx-auto mt-12 px-6">
  <h2 className="text-2xl font-bold mb-4">Related Products</h2>
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
    {filterProduct.map((value) => (
      <NavLink
        key={value.id}
        to={`/details/${value.id}`}
        className="bg-white rounded-xl shadow hover:shadow-md p-3 transition group"
      >
        <div className="aspect-square overflow-hidden rounded-md bg-gray-100">
          <img
            src={value.image_url}
            alt={value.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
        <div className="mt-2 text-center">
          <p className="text-sm font-semibold truncate">{value.title}</p>
          <p className="text-sm text-green-700 font-bold">₹{value.price}</p>
        </div>
      </NavLink>
    ))}
  </div>
</div>

        </>
      )}
    </>
  );
}
