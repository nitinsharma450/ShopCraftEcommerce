import { db } from "../connection.js";
import { ServerConfigs } from "../configs/ServerConfigs.js";
import fs from "fs";
import path from "path";

export class UserController {
  static async searchById(req, res) {
    try {
      const { userId } = req.body;

      // Await the query to resolve
      let [user] = await db.query("SELECT * FROM user WHERE id = ?", [userId]);

      if (user.length > 0) {
        user = user.map((data) => ({
          ...data,
          profile_picture: `${ServerConfigs.Host}:${ServerConfigs.Port}/${
            ServerConfigs.PublicFolder
          }${data.profile_picture ?? ""}`,
        }));
        res.send(user[0]);
      } else {
        res.status(404).send("User not found");
      }
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).send("Server error");
    }
  }

  static async update(req, res) {
    let userData = req.body;
    console.log(userData);

    if (!userData) {
      return res.status(400).send({ message: "userData required !!" });
    }

    try {
      // Create product folder if it doesn't exist
      if (!fs.existsSync("public/users")) {
        fs.mkdirSync("public/users", { recursive: true });
      }

      // Check if image is uploaded
      if (!req.files || !req.files.profile_picture) {
        return res.status(400).json({ message: "Image is required" });
      }

      const image = req.files.profile_picture;
      const fileName = Date.now() + path.extname(image.name);
      const filePath = path.join(ServerConfigs.PublicFolder, "users", fileName);

      // Move the uploaded image
      image.mv(filePath, async (err) => {
        if (err) {
          console.error("Upload error:", err);
          return res.status(500).json({ message: "Failed to upload image" });
        }

        try {
          const imageUrl = `/users/${fileName}`;
          userData.profile_picture = imageUrl;
          console.log(userData.profile_picture);

          // Insert user data into database
          await db.query(
            "UPDATE user SET name=?, email=?, gender=?, role=?, profile_picture=?, state=?, country=?, phone_number=?, status=? WHERE id=?",
            [
              userData.name,
              userData.email,
              userData.gender,
              userData.role, // fixed: this was incorrectly accessing profilePicture here
              userData.profile_picture, // fixed: moved here separately
              userData.state,
              userData.country,
              userData.phone_number,
              userData.status,
              userData.id,
            ]
          );

          res
            .status(200)
            .json({ message: "Data updated successfully!", status: 200 });
        } catch (error) {
          console.error("Database error:", error);
          res.status(500).json({ message: "Database error", error });
        }
      });
    } catch (error) {
      console.error(error); // helpful for debugging
      return res.status(500).send({ message: "Server error", error });
    }
  }

 static async myorders(req, res) {
  let { userId } = req.body;

  console.log(userId)
  try {
   let [rows] = await db.query(
  `SELECT user_order.*, 
          user_order_item.product_id,
          user_order_item.quantity,  
          user_order_item.product_category,
          products.image_url as imageUrl
   FROM user_order 
   JOIN user_order_item 
     ON user_order.id = user_order_item.user_order_id 
   JOIN products 
     ON user_order_item.product_id = products.id
   WHERE user_order.user_id = ?`,
  [userId]
);
 rows = rows.map((data) => ({
          ...data,
          imageUrl: `${ServerConfigs.Host}:${ServerConfigs.Port}/${
            ServerConfigs.PublicFolder
          }${data.imageUrl ?? ""}`,
        }))

    
    console.log(rows)

    res.send({ message: "success", status: 200, data: rows });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

static async cancelOrder(req, res) {
  const { orderId, cancelReason } = req.body;

  try {
    // Get user_id from user_order table
    const [userResult] = await db.query('SELECT user_id FROM user_order WHERE id = ?', [orderId]);
    if (!userResult || userResult.length === 0) {
      return res.status(404).send({ message: "Order not found", status: 404 });
    }
    const userId = userResult[0].user_id;

    // Get product_id from user_order_item table
    const [productResult] = await db.query('SELECT product_id FROM user_order_item WHERE user_order_id = ?', [orderId]);
    const productId = productResult.length > 0 ? productResult[0].product_id : null;

    // Insert into cancel_order table
    await db.query(
      'INSERT INTO cancel_order (user_id, order_id, product_id, reason) VALUES (?, ?, ?, ?)',
      [userId, orderId, productId, cancelReason]
    );

    // Delete the order (you can optionally delete from user_order_item too)
    await db.query('DELETE FROM user_order WHERE id = ?', [orderId]);

    res.send({ message: "Order cancelled successfully", status: 200 });

  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).send({ message: "Server Error", error });
  }
}
static async searchDetails(req, res) {
  try {
    const {orderId} = req.body;
    console.log("orderId:", orderId);

    if (!orderId) {
      return res.status(400).send({ message: "orderId is required" });
    }

    const [rows] = await db.query(
      "SELECT * FROM user_order WHERE id = ? ",
      [orderId]
    );

    return res.status(200).send({
      message: "success",
      data: rows,
    });
  } catch (error) {
    console.error("Error in searchDetails:", error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
}




}
