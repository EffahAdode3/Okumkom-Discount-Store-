import sequelize from "../db/dbConfig.js";
import DataType from "sequelize";

const createStore = sequelize.define(
  'beneficiary',
  {
    id: {
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    beneficiary: {
      type: DataType.STRING,
      allowNull: false,
    },

  },
  { timestamps: true }
);

export default beneficiary ;
