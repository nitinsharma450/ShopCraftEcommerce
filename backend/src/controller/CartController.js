import { send } from "process";
import { db } from "../connection.js";
import { ServerConfigs } from "../configs/ServerConfigs.js";

export class CartController {
  static async addCart(req, res) {
    try {
      const user_id = req.user.id;

      const { product_id, quantity } = req.body;

      let [exists] = await db.query(
        "SELECT * FROM cart WHERE product_id=? AND user_id=?",
        [product_id, user_id]
      );

      if (exists.length !== 0) {
        await db.query(
          "UPDATE cart SET quantity = quantity + ? WHERE product_id = ? AND user_id = ?",
          [quantity, product_id, user_id]
        );
      } else {
        await db.query(
          "INSERT INTO cart (quantity, user_id, product_id) VALUES (?, ?, ?)",
          [quantity, user_id, product_id]
        );
      }

      res.status(200).send("Product added to cart !!");
    } catch (error) {
      console.error("Add to cart error:", error); // Optional for debugging
      return res.status(500).send("INTERNAL SERVER ERROR !!");
    }
  }

  static async search(req, res) {
    try {
      const user_id = req.user.id;

      let [products] = await db.query(
        "select cart.quantity,products.id,products.title,products.image_url ,products.price from cart left join products on products.id=cart.product_id where user_id=?",
        [user_id]
      );

      products = products.map((product) => ({
        ...product,
        image_url: `${ServerConfigs.Host}:${ServerConfigs.Port}/${ServerConfigs.PublicFolder}${product.image_url}`,
      }));


      return res.send(products);
    } catch (error) {
      console.log(error);
      return res.status(500).send("INTERNAL SERVER ERROR !!");
    }
  }

  static async updateCart(req, res) {
    try {
      const user_id = req.user.id;
      const { product_id, quantity } = req.body;

      if (quantity <= 0) {
        await db.query("delete from cart where user_id=? and product_id=?", [
          user_id,
          product_id,
        ]);
        return res.status(200).send("PRODUCT REMOVE SUCCESSFULLY !!");
      } else {
        await db.query(
          "update cart set quantity=? where user_id=? and product_id=?",
          [quantity, user_id, product_id]
        );
        return res.status(200).send("CART UPDATE SUCCESSFULLY !!");
      }
    } catch (error) {
      return res.status(500).send("INTERNAL SERVER ERROR !!");
    }
  }

  static async syncCard(req,res) {
    const user_id = req.user.id;
    let cart_product = req.body.cart_items;

    db.query("delete from cart where user_id=?", [user_id]);

    for (let item of cart_product) {
      await db.query(
        "insert into cart set quantity=?, product_id=?, user_id=?",
        [item.quantity, item.id, user_id]
      );
    }
    res.status(200).send({
      success : true
    });
  }
}
