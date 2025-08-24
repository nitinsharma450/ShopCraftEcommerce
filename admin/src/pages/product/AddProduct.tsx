import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthenticationService } from "../../services/AuthenticationService ";
import { Api } from "../../services/ApiService";
import { ApiConfig } from "../../configs/ApiConfig";



export default function AddProduct() {
  const navigate = useNavigate();
  const [productForm, setProductForm] = useState<any>({});
  const [result, setResult] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const {product_id}=useParams()

  const fetchCategories = async () => {
    const records = await Api("product-category/suggest");
    setCategories(records);
  };

const save=async (product_id:Number)=>{

  let response=await Api('product/searchById',{product_id})
  console.log(response)
setProductForm(response.data)
}

  const onSubmit = async () => {
  if (await AuthenticationService.isAuthenticated()) {
    try {
      const formData = new FormData();
      
      for (let key in productForm) {
        if (key === "image_url") {
          if (productForm[key] instanceof File) {
            formData.append("image", productForm[key]);
          }
        } else {
          formData.append(key, productForm[key]);
        }
      }

     

      const endpoint = product_id ? "product/update" : "product/create";

      const res = await fetch(ApiConfig.EndPoint + endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${await AuthenticationService.getToken()}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data);
        alert(product_id ? "Product updated successfully" : "Product uploaded successfully");
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (err: any) {
      alert("Error uploading: " + err.message);
    }
  } else {
    alert("User not authenticated");
  }
};

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    
    setProductForm((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchCategories();
    if(product_id){
      save(Number(product_id))
    }
  }, []);

  function setPreviewUrl(arg0: string) {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="mb-6 flex items-center gap-4">
        <button
          className="px-4 py-2 bg-white border rounded-md shadow-sm hover:bg-gray-100"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        {product_id ? <h1 className="text-3xl font-bold">Update Product</h1>: <h1 className="text-3xl font-bold">Add New Product</h1>}
        
      </div>

      <div className="bg-white p-8 rounded-xl shadow-md grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <label className="block font-medium mb-1">Product Name</label>
            <input
              name="title"
              type="text"
              value={productForm.title}
              placeholder="Enter product name"
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Price ($)</label>
              <input
                name="price"
                type="number"
                defaultValue={0}
                value={productForm.price}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Stock</label>
              <input
                name="stock"
                type="number"
                defaultValue={0}
                  value={productForm.stock}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Discount (%)</label>
              <input
                name="discountPercentage"
                type="number"
                  value={productForm.discountPercentage}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-md"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Rating</label>
              <input
                name="rating"
                type="number"
                  value={productForm.rating}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Category</label>
              <select
                name="category"
                  value={productForm.category}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-md"
              >
                <option value="">Select a category</option>
                {categories.map((cat: any) => (
                  <option key={cat.id || cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Brand</label>
              <input
                name="brand"
                type="text"
                  value={productForm.brand}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Warranty Information</label>
            <input
              name="warrantyInformation"
              type="text"
              value={productForm.warrantyInformation}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Shipping Information</label>
            <input
              name="shippingInformation"
              type="text"
                value={productForm.shippingInformation}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Availability Status</label>
            <select
              name="availabilityStatus"
                value={productForm.availabilityStatus}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
            >
              <option>In Stock</option>
              <option>Out of Stock</option>
              <option>Pre-Order</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Tags (comma separated)</label>
            <input
              name="tags"
              type="text"
                value={productForm.tags}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              name="description"
              rows={4}
              value={productForm.description}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
            />
          </div>
        </div>

        {/* Right Column: Image Upload */}
        <div className="flex flex-col justify-center">
  <label className="block font-medium mb-2">Product Image</label>

  <div
    className="border-2 border-dashed border-gray-300 rounded-md h-64 flex flex-col items-center justify-center text-gray-500 p-4 text-center relative"
    onDragOver={(e) => e.preventDefault()}
    onDrop={(e) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) {
        setProductForm((prev: any) => ({
          ...prev,
          image_url: file,
        }));
        setPreviewUrl(URL.createObjectURL(file));
      }
    }}
  >
    {(() => {
      if (productForm.image_url instanceof File) {
        return (
          <img
            src={URL.createObjectURL(productForm.image_url)}
            alt="Preview"
            className="w-full h-full object-contain rounded-md"
          />
        );
      } else if (typeof productForm.image_url === "string") {
        return (
          <img
            src={
              productForm.image_url.startsWith("http")
                ? productForm.image_url
                : `${ApiConfig.EndPoint}public${productForm.image_url}`
            }
            alt="Preview"
            className="w-full h-full object-contain rounded-md"
          />
        );
      } else {
        return (
          <>
            <div className="text-4xl">⬆️</div>
            <p className="mt-2">Click to upload or drag and drop</p>
            <p className="text-sm">PNG, JPG</p>
          </>
        );
      }
    })()}

    <input
      type="file"
      id="product-image"
      className="hidden"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          setProductForm((prev: any) => ({
            ...prev,
            image_url: file,
          }));
          setPreviewUrl(URL.createObjectURL(file));
        }
      }}
    />
    <label
      htmlFor="product-image"
      className="absolute bottom-4 px-4 py-2 bg-purple-600 text-white rounded-md cursor-pointer hover:bg-purple-700"
    >
      {productForm.image_url ? "Change Image" : "Choose File"}
    </label>
  </div>

  <button
    className="mt-10 p-3 text-white font-bold bg-purple-600 rounded-2xl cursor-pointer"
    onClick={onSubmit}
  >
    {product_id ? "Update Product" : "Upload Product"}
  </button>
</div>

      </div>
    </div>
  );
}
