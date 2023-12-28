import vendor from "../model/VendorModel.js";
import  bcryptjs from "bcryptjs";
import nodemailer from 'nodemailer';
import crypto from 'crypto'
import createStore from '../model/createStore.js'
import product_Price from '../model/productPrice.js'
import social_media from '../model/socialmedai.js'
import beneficiary_table from "../model/beneficiary.js";
import dotenv from 'dotenv';
dotenv.config();
//Signup process
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000);
}
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS
    }
  });
function sendVerificationEmail(email, fullName, verificationCode) {
  const expirationDate = new Date();
  expirationDate.setMinutes(expirationDate.getMinutes() + 5);
  const mailOptions = {
    from: 'maximnyansa75@gmail.com',
    to: email,
    subject: 'Verify Your Email on Your Website',
    html: `
    <p>Dear ${fullName},</p>
    <p>Your verification code is: <strong>${verificationCode}</strong></p>
    <p>This code will expire on ${expirationDate}.</p>
  `
};
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending verification email:', error);
    } else {
      console.log('Verification email sent:', info.response);
    }
  });
};
// signup for vendor
const signup = async (req, res) => {
    try {
        const {  email, fullName, password, phoneNumber, isVerified, verificationAccess,expirationDate} = req.body;
        const existingVendor = await vendor.findOne({ where: { email } });
        if (existingVendor) {
            return res.status(404).json({ message: 'Email already exists' });
        };
        const verificationCode = generateVerificationCode();
        sendVerificationEmail(email, fullName, verificationCode, expirationDate);
       const expiration  =  new Date(Date.now() + 5 * 60 * 1000)
    const data = {
      email,
      fullName,
      password: await bcryptjs.hash(password, 10),
      phoneNumber,
      isVerified,
      verificationAccess: verificationCode,
      expirationDate:expiration
    }
     const vendorCreate = await vendor.create(data);
     if(vendorCreate){
     return res.status(200).json({message:"Vendor register successfully"})
     }
} catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};
// Verifying Vendor 
const verifyVendor = async (req, res) => {
    try {
        const{id} = req.params
      const { verificationCode } = req.body;
      const existingVendor = await vendor.findByPk(id);
      if (!existingVendor) {
        return res.status(404).json({ message: 'Email not found' });
      }
      if ( verificationCode === existingVendor.verificationAccess) {
        const now = new Date();
        if (now <= existingVendor.expirationDate) {
          await vendor.update(
            { isVerified: true, verificationAccess: null },
            { where: { id:req.params.id } }
          );
          return res.status(200).json({ message: 'User verified successfully.' });
        } else {
          return res.status(400).json({ message: 'Verification code has expired.' });
        }
      } else {

        return res.status(400).json({ message: 'Invalid verification code.' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error");
    }
  };
  // request for new Verification code
  const requestVerificationCode = async (req, res) => {
    try {
      const { email } = req.body;
      const existingVendor = await vendor.findOne({ where: { email } });
      const verificationCode = generateVerificationCode();
      const expiration  =  new Date(Date.now() + 5 * 60 * 1000)
      sendVerificationEmail(existingVendor.email, existingVendor.fullName, verificationCode, existingVendor.expiration);
      if (!existingVendor) {
        return res.status(404).json({ message: 'Email not found' });
      }else{
        await vendor.update( { isVerified: false, verificationAccess: verificationCode,
             expirationDate:expiration },
             { where: { id:req.params.id } }
             )
             return res.status(200).json({ message: 'New verification code sent. Check your email.' });
      }    
    } catch (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error");
    }
  }
  // Login 
  const vendorLogin = async(req, res, next) =>{
    const token = req.token;
    const vendor = req.body;
    if(vendor){
      return res.status(200).json({message:" Student Successfull login",token});    
    }
};
// Reset Password Link
const passwordRestLink = async(req, res) =>{
  try {
const {email} = req.body;
const existingVendor = await vendor.findOne({where:{email}});
if(!existingVendor){
 return res.status(404).json({message:"Email not found"})
}else{
  const resetToken = crypto.randomBytes(20).toString('hex');
  const expirationDate = new Date();
  expirationDate.setMinutes(expirationDate.getMinutes() + 5);
  const expiration  =  new Date(Date.now() + 5 * 60 * 1000)
  console.log(resetToken);
  await vendor.update({
    verificationAccess: resetToken,
    expirationDate:expiration},
    { where: { id:req.params.id } }
  )
  const resetVerication = process.env.FORGETPASSWORDLINK
  var mailOptions = {
    from: 'maximnyansa75@gmail.com',
    to: email,
    subject: 'Password Reset Email ',
    html: `<p>
    Please click the following link to reset your account's password: 
    <br>
    <a href="${resetVerication}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: #ffffff; text-decoration: none; border-radius: 5px;">
      Reset Password
       </a>
  </p>
  <p>This code will expire on ${expirationDate}.</p>
  <p>
    If you simply ignore the link, your password will remain unchanged!
  </p>`
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      return res.status(500).json({message:error})
    } else {
      return res.status(200).json({message:"Email sent"})
   
    }
  });
}
} catch (error) {
  console.error(error);
  return res.status(500).send("Internal Server Error");
}
}
// reset password 
const restPassword = async(req, res) =>{
  try {
  const{id} = req.params
  const{password, confimedPassword} = req.body;
  const existingVendor = await vendor.findByPk(id);
  if(!existingVendor){
    return res.status(404).json({ message: 'Vendor not found' });
  }
  if(password === confimedPassword){  
    const now = new Date();
    if(now <= existingVendor.expirationDate){
     const hashPassword = await bcryptjs.hash(password, 10) 
    await vendor.update(
      { verificationAccess: null, password:hashPassword },
      { where: { id:req.params.id } }
    );
    return res.status(200).json({ message: 'Password successfully Updated.' });
  } else {
    return res.status(400).json({ message: 'Password code has expired.' });
  }
} else {
  return res.status(400).json({ message: 'Password do not match.' });
}
} catch (error) {
  console.log  (error);
  return res.status(500).json({message:"Internal Server Error"});
}
}
// create Store 
const createStoreVendor = async(req, res)=>{
  try { 
  const {businessAddress, businessDescription, businessName} = req.body;
  const data = {
    businessName,
    businessDescription,
    businessAddress
  }
 const create_store= await createStore.create(data);
 if (create_store){
  return res.status(200).json({message:"Store created Succesfully"})
 }else{
  return res.status(404).json({message:"Unable to create Store"})
 }
} catch (error) {
  console.log  (error);
  return res.status(500).json({message:"Internal Server Error"});
}
}

// add Price
const productPrice = async(req, res)=>{
  try { 
  const {price, compared_At, quantity, tags, set_Status} = req.body;
  const data = {
      price,
      compared_At,
      quantity,
      tags,
      set_Status
  }
 const create_Price= await product_Price .create(data);
 if (create_Price){
  return res.status(200).json({message:"Price created Succesfully"})
 }else{
  return res.status(404).json({message:"Unable to Price"})
 }
} catch (error) {
  console.log  (error);
  return res.status(500).json({message:"Internal Server Error"});
}
}

// Add your social media Account
const socialAccount = async(req, res)=>{
  try { 
  const {website, instagram, faceBook, twitter, anyOtherLink} = req.body;
  const data = {
    website,
    instagram,
    faceBook,
    twitter,
    anyOtherLink
  }
 const createYoursocialMedia = await social_media .create(data);
 if (createYoursocialMedia){
  return res.status(200).json({message:"social Media created Succesfully"})
 }else{
  return res.status(404).json({message:"Unable to social Media"})
 }
} catch (error) {
  console.log  (error);
  return res.status(500).json({message:"Internal Server Error"});
}
}
// Add beneficiary 
const beneficiaryTable = async(req, res)=>{
  try { 
  const data = req.body;
  const createBeneficiary = await beneficiary_table.create(data);
  if (createBeneficiary){
    return res.status(200).json({message:"Beneficiary created Succesfully"})
   }else{
    return res.status(404).json({message:"Unable to Beneficiary"})
   }
  } catch (error) {
    console.log  (error);
    return res.status(500).json({message:"Internal Server Error"});
  }
}
export default {signup, verifyVendor, requestVerificationCode, vendorLogin, passwordRestLink, restPassword, beneficiaryTable, createStoreVendor, productPrice, socialAccount };



