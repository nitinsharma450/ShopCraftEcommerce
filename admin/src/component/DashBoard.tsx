import { FaUsers } from "react-icons/fa";
import { MdProductionQuantityLimits } from "react-icons/md";
import { TfiMoney } from "react-icons/tfi";
import { AuthenticationService } from "../services/AuthenticationService ";
import { Api } from "../services/ApiService";
import { useEffect, useState } from "react";

export default function DashBoard() {
 const [userCount,setUserCount]=useState<any>(Number)
 const[productCount,setProductCount]=useState<any>(Number)
 const[categoryCount,setCategoryCount]=useState<any>(Number)


  async function numberOfUser(){
       if(await AuthenticationService.isAuthenticated()){
       let response=await Api('user/searchcount')
 
       setUserCount(response.response)
       }
  }

   async function numberOfProduct(){
       if(await AuthenticationService.isAuthenticated()){
       let response=await Api('product/searchcount')
 
       setProductCount(response.response)
       }
  }

   async function numberOfCategory(){
       if(await AuthenticationService.isAuthenticated()){
       let response=await Api('product-category/searchcount')
 
       setCategoryCount(response.response)
       }
  }

  useEffect(()=>{
     numberOfUser()
     numberOfProduct()
     numberOfCategory()
  },[])

  return (
    <>
      <div>
        <div>
          <p className="  text-2xl font-bold mt-4 p-4">Dashboard Overview</p>
        </div>
        <div className="grid grid-cols-4 gap-5">
          <div className="flex items-center bg-white shadow-md rounded-xl p-10  m-10 w-64 border border-transparent hover:border-red-500 hover:scale-105 transition-transform duration-300">
            <div className="bg-yellow-500 p-3 rounded-md text-white mr-4">
              <FaUsers size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{userCount.total_users}</h3>
              <p className="text-sm text-gray-600">Total Users</p>
            </div>
          </div>

          <div className="flex items-center bg-white shadow-md rounded-xl p-10  m-10 w-64 border border-transparent hover:border-red-500 hover:scale-105 transition-transform duration-300">
            <div className="bg-orange-500 p-3 rounded-md text-white mr-4">
              <MdProductionQuantityLimits size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{productCount.total_product}</h3>
              <p className="text-sm text-gray-600">Products</p>
            </div>
          </div>

          <div className="flex items-center bg-white shadow-md rounded-xl p-10  m-10 w-64 border border-transparent hover:border-red-500 hover:scale-105 transition-transform duration-300">
            <div className="bg-green-500 p-3 rounded-md text-white mr-4">
              <TfiMoney size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">2,143</h3>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
          </div>

          <div className="flex items-center bg-white shadow-md rounded-xl p-10  m-10 w-64 border border-transparent hover:border-red-500 hover:scale-105 transition-transform duration-300">
            <div className="bg-purple-500 p-3 rounded-md text-white mr-4">
              <FaUsers size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{categoryCount.total_category}</h3>
              <p className="text-sm text-gray-600">Total Category</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
