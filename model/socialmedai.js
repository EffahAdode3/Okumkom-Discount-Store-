import Sequelize from "../db/dbConfig.js";
import DataType from "sequelize";

const socialMedia = Sequelize.define(
  'socialMedia',
  {
    id: {
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    website: {
      type: DataType.STRING, 
    },
    instagram: {
      type: DataType.STRING, 
    },
    faceBook: {
      type: DataType.STRING, 
    },
    twitter: {
      type: DataType.STRING, 
    },
    anyOtherLink: {
      type: DataType.STRING,
  }
}
);

export default socialMedia;
