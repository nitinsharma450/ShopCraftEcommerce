import { lazy, Suspense } from "react";


import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProductDetails from "./Component/ProductDetails";
import CenterSpinner from "./Component/CenterSpinner";

import Cart from "./Component/Cart";
import CheckOut from "./Component/CheckOut";

import Login from "./Component/Login";

import Home from "./Component/Home";
import Logout from "./Component/Logout";
import { ToastContainer } from "react-toastify";
import OrderConfirmation from "./Component/OrderConfirmation";
import Shop from "./Component/Shop";
import Layout from "./Component/Layout";
import Faqs from "./Component/Faqs";


const LazyLoadShop = lazy(() => import("./Component/Shop"));
const LazyMyOrders=lazy(()=>import('./Component/MyOrders'))

function App() {
  return (
    <>

    <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
      <BrowserRouter>
     
        <Routes>


          <Route path="/login" element={<Login />} />
          <Route element={<Layout />} >
          <Route path="/faqs" element={<Faqs />} />

          <Route
            path="/shop"
            element={
              <Suspense fallback={<CenterSpinner />}>
                <LazyLoadShop />
              </Suspense>
            }
          />
          <Route path="/" element={<Shop />}/>
         <Route path="/orderconfirmation/:orderId" element={<OrderConfirmation />} />

          <Route path="/details/:id" element={<ProductDetails />} />
          
         
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout/:checkout_id" element={<CheckOut />} />

          
          <Route path="/home" element={<Home />} />
          <Route path="/myorders" element={<Suspense fallback={<CenterSpinner />}><LazyMyOrders /></Suspense>} />

          <Route path="/logout" element={<Logout />} />
          </Route>
        </Routes>
      
      </BrowserRouter>
    </>
  );
}

export default App;
