import fs from "fs";
import path from "path";

import { db } from "../../connection.js";
import { ServerConfigs } from "../../configs/ServerConfigs.js";

export class ProductCategoryController {
  static async createCategory(req, res) {
    const category_form = req.body;

    if (!category_form.name || category_form.name.trim() === "") {
      return res
        .status(500)
        .send({ message: "Please provide category name !!" });
    }

    try {
      await db.query("INSERT INTO product_category (name) VALUES (?)", [
        category_form.name,
      ]);
      return res.send({
        message: "Category inserted successfully !!",
        status: 200,
      });
    } catch (error) {
      console.error("Error inserting category:", error);
      return res.status(500).send({ message: "Internal Server Error", error });
    }
  }

  static async update(req, res) {
    const form = req.body;
    try {
      await db.query("update product_category set name=? where id=?", [
        form.name,
        form.id,
      ]);
      res.send({ message: "update successfully", status: 200 });
    } catch (error) {
      console.error("Error inserting category:", error);
      return res.status(500).send({ message: "Internal Server Error", error });
    }
  }

  static async suggest(req, res) {
    let [records] = await db.query("select * from product_category", []);

    res.send(records);
  }

  static async detail(req,res){
    var record_id = req.body.record_id;
    if(!record_id){
      return res.status(500).send({message : 'Record id is required'});
    }

    let [records] = await db.query('select * from product_category where id=?',[record_id]);

  

    if(records.length > 0){
      res.send({
        status : 200,
        data : records[0]
      })
    }else{
       return res.status(500).send({message : 'Record not found'});
    }

  }

  static async searchCategory(req, res) {
    let [category] = await db.query("select * from product_category", []);
    res.send(category);
  }

  static async remove(req, res) {
    const category_id = req.body.id;

    if (!category_id) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    try {
      await db.query("DELETE FROM product_category WHERE id = ?", [
        category_id,
      ]);
      return res.json({
        message: "Category deleted successfully!",
        status: 200,
      });
    } catch (error) {
      console.error("Delete error:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async category(req, res) {
    let [product_category] = await db.query(
      "select name from product_category"
    );

    try {
      if (product_category[0]) {
        return res.status(200).send(product_category);
      }
    } catch (error) {
      console.log(error);
    }
  }

 static async filter(req, res) {
  const { key } = req.body;

  try {
    const [results] = await db.query(
      'SELECT * FROM product_category WHERE name LIKE ?',
      [`%${key}%`]
    );

    if (results.length === 0) {
      return res.status(200).send({
        message: "No categories found",
        data: [],
      });
    }

    res.status(200).send({
      message: "Categories fetched successfully",
      data: results,
    });
  } catch (error) {
    console.error("Error in category filter:", error);
    res.status(500).send({
      message: "Server Error",
      error,
    });
  }
}
static async searchCount(req,res){

  try {
    
    let [response]= await db.query('select count(*) as total_category from product_category',[])
    res.send({message:"success",status:200,response:response[0]})

  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
}

}
