
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

import { db } from "../connection.js";
import { SecretConfigs } from "../configs/SecretConfigs.js";
import { ServerConfigs } from "../configs/ServerConfigs.js";

export function InsertController(req, res) {
  const form = req.query;

  const success = db.query("insert into user set id=?, email=?,gender=?", [
    form.id,
    form.email,
    form.gender,
  ]);

  if (success) {
    res.send("USER CREATE SUCCESSFULLY !!");
  } else {
    res.send("unable to create user !!");
  }
}

export async function details(req, res) {
  const userID = req.query;
  const [data] = await db.query("select * from user where id=?", [userID.id]);
  if (data) {
    res.send(data);
  } else {
    res.send("UNABLE TO FIND ID");
  }
}

export async function users(req, res, next) {
  const userId = req.params.id;
  const [data] = await db.query("select * from signup where id=?", [userId]);

  res.send(data[0]);
}
export async function SignUp(req, res) {
  const SignUpForm = req.body;
  console.log(SignUpForm);

  // Basic validation
  if (
    !SignUpForm.name ||
    !SignUpForm.email ||
    !SignUpForm.password ||
    !SignUpForm.confpassword ||
    !SignUpForm.phone_number||
    !SignUpForm.gender ||
    !SignUpForm.role ||
    !SignUpForm.state ||
    !SignUpForm.country ||
    !SignUpForm.status
  ) {
    return res.status(400).send("All fields are required");
  }

  if (SignUpForm.password !== SignUpForm.confpassword) {
    return res.status(400).send("Passwords do not match");
  }

  try {
    // Ensure directory exists
    if (!fs.existsSync("public/users")) {
      fs.mkdirSync("public/users", { recursive: true });
    }

    // Check image
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const image = req.files.image;
    const fileName = Date.now() + path.extname(image.name);
    const filePath = path.join(ServerConfigs.PublicFolder, "users", fileName);

    // Move image
    image.mv(filePath, async (err) => {
      if (err) {
        console.error("Upload error:", err);
        return res.status(500).json({ message: "Failed to upload image" });
      }

      try {
        const imageUrl = `/users/${fileName}`;
        SignUpForm.image = imageUrl;

        await db.query(
          "INSERT INTO user (name, email, gender, role, profile_picture, state, country, phone_number, status, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            SignUpForm.name,
            SignUpForm.email,
            SignUpForm.gender,
            SignUpForm.role,
            SignUpForm.image,
            SignUpForm.state,
            SignUpForm.country,
            SignUpForm.phone_number,
            SignUpForm.status,
            SignUpForm.password,
          ]
        );

        res.status(200).json({ message: "Data inserted successfully!", status: 200 });
      } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Database error", error });
      }
    });
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).send("Unable to create account");
  }
}

export async function Login(req, res) {
  const loginForm = req.body;

  const [rows] = await db.query("select * from user where email=?", [
    loginForm.email,
  ]);

  if (rows.length == 0) {
    return res.status(401).send("user not found !!");
  }

  const user = rows[0];
  if (user.password != loginForm.password) {
    return res.status(401).send("INCORRECT PASSWORD !!");
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.fullname,
    },
    SecretConfigs.JWT_SECRET,
    { expiresIn: "3h" }
  );

  res.send({ message: "login successfully", token, id: user.id });
}

export function InsertData(req, res, next) {
  const data = req.body;

  res.send("USER DATA RECEIVED" + data);
}
