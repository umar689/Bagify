const express=require('express');
const router=express.Router();
const { productModel, validateProduct } = require("../models/product-model");


router.get('/',function(req,res){
    res.send("basic product route");
})




module.exports=router;

