import { db } from "../../connection.js";
import { SmsService } from "../../sms/SmsService.js";

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export class OrderPurchaseController {
static async order(req, res) {
  try {
    const payload = req.body;

    const [rows] = await db.query(
      `SELECT 
         checkout_item.quantity,
         checkout_item.product_id,
         products.category, 
         products.price 
       FROM checkout_item 
       JOIN products ON checkout_item.product_id = products.id 
       WHERE checkout_id = ?`,
      [payload.checkoutId]
    );

    if (!rows.length) {
      return res.status(404).send({ message: "No items in checkout." });
    }

    const shippingCharge = 50;
    let totalPrice = 0;
    const orderItems = [];

    for (let item of rows) {
      const quantity = item.quantity;
      const unitPrice = item.price;
      const basePrice = quantity * unitPrice;
      totalPrice += basePrice;

      orderItems.push({
        product_id: item.product_id,
        product_category: item.category,
        quantity,
      });
    }

    const tax = totalPrice * 0.05;
    totalPrice += shippingCharge + tax;

    const [orderResult] = await db.query(
      `INSERT INTO user_order 
       (user_id, total_price, delivery_name, delivery_email, delivery_phone, delivery_address, delivery_state, delivery_city, delivery_pincode, delivery_country, payment_method, payment_status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.userId,
        totalPrice.toFixed(2),
        payload.shippingInfo.name,
        payload.shippingInfo.email,
        payload.shippingInfo.phone,
        payload.shippingInfo.landmark,
        payload.shippingInfo.state,
        payload.shippingInfo.city,
        payload.shippingInfo.pincode,
        payload.shippingInfo.country || "India",
        payload.paymentMode,
        payload.paymentStatus,
      ]
    );

    const orderId = orderResult.insertId;

    for (let item of orderItems) {
      await db.query(
        `INSERT INTO user_order_item 
         (product_id, product_category, quantity, user_order_id) 
         VALUES (?, ?, ?, ?)`,
        [item.product_id, item.product_category, item.quantity, orderId]
      );
    }

    // ✅ Send SMS confirmation
    let phone = payload.shippingInfo.phone;
if (!phone.startsWith("+91")) {
  phone = "+91" + phone;
}
await SmsService.sendOrderSMS(phone, orderId);


    return res.status(200).send({ message: "Order placed successfully", status: 200,orderId });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error", error });
  }
}




  static async cartCheckout(req, res) {
    const { user_id, items } = req.body;
    console.log(user_id, items);

    try {
      const [checkoutResult] = await db.query(
        "INSERT INTO checkout (user_id, checkout_date) VALUES (?, NOW())",
        [user_id]
      );

      // Get inserted checkout_id
      const checkoutId = checkoutResult.insertId;
      console.log(checkoutId);

      // Insert into checkout_item
      for (const item of items) {
        await db.query(
          "INSERT INTO checkout_item (checkout_id, product_id, quantity) VALUES (?, ?, ?)",
          [checkoutId, item.product_id, item.quantity]
        );
      }

      res
        .status(200)
        .send({
          message: "Checkout successful!",
          status: 200,
          data: checkoutId,
        });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Checkout failed", error });
    }
  }

  static async buynowCheckout(req, res) {
    let payload = req.body;

    try {
      let [rows] = await db.query(
        "INSERT INTO checkout (user_id, checkout_date) VALUES (?, NOW())",
        [payload.user_id]
      );
      let checkoutId = rows.insertId;
      console.log(checkoutId);

      db.query(
        "insert into checkout_item (product_id,quantity,checkout_id) values(?,?,?)",
        [payload.product_id, payload.quantity, checkoutId]
      );

      res.send({ message: "success", status: 200, data: checkoutId });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async createPayment(req,res){
    
  try {
    const options = {
      amount: req.body.amount * 100, // Convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating order");
  }

  
}}
