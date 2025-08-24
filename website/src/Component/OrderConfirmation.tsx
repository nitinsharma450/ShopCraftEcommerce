import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { NavLink, useParams } from "react-router-dom";
import { AuthenticationService } from "../lib/AuthenticationService";
import { Api } from "../lib/ApiService";

export default function OrderConfirmation() {
  const [orderconfirmationDetails, setOrderConfirmationDetails] = useState<any[]>([]);
  let orderId = useParams();

  async function confirmationDetails() {
    if (await AuthenticationService.isAuthenticated()) {
      try {
        let response = await Api("user/orderconfirmationdetails", orderId);
        console.log(response?.data)
        if (response) {
          setOrderConfirmationDetails(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    confirmationDetails();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 to-green-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full text-center border border-green-200">
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-4 rounded-full shadow-md animate-pulse">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>

        {/* Header Text */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Order Confirmed!
        </h1>
        <p className="text-gray-600 text-sm mb-6">
          Thank you for shopping with us. Your order has been{" "}
          <span className="text-green-700 font-medium">
            successfully placed
          </span>{" "}
          and is being processed.
        </p>

        {/* Estimated delivery */}
        <div className="text-sm text-gray-600 mb-6">
          <span className="font-semibold text-gray-800">
            Estimated Delivery:
          </span>{" "}
          <span className="text-gray-700">3–5 Business Days</span>
        </div>

        {/* Order Summary (optional placeholder) */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 text-left text-sm text-gray-700">
          {orderconfirmationDetails.map((value: any) => (
        
              <p>
                <p>
                  <span className="font-medium">Order ID:</span>
                  {value.id}
                </p>

                <p>
                  <span className="font-medium">Total price:</span>
                  {value.total_price}
                </p>

                  <p>
                  <span className="font-medium">Payment:</span>
                  {value.payment_method}
                </p>
              </p>
         
         
          ))}
          {/* <p><span className="font-medium">Order ID:</span> #ORD123456</p>
          <p><span className="font-medium">Total Amount:</span> ₹1,499.00</p>
          <p><span className="font-medium">Payment:</span> Cash on Delivery</p> */}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <NavLink
            to="/myorders"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-full font-medium shadow hover:bg-green-700 transition"
          >
            View My Orders
          </NavLink>
          <NavLink
            to="/shop"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white rounded-full font-medium shadow hover:bg-amber-600 transition"
          >
            Continue Shopping <FaArrowRight />
          </NavLink>
        </div>
      </div>
    </div>
  );
}
