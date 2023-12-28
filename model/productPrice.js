import Sequelize from "../db/dbConfig.js";
import DataType from "sequelize";
const productPrice = Sequelize.define(
  "price",
  {
    id: {
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    price: {
      type: DataType.DECIMAL(10, 2), 
      allowNull: false,
    },
    compared_At: {
      type: DataType.DECIMAL(10, 2), 
      allowNull: false,
    },
    quantity: {
      type: DataType.INTEGER,
      allowNull: false,
    },
    tags: {
      type: DataType.STRING,
      allowNull: false,
    },
    set_Status: {
      type: DataType.ENUM("active", "inactive"), 
      allowNull: false,
    },
  }
);
export default productPrice;
