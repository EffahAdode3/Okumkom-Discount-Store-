import Sequelize from "../db/dbConfig.js";
import  DataType  from "sequelize";
const addNewProduct = Sequelize.define( 
    "addProduct",
    {
        id: {
            type: DataType.UUID,
            defaultValue: DataType.UUIDV4,
            primaryKey: true,
            allowNull: false,
          },
          productName: {
            type: DataType.STRING,
            allowNull: false,
          },
          productDescription: {
            type: DataType.TEXT,
            allowNull: false,
          },    
          selectCategory: {
            type: DataType.STRING,
            allowNull: false,
          },
          Images:{
            type: DataType.TEXT
         },
    }
)
export default addNewProduct;