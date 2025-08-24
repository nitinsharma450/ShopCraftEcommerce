import { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { CartService } from "../lib/CartService";
 
 
import { AuthenticationService } from "../lib/AuthenticationService";
import { Api } from "../lib/ApiService";

export default function Cart() {
  let checkout_id;
  const [cartItems, setCartItems] = useState<any[]>(CartService.cartItems);
  const [price, setPrice] = useState<number>(0);
let navigate=useNavigate();

  const calculateTotalValue = () => {
    let total = 0;
    CartService.cartItems.forEach((item: any) => {
      const item_price = Number(item.price);
      const item_quantity = Number(item.quantity);
      if (!isNaN(item_price) && !isNaN(item_quantity)) {
        total += item_price * item_quantity;
      }
    });
    setCartItems(CartService.cartItems);
    setPrice(total);
  };
  


  const increaseQuantity = async (product: any) => {
      var found = CartService.cartItems.find(ci=>ci.id == product.id);
    var quantity = 1;
    if(found){
      quantity = found.quantity + 1
    }
    await CartService.updateCart(product,quantity);
    calculateTotalValue();
  };

  const decreaseQuantity = async (product : any) => {
    var found = CartService.cartItems.find(ci=>ci.id == product.id);
    var quantity = 1;

  
    if(found){
      quantity = found.quantity - 1
    }
    await CartService.updateCart(product,quantity);
    calculateTotalValue();
  };
 const loadCart = async () => {
  const items =  await  CartService.searchCart();
      setCartItems(items);
      calculateTotalValue();
    };

   async function checkout(){


    if(await AuthenticationService.isAuthenticated()){
      let storageResponse=localStorage.getItem('auth_token')
    let json_response=JSON.parse(storageResponse || '')
    
    const payload = {
      user_id:  json_response.userId,
      items: cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    };
      let response=await Api('cartorder/checkout',payload)
      
    checkout_id=response.data
    console.log("id",checkout_id)
    if(response.status==200){
      navigate(`/checkout/${checkout_id}`)
    }
    }
    else{
      navigate('/login')
    }
    }

  useEffect(() => {
   

    loadCart();
  }, []);

  return (
    <>
      <div className="flex flex-row gap-10">
        <div className="max-w-4xl mx-auto p-6">
          <h2 className="text-2xl font-bold mb-4">🛒 Your Cart</h2>
          {cartItems.length === 0 && (
            <p className="text-gray-600">Your cart is empty.</p>
          )}

          <div className="space-y-4">
            {cartItems
              .filter((item) => item.quantity)
              .map((item) => {
                return (
                  <div
                    key={item?.id}
                    className="flex items-center gap-4 p-4 border rounded-md shadow-md"
                  >
                    <img
                      src={item?.image_url}
                      alt={item?.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item?.title}</h3>
                      <p className="text-sm text-gray-600">₹{item?.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decreaseQuantity(item)}
                        className="p-1 bg-red-100 rounded hover:bg-red-200"
                      >
                        <FaMinus />
                      </button>
                      <span className="w-6 text-center">{item?.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(item)}
                        className="p-1 bg-green-100 rounded hover:bg-green-200"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="flex flex-col justify-between max-w-4xl mx-auto mt-8 p-4 border-2 border-gray-200 rounded-lg shadow-lg bg-gray-50">
          <div className="flex flex-row justify-between items-center gap-10">
            <h2 className="font-semibold text-lg text-gray-700 ">Subtotal</h2>
            <p className="text-xl font-bold text-green-600">
              ₹{price.toFixed(2)}
            </p>
          </div>

          <button  className="p-3 text-white bg-orange-500" onClick={checkout}>
            PROCEED TO BUY
          </button>
        </div>
      </div>
    </>
  );
}
