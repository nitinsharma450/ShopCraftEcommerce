import jwt from "jsonwebtoken";
import { SecretConfigs } from "../configs/SecretConfigs.js";

export default function AdminGuardMiddleware(req, res, next) {
 const header = req.headers["authorization"];

  if (header && typeof header === "string") {
    const chunks = header.split(" ");
    if (chunks.length == 2) {
      var token = chunks[1];
      try {
        const decoded = jwt.verify(token, SecretConfigs.JWT_ADMIN_SECRET);
        req.user = decoded;
        next();
        return;
      } catch (err) {return res.status(403).send({message:"Invalid token",status:403});}
    }
  }

 
 


  
};


