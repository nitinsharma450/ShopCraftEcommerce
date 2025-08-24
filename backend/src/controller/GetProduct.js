import { ServerConfigs } from "../configs/ServerConfigs.js";
import { db } from "../connection.js";

export default async function search(req, res, next) {

  var [products] = await db.query("select * from products");

  products = products.map(product=>({
    ...product,
    image_url : `${ServerConfigs.Host}:${ServerConfigs.Port}/${ServerConfigs.PublicFolder}${product.image_url}`
  }))

  res.send({
    products
  });
}



