import { useEffect, useState } from "react";
import { AuthenticationService } from "../lib/AuthenticationService";
import { Api } from "../lib/ApiService";
 
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function CheckOut() {
  const [productDetails, setProductDetails] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>({});
  const [shippingAddressForm, setShippingAddressForm] = useState<any>({});
  const [errors, setErrors] = useState<any>({});
  const [paymentMode, setPaymentMode] = useState<string>("");
const [upiId, setUpiId] = useState<string>("");
let navigate=useNavigate()



 let {checkout_id}= useParams()

  async function checkoutPurchaseProduct() {
  
    
      if (await AuthenticationService.isAuthenticated()) {
       
        const response = await Api("product/singlesearch", { checkout_id });

        if (response?.data) {
          setProductDetails(response.data);
       
        }
      
    }
   
  }

    async function userDetails() {
    if (await AuthenticationService.isAuthenticated()) {
      let storageResponse = localStorage.getItem("auth_token");
      let parseResponse = JSON.parse(storageResponse || '');
      let userId = parseResponse.userId;
      let response = await Api("user", { userId });
      if (response) setUserData(response);
    }
  }

  async function purchase() {
  if (
    !shippingAddressForm.name ||
    !shippingAddressForm.email ||
    !shippingAddressForm.phone ||
    !shippingAddressForm.landmark ||
    !shippingAddressForm.city ||
    !shippingAddressForm.pincode
  ) {
    setErrors({ error: "Please fill all required fields (*)" });
    return;
  }

  if (!paymentMode) {
    setErrors({ payment: "Please select a mode of payment" });
    return;
  }

  if (paymentMode === "upi" && !upiId) {
    setErrors({ payment: "Please enter your UPI ID" });
    return;
  }

  try {
    if (await AuthenticationService.isAuthenticated()) {
      const payload = {
        userId: userData.id,
        shippingInfo: shippingAddressForm,
        checkoutId: checkout_id,
        paymentMode: paymentMode,
        paymentStatus: paymentMode === "cod" ? "pending" : "initiated",
      };

      const res = await Api("purchase/checkout", payload);
      let orderId=res.orderId
  
   if (res.status === 200) {
  toast.success("✅ Order placed successfully!");
 navigate(`/orderconfirmation/${orderId}`);

   
}
else{
 toast.error("❌ Failed to complete purchase. Please try again.");
}
    }
  } catch (err) {
    console.error("Checkout failed:", err);
    toast.error("❌ Failed to complete purchase. Please try again.");
  }
}


  const subtotal = productDetails.reduce((sum, item) => {
    const qty = item.quantity;
    return sum + item.price * qty;
  }, 0); 

  const shipping = 50;
  const tax = +(subtotal * 0.05).toFixed(2);
  const total = +(subtotal + shipping + tax).toFixed(2);

  useEffect(() => {    
    userDetails();
    checkoutPurchaseProduct();
  }, []);

  useEffect(() => {
    setErrors({});
  }, [shippingAddressForm]);

  const requiredLabel = (text: string) => (
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {text} <span className="text-red-600">*</span>
    </label>
  );

  return (
    <div className=" bg-gray-100 py-10 px-4 md:px-12">
      <h1 className="text-3xl font-bold mb-1">🧾 Checkout</h1>
      <p className="text-gray-600 mb-8">Complete your purchase securely</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left - Shipping Form */}
        <div className="lg:col-span-2 space-y-8">

          {/* Customer Info */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">👤 Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                {requiredLabel("Full Name")}
                <input className="w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" value={userData.name || ""} readOnly />
              </div>
              <div>
                {requiredLabel("Email Address")}
                <input className="w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" value={userData.email || ""} readOnly />
              </div>
              <div className="md:col-span-2">
                {requiredLabel("Phone Number")}
                <input className="w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" value={userData.phone_number || ""} readOnly />
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">📦 Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Input fields */}
              <div>
                {requiredLabel("Recipient Name")}
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setShippingAddressForm({ ...shippingAddressForm, name: e.target.value })}
                />
                  {errors.error && <p className="text-red-500 font-bold mt-2">{errors.error}</p>}
              </div>
              <div>
                {requiredLabel("Email")}
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setShippingAddressForm({ ...shippingAddressForm, email: e.target.value })}
                />
                  {errors.error && <p className="text-red-500 font-bold mt-2">{errors.error}</p>}
              </div>
              <div className="md:col-span-2">
                {requiredLabel("Phone")}
                <input
                  type="tel"
                  placeholder="10-digit number"
                  className="w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setShippingAddressForm({ ...shippingAddressForm, phone: e.target.value })}
                />
                  {errors.error && <p className="text-red-500 font-bold mt-2">{errors.error}</p>}
              </div>
              <div className="md:col-span-2">
                {requiredLabel("landmark")}
                <input
                  type="text"
                  placeholder="Street, Building, Locality"
                  className="w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setShippingAddressForm({ ...shippingAddressForm, landmark: e.target.value })}
                />
                  {errors.error && <p className="text-red-500 font-bold mt-2">{errors.error}</p>}
              </div>
              <div>
                {requiredLabel("City")}
                <input
                  type="text"
                  placeholder="City"
                  className="w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setShippingAddressForm({ ...shippingAddressForm, city: e.target.value })}
                />
                 {errors.error && <p className="text-red-500 font-bold mt-2">{errors.error}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  placeholder="State"
                  className="w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setShippingAddressForm({ ...shippingAddressForm, state: e.target.value })}
                />
              </div>
              <div>
                {requiredLabel("Pincode")}
                <input 
                  type="text"
                  placeholder="Postal Code"
                  className="w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setShippingAddressForm({ ...shippingAddressForm, pincode: e.target.value })}
                />
                 {errors.error && <p className="text-red-500 font-bold mt-2">{errors.error}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  defaultValue="India"
                  className="w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setShippingAddressForm({ ...shippingAddressForm, country: e.target.value })}
                />
              </div>
            </div>

            
          </div>

             {/* {Mode of Payment}  */}
          <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-md border border-gray-200">
  <h2 className="text-xl font-semibold mb-4">💳 Mode of Payment</h2>
  <div className="space-y-4">

    {/* Credit/Debit Card Option */}
    <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
      <input
        type="radio"
        name="paymentMode"
        value="card"
        className="accent-blue-600"
        onChange={(e) => setPaymentMode(e.target.value)}
      />
      <div>
        <p className="font-medium text-gray-800">Credit/Debit Card</p>
        <p className="text-sm text-gray-500">Pay with Visa, MasterCard, etc.</p>
      </div>
    </label>

    {/* UPI Option */}
    <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
      <input
        type="radio"
        name="paymentMode"
        value="upi"
        className="accent-blue-600"
        onChange={(e) => setPaymentMode(e.target.value)}
      />
      <div>
        <p className="font-medium text-gray-800">UPI</p>
        <p className="text-sm text-gray-500">Google Pay, PhonePe, Paytm</p>
      </div>
    </label>

    {/* Show UPI input if selected */}
    {paymentMode === "upi" && (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Enter your UPI ID</label>
        <input
          type="text"
          placeholder="example@upi"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
          className="w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    )}

    {/* Cash on Delivery Option */}
    <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
      <input
        type="radio"
        name="paymentMode"
        value="cod"
        className="accent-blue-600"
        onChange={(e) => setPaymentMode(e.target.value)}
      />
      <div>
        <p className="font-medium text-gray-800">Cash on Delivery</p>
        <p className="text-sm text-gray-500">Pay when the product arrives</p>
      </div>
    </label>

    {errors.payment && <p className="text-red-500 text-sm">{errors.payment}</p>}
  </div>
</div>
        </div>

 


        {/* Right - Order Summary */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 h-fit">
          <h2 className="text-xl font-semibold mb-6 border-b pb-2">🛒 Order Summary</h2>

          {productDetails.map((value, index) => (
            <div key={index} className="flex items-start gap-4 border-b pb-4">
              <img src={value.image_url} alt={value.title} className="w-20 h-20 object-cover rounded-lg border" />
              <div className="flex-1 space-y-1">
                <h3 className="font-semibold text-lg">{value.title}</h3>
                {value.brand && <p className="text-sm text-gray-500">Brand: {value.brand}</p>}
                <p className="text-sm text-gray-500">Qty: {value.quantity}</p>
                <p className="text-sm text-gray-500">Unit Price: ₹{value.price}</p>
                <p className="text-base font-medium text-gray-800">
                  Total: ₹{(value.price * (value.quantity || value.quantity)).toFixed(2)}
                </p>
              </div>
            </div>
          ))}

          {/* Price Summary */}
          <div className="pt-4 space-y-2 text-sm text-gray-700">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>₹{shipping}</span></div>
            <div className="flex justify-between"><span>Tax (GST)</span><span>₹{tax}</span></div>
            <div className="flex justify-between font-semibold text-base pt-1 border-t mt-2">
              <span>Total</span><span className="text-blue-600">₹{total}</span>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="text-sm text-gray-600 mt-4">
            <p className="font-medium mb-1">📦 Estimated Delivery:</p>
            <strong>{productDetails[0]?.shippingInformation || "2–5 business days"}</strong>
          </div>


          {/* Purchase Button */}
          <button
            className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700 transition-all duration-200"
            onClick={purchase}
          >
            🛒 Complete Purchase
          </button>
        </div>

        
      </div>
    </div>
  );
  }
