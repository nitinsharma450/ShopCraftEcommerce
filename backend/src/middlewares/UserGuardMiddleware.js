import jwt from "jsonwebtoken";
import { SecretConfigs } from "../configs/SecretConfigs.js";

export default function UserGuardMiddleware(req, res, next) {
 const header = req.headers["authorization"];

  if (header && typeof header === "string") {
    const chunks = header.split(" ");
    if (chunks.length == 2) {
      var token = chunks[1];
      try {
        const decoded = jwt.verify(token, SecretConfigs.JWT_SECRET);
        req.user = decoded;
        next();
        return;
      } catch (err) {}
    }
  }

  res.send("Invalid Token");
  return;


  
};


