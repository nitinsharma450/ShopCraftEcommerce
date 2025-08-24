import express from "express";
import { ProductController } from "../controller/admin/ProductController.js";
import { AdminController } from "../controller/AdminController.js";
import AdminGuardMiddleware from "../middlewares/AdminGuardMiddleware.js";
import { ProductCategoryController } from "../controller/admin/ProductCategoryController.js";
import { UserController } from "../controller/admin/UserController.js";



// /api/admin/login

export const  adminRouter = new express.Router();

adminRouter.post('/login',AdminController.adminLogin)
adminRouter.post('/signup',AdminController.adminSignup)



adminRouter.use(AdminGuardMiddleware)



//products
adminRouter.post("/product/create", ProductController.create);
adminRouter.post("/product/update", ProductController.update);
adminRouter.post("/product/remove", ProductController.remove);
adminRouter.post('/product/category',ProductController.category);
adminRouter.post('/product/searchAll',ProductController.searchAll)
adminRouter.post('/product/searchById',ProductController.searchById)
adminRouter.post('/product/filter',ProductController.filter)
adminRouter.post('/product/searchcount',ProductController.searchCount)

// Product Categories
adminRouter.post('/product-category/suggest',ProductCategoryController.suggest);
adminRouter.post('/product-category/search',ProductCategoryController.searchCategory);
adminRouter.post('/product-category/create',ProductCategoryController.createCategory);
adminRouter.post('/product-category/detail',ProductCategoryController.detail);
adminRouter.post('/product-category/update',ProductCategoryController.update);
adminRouter.post('/product-category/remove',ProductCategoryController.remove);
adminRouter.post('/product-category/filter',ProductCategoryController.filter)
adminRouter.post('/product-category/searchcount',ProductCategoryController.searchCount)

//user

adminRouter.post('/user/search',UserController.search)
adminRouter.post('/user/searchById',UserController.searchById)
adminRouter.post('/user/searchByIdAdmin',UserController.searchByIdAdmin)
adminRouter.post('/user/create',UserController.create)
adminRouter.post('/user/update',UserController.update)
adminRouter.post('/user/remove',UserController.remove)
adminRouter.post('/user/searchcount',UserController.searchCount)


