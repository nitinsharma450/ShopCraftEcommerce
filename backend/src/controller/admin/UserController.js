import { db } from "../../connection.js";
import { ServerConfigs } from "../../configs/ServerConfigs.js";
import fs from "fs";
import path from "path";
import { response } from "express";

export class UserController {
  static async search(req, res) {
    try {
      let [userData] = await db.query("select * from user", []);
      if (userData.length == 0) {
        return res.status(200).send({ message: "Data not found !" });
      }



       userData = userData.map(data=>({
         ...data,
         profile_picture : `${ServerConfigs.Host}:${ServerConfigs.Port}/${ServerConfigs.PublicFolder}${data.profile_picture ?? ''}`
       }))

      res.send({
        message: "user data fetch successfully !",
        response: userData,
      });
    } catch (error) {
      console.log(error)
      res.status(500).send(error);
    }
  }

  static async searchById(req, res) {
  const {userId} = req.body;

  if (!userId) {
    return res.status(400).send({ message: "userId is required" });
  }

  try {
    const [response] = await db.query('SELECT * FROM user WHERE id = ?', [userId]);



    if (response.length === 0) {
      return res.status(404).send({ message: "Data not found!" });
    }

    response = response.map(data=>({
         ...data,
         profile_picture : `${ServerConfigs.Host}:${ServerConfigs.Port}/${ServerConfigs.PublicFolder}${data.profile_picture ?? ''}`
       }))

    return res.status(200).send({ message: "Success", data:response[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error", error });
  }
}

static async create(req, res) {
  const userForm = req.body;

  try {
    // Create product folder if it doesn't exist
    if (!fs.existsSync("public/users")) {
      fs.mkdirSync("public/users", { recursive: true });
    }

    // Check if image is uploaded
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const image = req.files.image;
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
        userForm.image = imageUrl; // ✅ Fix: Assign image URL to profilePicture

        // Insert user data into database
        await db.query(
          "INSERT INTO user (name, email, gender, role, profile_picture, state, country, phone_number, status, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            userForm.name,
            userForm.email,
            userForm.gender,
            userForm.role,
            userForm.image,
            userForm.state,
            userForm.country,
            userForm.phone_number,
            userForm.status,
            userForm.password,
          ]
        );

        res.status(200).json({ message: "Data inserted successfully!",status:200 });
      } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Database error", error });
      }
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
}

  static async update(req, res) {
  let userData = req.body;

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
        console.log(userData.profile_picture)

        // Insert user data into database
       await db.query(
      "UPDATE user SET name=?, email=?, gender=?, role=?, profile_picture=?, state=?, country=?, phone_number=?, status=? WHERE id=?",
      [
        userData.name,
        userData.email,
        userData.gender,
        userData.role, // fixed: this was incorrectly accessing profilePicture here
         userData.profile_picture , // fixed: moved here separately
        userData.state,
        userData.country,
        userData.phone_number,
        userData.status,
        userData.id,
      ]
    );

        res.status(200).json({ message: "Data updated successfully!",status:200 });
      } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Database error", error });
      }
    });
  }
   

   

  catch (error) {
    console.error(error); // helpful for debugging
    return res.status(500).send({ message: "Server error", error });
  }
}

  static async remove(req, res) {
    let { userId } = req.body;
    console.log(userId);

    if (!userId) {
      return res.status(500).send("user id not found !!");
    }

    try {
      await db.query("delete from user where id=?", [userId]);
      return res.status(200).send({ message: "SUCCESS",status:200 });
    } catch (error) {
      res.status(500).send(error);
    }
  }

 static async searchCount(req, res) {
  try {
    const [rows] = await db.query('SELECT COUNT(*) AS total_users FROM user');
    res.status(200).send({ message: "success", status: 200, response: rows[0] });
  } catch (error) {
    console.error("Error in searchCount:", error);
    res.status(500).send({ message: "Internal Server Error", status: 500 });
  }
}
static async searchByIdAdmin(req,res){

const {userId} = req.body;

  if (!userId) {
    return res.status(400).send({ message: "userId is required" });
  }

  try {
    let [response] = await db.query('SELECT * FROM user WHERE id = ?', [userId]);

    if (response.length === 0) {
      return res.status(404).send({ message: "Data not found!" });
    }

  response = response.map(data=>({
         ...data,
         profile_picture : `${ServerConfigs.Host}:${ServerConfigs.Port}/${ServerConfigs.PublicFolder}${data.profile_picture ?? ''}`
       }))

    return res.status(200).send({ message: "Success", data:response[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error", error });
  }

}
}
