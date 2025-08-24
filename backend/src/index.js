import express from "express";
import cors from "cors";
  import fileUpload from "express-fileupload";
import { ServerConfigs } from "./configs/ServerConfigs.js";
import { adminRouter } from "./routes/admin.js";
import { websiteRouter } from "./routes/website.js";

const app = express();


app.use(fileUpload());

app.use(cors());
app.use(express.json());
app.use(ServerConfigs.PublicRoute, express.static(ServerConfigs.PublicFolder));



//Routes
app.use('/api/admin',adminRouter);
app.use('/api/website',websiteRouter);





app.listen(ServerConfigs.Port, async function () {
  console.log(
    `your server is running on ${ServerConfigs.Host}:${ServerConfigs.Port}`
  );
});
