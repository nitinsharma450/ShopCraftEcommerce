import fs from "fs";
import path from "path";

import { db } from "../../connection.js";
import { ServerConfigs } from "../../configs/ServerConfigs.js";
import { error } from "console";

export class ProductController {
  static async create(req, res) {
    try {
      if (!fs.existsSync("public/product")) {
        fs.mkdirSync("public/product", { recursive: true });
      }

      if (!req.files || !req.files.image) {
        return res.status(400).json({ message: "Image is required" });
      }

      const image = req.files.image;
      const fileName = Date.now() + path.extname(image.name);
      const filePath = path.join(
        ServerConfigs.PublicFolder,
        "product",
        fileName
      );

      image.mv(filePath, async (err) => {
        if (err) {
          console.error("Upload error:", err);
          return res.status(500).json({ message: "Failed to upload image" });
        }

        const imageUrl = `/product/${fileName}`;
        const body = req.body;

        let tagsValue = body.tags;
        if (typeof tagsValue === "string") {
          try {
            tagsValue = JSON.parse(tagsValue);
          } catch {
            tagsValue = JSON.stringify(
              tagsValue.split(",").map((tag) => tag.trim())
            );
          }
        }

        await db.query(
          `INSERT INTO products (
          title, image_url, price, rating, category, description, discountPercentage,
          stock, brand,
          warrantyInformation, shippingInformation, availabilityStatus, tags
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
          [
            body.title,
            imageUrl,
            body.price,
            body.rating,
            body.category,
            body.description,
            body.discountPercentage,
            body.stock,
            body.brand,
           
            body.warrantyInformation,
            body.shippingInformation,
            body.availabilityStatus,
            tagsValue,
          ]
        );

        return res.status(201).json({ message: "Product saved", imageUrl });
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

 static async update(req, res) {
  const product_form = req.body;
  console.log(product_form.id)

  if (!product_form.id) {
    return res.status(400).send({ status: 400, message: "Product ID is required" });
  } 


  const image = req.files.image;

if(image){

      const fileName = Date.now() + path.extname(image.name);
      const filePath = path.join(
        ServerConfigs.PublicFolder,
        "product",
        fileName
      );
  const imageUrl = `/product/${fileName}`;

    image.mv(filePath, async (err) => {
        if (err) {
          console.error("Upload error:", err);
          return res.status(500).json({ message: "Failed to upload image" });
        }
      
       try {
    await db.query(
      `UPDATE products SET 
        price=?, stock=?, discountPercentage=?, rating=?, category=?, brand=?, 
        warrantyInformation=?, shippingInformation=?, availabilityStatus=?, 
        tags=?, description=?, image_url=?
       WHERE id=?`,
      [
        product_form.price,
        product_form.stock,
        product_form.discountPercentage,
        product_form.rating,
        product_form.category,
        product_form.brand,
        product_form.warrantyInformation,
        product_form.shippingInformation,
        product_form.availabilityStatus,
        product_form.tags,
        product_form.description,
      imageUrl,
        product_form.id 
      ]
    );

    res.send({
      status: 200,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).send({
      status: 500,
      message: "Failed to update product",
      error,
    });
   }})}
   else{
     await db.query(
      `UPDATE products SET 
        price=?, stock=?, discountPercentage=?, rating=?, category=?, brand=?, 
        warrantyInformation=?, shippingInformation=?, availabilityStatus=?, 
        tags=?, description=?
       WHERE id=?`,
      [
        product_form.price,
        product_form.stock,
        product_form.discountPercentage,
        product_form.rating,
        product_form.category,
        product_form.brand,
        product_form.warrantyInformation,
        product_form.shippingInformation,
        product_form.availabilityStatus,
        product_form.tags,
        product_form.description,
      
        product_form.id 
      ]
    );
   }

 
}



  static async search(req, res) {
    const category = req.params.category;

    let [products] = await db.query("select * from products where category=?", [
      category,
    ]);

    if (products.length === 0) {
      return res.status(404).send("product not found !!!");
    }
    res.send({ products });
  }

  static async remove(req,res) {

    const product_id=req.body.productId;

    if(!product_id){
      res.send({message:"product id is required !!",status:500})
    }
    try {
      
     await db.query('delete from products where id=?',[product_id])
    res.send({message:"product delete successfully !!",status:200})

    } catch (error) {
      res.send(error)
    }

  }

  static async detail(req, res) {
    const product_id = req.params.id;

    let [product_data] = await db.query("select * from products where id=?", [
      product_id,
    ]);

    if (product_data.length == 0) {
      return res.status(404).send("data not found !!");
    }

    product_data[0].image_url = `${ServerConfigs.Host}:${ServerConfigs.Port}${ServerConfigs.PublicRoute}${product_data[0].image_url}`;
    res.send(product_data[0]);
  }


  static async category(req,res){
     let [product_category]=await db.query('select name from product_category')

     try {
       if(product_category[0]){
     return  res.status(200).send(product_category)
     }
     } catch (error) {
      console.log(error)
     }
    
     
  }

 static async searchAll(req, res) {
  try {
    let [products] = await db.query('SELECT * FROM products', []);


    
  products = products.map(product=>({
    ...product,
    image_url : `${ServerConfigs.Host}:${ServerConfigs.Port}/${ServerConfigs.PublicFolder}${product.image_url}`
  }))

    return res.status(200).send({
      message: "Products fetched successfully",
      status: 200,
      data: products,
    });

  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).send({ message: "Internal Server Error", error });
  }
}

static async searchById(req, res) {
  const { product_id } = req.body;

  
  if (!product_id) {
    return res.status(400).send({ status: 400, message: "Product ID is required." });
  }

  try {
    
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [product_id]);
 
    if (rows.length === 0) {
      return res.status(404).send({ status: 404, message: "Product not found." });
    }

     
    return res.status(200).send({
      message: "Product fetch successful!",
      data: rows[0],
      status: 200
    });

  } catch (error) {
  
    return res.status(500).send({ status: 500, message: "Server error", error });
  }
}

static async filter(req, res) {
  const { key } = req.body;

  try {
    let [results] = await db.query(
      `SELECT * FROM products WHERE 
       title LIKE ? OR brand LIKE ? OR category LIKE ?`,
      [`%${key}%`, `%${key}%`, `%${key}%`]
    );

       
  results = results.map(product=>({
    ...product,
    image_url : `${ServerConfigs.Host}:${ServerConfigs.Port}/${ServerConfigs.PublicFolder}${product.image_url}`
  }))

    if (results.length === 0) {
      return res.status(200).send({ message: "NO PRODUCT FOUND", data: [] });
    }

    res.status(200).send({ message: "success", data: results });
  } 
  catch (error) {
    res.status(500).send({ message: "Server Error", error });
  }
}

static async searchCount(req,res){
  try {
    let [response]=await db.query('select count(*) as total_product from products')
    res.send({message:"success",status:200,response:response[0]})
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
 

}

}
