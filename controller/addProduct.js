import product from "../model/addProduct.js"
import multer from 'multer';
import path from 'path'
import { Op } from 'sequelize';
const stortage = multer.diskStorage({
  destination:(req,file,cb)=>{
      cb(null, './Images')
  },
  filename:(req, file, cb) =>{
     cb(null, Date.now() + path.extname(file.originalname))
  }
})
const upload = multer({ 
  storage:stortage,
  limits:{fileSize:'1000000'},
  fileFilter:(req, file, cb, ) => {
      const fileType =  /jpeg|jpg|png|gif/
   //   /pdf|doc|xls|ppt|jpeg|jpg|png|gif/ 
      const mimeType = fileType.test(file.mimetype)
      const extname = fileType.test(path.extname(file.originalname))
      if (mimeType && extname){
          return cb(null, true)
      }
      cb("Give proper files fromate to upload")
      console.log("Give proper files");
  }
}).array('Images',  20)
  const addMultipleProduct =  async(req,res)=>{
    try {
        const addProduct = {
            productName:req.body.productName,
            productDescription:req.body.productDescription,
            selectCategory:req.body.selectCategory,
            Images: JSON.stringify(req.files.map(file => file.path)),
        }
        const createProduct = await product.create(addProduct);
        if(createProduct){
            res.status(201).json({message:'Successfully', addProduct});
            return;
        }else{
            return res.status(404).json({message:"Unsuccessfully"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Internal Server Error', error})
    }
};
// get product by product Name
const seachProduct = async(req, res)=>{
try {
const { search } =  req.body;
const seachResult = await product.findAll({
    where: {
        productName: { [Op.like]: `%${search}%` },
    },  
    raw: true,
  })   
  if (seachResult.length > 0) {
    return res.status(200).json({ message: 'Results',  data:seachResult.length,seachResult, });
} else {
    return res.status(404).json({ message: 'No Product found' });
}
} catch (error) {
    console.log(error);
    res.status(500).json({message:'Internal Server Error', error})   
}
}
// get all post
const getAllProduct = async (req, res) => {
    try {
      const allProduct = await product.findAll();
      if (!allProduct) {
        return res.status(409).json({ message: "there's no Product" });
      }
      if (allProduct)
        return res.status(200).json({
          message: "Successful",
         
          data: allProduct.length,
          allProduct,
        });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server error", error });
    }
  };
  // update product 
  const updateProduct = async (req, res) => {
    const { id } = req.params;
    const update = req.body;
    try {
      const searchId = await product.findByPk(id);
      if (!searchId) {
        return res.status(409).json({ message: "Product not found" });
      }
      const updatedProduct = await product.update(update, { where: { id } });
      if(updatedProduct){
        return res
        .status(200)
        .json({ message: "Product updated successful",  updatedProduct });
      }
     
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "server error" });
    }
  };

  const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const searchId = await product.findByPk(id);
        if (!searchId) {
          return res.status(409).json({ message: "Product not found" });
      }
      const deleteProduct = await product.destroy({ where: { id } });
      return res
        .status(200)
        .json({ message: "deleted successfully", deleteProduct });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "server error" });
    }
  }
export default {upload, addMultipleProduct, seachProduct, getAllProduct, updateProduct, deleteProduct}