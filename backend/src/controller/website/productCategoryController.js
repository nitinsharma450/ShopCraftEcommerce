import { db } from "../../connection.js";

export class ProductCategoryController{
    static async searchCategory(req, res) {
      let [category] = await db.query("select * from product_category", []);
      res.send(category);
    }
} 