import express from "express";
import bodyParser from "body-parser";
import  sequelize  from "./db/dbConfig.js"
import dotenv from "dotenv";
import routerVendor from "./route/vendorRoute.js";
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();
const port = process.env.PORT;
app.use('/vendor', routerVendor)
try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    app.listen(port, () => {
        console.log(`App is running on ${port}`);
      });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  (async () => {
    await sequelize.sync();
  })();