import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import DashBoard from "./component/DashBoard";
import { ToastContainer } from "react-toastify";

 

import Layout from "./component/Layout";
 

import ProductCategoryEditor from "./pages/product-category/ProductCategoryEditor";
import { lazy, Suspense } from "react";
import Spinner from "./component/Spinner";
import AddProduct from "./pages/product/AddProduct";
 
import AddUser from "./pages/user/AddUser";



const LazyCategoryListing=lazy(()=>import('./pages/product-category/ProductCategoryListing'))
const LazyProductListing=lazy(()=>import('./pages/product/ProductListing'))
const LazyProductCategoryEditor=lazy(()=>import('./pages/product-category/ProductCategoryEditor'))
const LazyUserListing=lazy(()=>import('./pages/user/UserListing'))


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
                 
                  <Route path="/" element={<AdminLogin />} />

        <Route element={<Layout />}>
          <Route path="/addproduct" element={<AddProduct />} />
          <Route  path="/product/update/:product_id" element={<AddProduct />}/>
          <Route path="/dashboard/product-category/edit/:record_id" element={<ProductCategoryEditor />} />

          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/dashboard/product" element={<Suspense fallback={<Spinner />}><LazyProductListing /></Suspense>} />
          <Route path="/dashboard/userlisting" element={<Suspense fallback={<Spinner />}><LazyUserListing /></Suspense>} />
          <Route path="/dashboard/saveusers"element={<AddUser />} />
         <Route path="/dashboard/saveusers/:userId" element={<AddUser />} />

          <Route path="/product-category" element={<Suspense fallback={<Spinner />}> <LazyCategoryListing /></Suspense>} />
          <Route path="/product-category/create" element={<Suspense fallback={<Spinner />}> <LazyProductCategoryEditor /></Suspense>} />
          <Route path="/product-category/update/:record_id" element={<Suspense fallback={<Spinner />}> <LazyProductCategoryEditor /></Suspense>} />

        </Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
