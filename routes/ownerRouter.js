const express=require('express');
const router=express.Router();
const { ownerModel, validateOwner } = require("../models/owner-model");
const { productModel, validateProduct } = require("../models/product-model");
const upload = require('../config/multer-config');

router.get('/',function(req,res){
    res.send("basic owner route");
})

// console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV==="development"){
    router.post('/create',async function(req,res){
        try{
            const userch=await ownerModel.find();
            if(userch.length>=1){
                return res.status(500).send('owner already exist,new user cannot be created');
            }
            const { error } = validateOwner(req.body);
            if (error) {
                return res.status(400).send(error.details[0].message);
            }
            let {username,email,password}=req.body;
            const user=await ownerModel.create({
                username,
                email,
                password
            })
            res.send(user);
        } catch(err){
            res.send(err.message);
        }
    });
}

router.get('/admin',(req,res)=>{
    res.render('admin');
})

router.get('/product/create',(req,res)=>{
    res.render("createproducts",{
        success:""
    });
})

router.post(
    "/product/create",
    upload.single("image"),
    async (req, res) => {
        try {
            console.log(req.file);
            const product = await productModel.create({
                name: req.body.name,
                price: req.body.price,
                discount: req.body.discount,
                bgcolor: req.body.bgcolor,
                panelcolor: req.body.panelcolor,
                textcolor: req.body.textcolor,

                image: {
                    data: req.file.buffer,
                    contentType: req.file.mimetype
                }
            });

            res.send(product);
        } catch (err) {
            console.log(err);
            res.status(500).send(err.message);
        }
    }
);

module.exports=router;