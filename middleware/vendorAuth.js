import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import vendor from '../model/VendorModel.js';
import bcrypt from 'bcryptjs'
dotenv.config();
const secret = process.env.ACCESS_TOKEN;
const loginAuth = async(req, res, next) =>{
    try {
  const loginBody = req.body;
  const email = loginBody.email;
  const findVendor = await vendor.findOne({where:{email}});
  if(!findVendor){
    return res.status(404).json({message:"Email not found"});
  } 
  const passwordMatch = await bcrypt.compare(
    loginBody.password, findVendor.password
 )
 if(!passwordMatch){
    res.status(409).json({message:"Invalid Password"});
    return;
 }
 const generatetoken = {
   id:findVendor.id,
    email:findVendor.email,
    fullName:findVendor.fullName,
 }
 const verified = findVendor.isVerified;
 if(!verified){
    return res.status(409).json({message:"vendor not verified "}) 
 }
 if (verified){
 const vendorToken = jwt.sign(generatetoken, secret, {expiresIn:"123hr"})
 req.token = vendorToken
 req.vendor = findVendor
 }
 next()
} catch (error) {
    console.log(error);
    res.status(500).json({message:"Unable to login ", error})
    return;   
}
}
// Token  verification
const tokenVerification = async(req, res, next)=>{
   try {
   const token = req.headers.token;
   if(!token){
      return res.status(401).json({message:"no token provided"});
  }
  const verify = jwt.verify(token, secret);
  req.vendor_id = verify.id;
  console.log('********************', req.vendor_id)
  next()
} catch (error) {
  console.log(error);
return res.status(500).json({message:"error",error})
}
}

export default  {loginAuth, tokenVerification};