import jwt from "jsonwebtoken";
import { SecretConfigs } from "../configs/SecretConfigs.js";
import { db } from "../connection.js";


export class AdminController {
 static async adminLogin(req, res) {
  const adminform = req.body;

  let [row] = await db.query("SELECT * FROM user WHERE email = ?", [
    adminform.email,
  ]);


  if (!row || row.length === 0) {
    return res.status(404).send({message:"invalid user"}); // user not found
  }

  const admin = row[0];
  if(admin.password!=adminform.password){
    return res.status(500).send({message:'password not match'})
  }


  const token = jwt.sign(
    {
      id: admin.id,
      name: admin.name,
    },
    SecretConfigs.JWT_ADMIN_SECRET,
    { expiresIn: "3h" }
  );

  return res.status(200).send({message:"success",status:200,data:{token,admin_id:admin.id}});
}


static async adminSignup(req, res) {
  try {
    const form = req.body;
    const { email, phone } = form;

    if (form.password !== form.confPassword) {
      return res.status(400).json({ error: "Passwords do not match." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: "Invalid phone number." });
    }

    const [existingUser] = await db.query("SELECT * FROM user WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return res.status(409).json({ error: "Email already registered." });
    }

   
    const insertQuery = `
      INSERT INTO user (name, email, password, role, gender, phone_number, state, country, profile_picture, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      form.name,
      form.email,
      form.password,
      form.role,
      form.gender,
      form.phone,
      form.state,
      form.country,
      form.profilePic,
      form.status
    ];

    const [response] = await db.query(insertQuery, values);

    return res.status(201).send({
      message: "Admin registered successfully.",
    });

  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
}

}
