import { db } from "../../connection.js";
import { ServerConfigs } from "../../configs/ServerConfigs.js";

export class UserProductController {
  static async filter(req, res) {
    let { filterKey } = req.body;

    try {
      const likeFilter = `%${filterKey}%`;

      let [filterData] = await db.query(
        `SELECT * FROM products 
       WHERE title LIKE ? OR brand LIKE ? OR category LIKE ?`,
        [likeFilter, likeFilter, likeFilter]
      );

      filterData = filterData.map((product) => ({
        ...product,
        image_url: `${ServerConfigs.Host}:${ServerConfigs.Port}/${ServerConfigs.PublicFolder}${product.image_url}`,
      }));

      res.send({ message: "success", status: 200, data: filterData });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Server error", error });
    }
  }

  static async searchCategory(req, res) {
    const category = req.params.category;

    let [products] = await db.query("select * from products where category=?", [
      category,
    ]);

    if (products.length === 0) {
      return res.status(404).send("product not found !!!");
    }

    products = products.map((product) => ({
      ...product,
      image_url: `${ServerConfigs.Host}:${ServerConfigs.Port}/${ServerConfigs.PublicFolder}${product.image_url}`,
    }));
    res.send({ products });
  }

  static async searchBySingleId(req, res) {
  let { checkout_id } = req.body;

  if (!checkout_id) {
    return res.status(500).send({ message: "checkout_id is required" });
  }

  try {
    let [row] = await db.query(
      `SELECT 
         checkout_item.*, 
         products.title, 
         products.image_url,  
         products.price,  
         products.brand,
         products.shippingInformation 
       FROM checkout_item
       JOIN products 
         ON checkout_item.product_id = products.id 
       WHERE checkout_id = ?`,
      [checkout_id]
    );

    if (row.length === 0) {
      return res.send({ message: "no product found" });
    }

    row = row.map((product) => ({
      ...product,
      image_url: `${ServerConfigs.Host}:${ServerConfigs.Port}/${ServerConfigs.PublicFolder}${product.image_url}`,
    }));

    return res.send({ message: "success", status: 200, data: row });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "internal server error", error });
  }
}

  static async searchByMultipleId(req, res) {
    let { product_ids } = req.body;

    if (
      !product_ids ||
      !Array.isArray(product_ids) ||
      product_ids.length === 0
    ) {
      return res.send({ message: "Product IDs are required", status: 500 });
    }

    try {
      let placeholders = product_ids.map(() => "?").join(",");
      let [rows] = await db.query(
        `SELECT 
     cart.*,
     products.title,
     products.image_url,
     products.price,
     products.brand,
     products.shippingInformation
   FROM cart
   JOIN products ON cart.product_id = products.id
   WHERE cart.product_id IN (${placeholders})`,
        product_ids
      );

      if (rows.length === 0) {
        return res.send({ message: "No products found", status: 404 });
      }

      rows = rows.map((product) => ({
        ...product,
        image_url: `${ServerConfigs.Host}:${ServerConfigs.Port}/${ServerConfigs.PublicFolder}${product.image_url}`,
      }));

      return res.send({ message: "success", status: 200, data: rows });
    } catch (error) {
      console.log(error);
      return res.send({ message: "Internal Server Error", status: 500 });
    }
  }
}
