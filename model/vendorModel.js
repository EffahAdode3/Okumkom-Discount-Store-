
import sequelize from "../db/dbConfig.js"
import  DataType  from "sequelize"
const vendor = sequelize .define(
    'vendors',
    {
        id: {
            type: DataType.UUID,
            defaultValue:DataType.UUIDV4,
            primaryKey:true,
            allowNull:false
        },
        email:{
            type:DataType.STRING,
            allowNull:false, 
        },
        fullName:{
            type:DataType.STRING,
            allowNull:false
        },
        password: {
            type: DataType.STRING,
            allowNull: false,
          },
          phoneNumber: {
            type: DataType.STRING,
            allowNull: false,
          },
          isVerified: {
            type: DataType.BOOLEAN,
            defaultValue: false,
          },
        verificationAccess:{
            type: DataType.STRING,
        },
        expirationDate: {
            type: DataType.DATE,
            allowNull: true,
          },
    },
    {timestamps: true});
export default vendor;