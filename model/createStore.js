import sequelize from "../db/dbConfig.js";
import DataType from "sequelize";

const createStore = sequelize.define(
  'create_store',
  {
    id: {
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    businessName: {
      type: DataType.STRING,
      allowNull: false,
    },
    businessDescription: {
      type: DataType.TEXT,
      allowNull: false,
    },
    businessAddress: {
      type: DataType.STRING,
      allowNull: false,
    },

  },
  { timestamps: true }
);

export default createStore ;
