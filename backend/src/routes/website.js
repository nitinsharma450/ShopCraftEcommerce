import express from "express";
import {
  
  NitinController2,
  
  users,
  InsertController,
  details,
  SignUp,
  Login,
} from "../controller/NitinController.js";
import UserGuardMiddleware from "../middlewares/UserGuardMiddleware.js";
import {  UserController } from "../controller/UserController.js";
import { CartController } from "../controller/CartController.js";
import { ProductController } from "../controller/admin/ProductController.js";
import { UserProductController } from "../controller/website/ProductController.js";

import GetProduct from "../controller/GetProduct.js";
import { ProductCategoryController } from "../controller/website/productCategoryController.js";
import { OrderPurchaseController } from "../controller/website/OrderPurchaseController.js";
import search from "../controller/GetProduct.js";

export const  websiteRouter = new express.Router();



websiteRouter.get("/insert", InsertController);
websiteRouter.get("/userDetails", details);
websiteRouter.post("/signup", SignUp);
websiteRouter.post("/login", Login);

websiteRouter.get("/getproduct", search);
websiteRouter.get("/product/detail/:id", ProductController.detail);

//product
websiteRouter.get("/product/search/:category", UserProductController.searchCategory);
websiteRouter.post('/product/filter',UserProductController.filter)

//category
websiteRouter.post('/category/search',ProductCategoryController.searchCategory)

//userApiGuard
websiteRouter.use(UserGuardMiddleware);

//websiteRouter.get("/current-profile", currentProfile);

websiteRouter.get("/home", NitinController2);


websiteRouter.post("/user", UserController.searchById);
websiteRouter.post('/userprofileupdate',UserController.update)
websiteRouter.post('/user/myorders',UserController.myorders)
websiteRouter.post('/user/cancelorder',UserController.cancelOrder)
websiteRouter.post('/user/orderconfirmationdetails',UserController.searchDetails)



 //cart
websiteRouter.post("/cart/add", CartController.addCart);
websiteRouter.post("/cart/search", CartController.search);
websiteRouter.post("/cart/update", CartController.updateCart);
websiteRouter.post("/cart/sync",CartController.syncCard)



//product

websiteRouter.post('/product/singlesearch',UserProductController.searchBySingleId)
websiteRouter.post('/product/multiplesearch',UserProductController.searchByMultipleId)



//order

websiteRouter.post('/cartorder/checkout',OrderPurchaseController.cartCheckout)
websiteRouter.post('/purchase/checkout',OrderPurchaseController.order)
websiteRouter.post('/buynow/checkout',OrderPurchaseController.buynowCheckout)

//payment

websiteRouter.post('/createorder',OrderPurchaseController.createPayment)