import { useEffect, useState } from 'react';
import { AuthenticationService } from '../lib/AuthenticationService';
import { Api } from '../lib/ApiService';
import { IoCube } from "react-icons/io5";
import { FaCalendarAlt } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { format } from 'date-fns';  
import { toast } from 'react-toastify';
import { ImCross } from 'react-icons/im';

export default function MyOrders() {
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [reasonModel,showReasonModel]=useState<any>(false);
  const [cancelReason,setCancelReason]=useState<any>("")
  const [selectedOrderId,setSelectedOrderId]=useState<any>(Number)
const cancelReasons = [
  "Ordered by mistake",
  "Found cheaper elsewhere",
  "Item not needed anymore",
  "Shipping is delayed",
  "Other"
];


  async function fetchMyorders() {
    if (await AuthenticationService.isAuthenticated()) {
      const storageResponse = localStorage.getItem('auth_token');
      const jsonResponse = JSON.parse(storageResponse || '{}');
      const userId = jsonResponse.userId;
      const response = await Api('user/myorders', { userId });
      setMyOrders(response.data || []);
    }
  }

  async function cancelOrder(orderId:number){
   
    try {
      
      if(await AuthenticationService.isAuthenticated()){
         let response= await Api('user/cancelorder',{orderId,cancelReason})
         if(response.status==200)
         {
         toast.success('order cancel successfully')
         fetchMyorders()
         }
         
         
      }
    

    } catch (error) {
      console.log(error)
      toast.error("unable to cancel order")
    }
   

  }

  useEffect(() => {
    fetchMyorders();
  }, []);

  return (


    <>

 {reasonModel && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 sm:p-8 relative">
      
      {/* Close Icon */}
      <button
        onClick={() => showReasonModel(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
        aria-label="Close"
      >
        <ImCross size={18} />
      </button>

      {/* Title */}
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
        Cancel Order
      </h2>

      <p className="text-sm text-gray-600 mb-4">
        Please select a reason for cancelling your order:
      </p>

      {/* Reason List */}
      <div className="space-y-3 mb-6">
        {cancelReasons.map((value: string, index: number) => (
          <label key={index} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="cancelReason"
              value={value}
              checked={cancelReason === value}
              onChange={(e) => setCancelReason(e.target.value)}
              className="accent-blue-600 w-4 h-4"
            />
            <span className="text-gray-800 text-sm">{value}</span>
          </label>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => showReasonModel(false)}
          className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            showReasonModel(false);
            cancelOrder(selectedOrderId);
          }}
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
)}



    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-2 mb-8">
        <IoCube size={35} className="text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
      </div>

      <div className="space-y-6">
        {myOrders.map((order, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-200"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  Order #{order.id.toString().padStart(6, '0')}
                </h2>
                <div className="flex items-center text-sm text-gray-500">
                  <FaCalendarAlt className="mr-2" />
                  {format(new Date(order.order_timestamp), "dd MMM yyyy, hh:mm a")}
                </div>
              </div>

              <div className="text-right mt-4 md:mt-0">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.payment_status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {order.payment_status === "pending" ? "Pending" : "Paid"}
                </span>
                <div className="text-lg font-bold mt-2 text-blue-600">
                  ₹{order.total_price}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-4">
              {/* Product Image */}
              <div className="w-full sm:w-28 h-28 border rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={order.imageUrl }
                  alt="product"
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 space-y-2 text-sm text-gray-700">
                <div>
                  <strong>Product Category:</strong> {order.product_category}
                </div>
                <div>
                  <strong>Quantity:</strong> {order.quantity}
                </div>
                <div>
                  <strong>Payment Method:</strong> {order.payment_method.toUpperCase()}
                </div>
                <div className="flex items-center">
                  <MdLocationOn className="text-gray-500 mr-2" />
                  {order.delivery_address}, {order.delivery_city}, {order.delivery_state} - {order.delivery_pincode}
                </div>
              </div>
            </div>

            {/* Optional Action Button */}
            <div className="text-right mt-4">
              <button className="p-2 rounded-sm cursor-pointer bg-blue-200 hover:bg-blue-400">
                Track Order
              </button>

              <button className='p-2 rounded-sm cursor-pointer '  onClick={()=>{setSelectedOrderId(order.id);showReasonModel(true)}}>

                Cancel Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
