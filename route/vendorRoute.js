import express from 'express';
import vendor from '../controller/vendorController.js';
import vendorAuth from '../middleware/vendorAuth.js';
import validator from '../validator/vendor.js'
import Product from '../controller/addProduct.js';
const router = express.Router();
router.post('/signup', validator, vendor.signup)
router.post('/verify/:id', vendor.verifyVendor)
router.post('/requestVerificationCode/:id', vendor.requestVerificationCode)
router.post('/login', vendorAuth.loginAuth, vendor.vendorLogin)
router.post('/forgetPassword/:id', vendor.passwordRestLink)
router.post('/resetPassword/:id', vendor.restPassword )
router.post('/createStore', vendor.createStoreVendor )
router.post('/addMultipleProduct', vendorAuth.tokenVerification, Product.upload,Product.addMultipleProduct)
router.get('/searchProduct', vendorAuth.tokenVerification, Product.seachProduct )
router.get('/allProduct', Product.getAllProduct)
router.put('/updateProduct/:id', Product.updateProduct)
router.delete('/deleteProduct/:id', Product.deleteProduct)
router.post('/addPrice', vendor.productPrice)
router.post('/socialMedia', vendor.socialAccount)
export default router;
