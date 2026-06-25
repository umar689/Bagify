const express=require('express');
const router=express.Router();
const { ownerModel, validateOwner } = require("../models/owner-model");
const { productModel, validateProduct } = require("../models/product-model");
const upload = require('../config/multer-config');
const hash = require('../utils/hashpassword');
const gentokenowner=require('../utils/generateTokenOwner');
const bcrypt = require("bcrypt");
const isOwnerLoggedIn = require('../middlewares/isOwnerLoggedIn');

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
            const hashedPassword = await hash(password);
            const user=await ownerModel.create({
                username,
                email,
                password : hashedPassword
            })
            const token = gentokenowner(user);
            res.cookie('token',token);
            res.send(user);
        } catch(err){
            res.send(err.message);
        }
    });
}

router.get('/login',(req,res)=>{
    res.render('ownerlogin');
})

router.post('/login',async(req,res)=>{
    let {email,password}=req.body;
    const user=await ownerModel.findOne({email});
    if (!user) {
        return res.status(400).send("Invalid email or password");
    }
    const isMatch = await bcrypt.compare(
        password,        // user ne jo password enter kiya
        user.password    // database me hashed password
    );
    if (!isMatch) {
        return res.status(400).send("Invalid email or password");
    }
    const token = gentokenowner(user);
    res.cookie('token',token);
    res.redirect('/owners/admin');
})

router.get('/logout',isOwnerLoggedIn,async(req,res)=>{
    if(req.cookies.token){
        res.clearCookie('token');
    }
    res.redirect('/owners/login')
});

router.get('/admin',isOwnerLoggedIn,async (req,res)=>{
    const allproducts = await productModel.find();
    // console.log(allproducts);
    res.render('admin',{allproducts});
})

router.get('/product/deleteone/:pid',isOwnerLoggedIn,async(req,res)=>{
    await productModel.findByIdAndDelete(req.params.pid);
    res.redirect(req.get('Referrer'));
})

router.get('/product/deleteall',isOwnerLoggedIn, async (req, res) => {
    await productModel.deleteMany({});
    res.redirect(req.get('Referrer') || '/owners/admin');
});

router.get('/product/create',isOwnerLoggedIn,(req,res)=>{
    res.render("createproducts",{
        success:""
    });
})

router.post(
    "/product/create",isOwnerLoggedIn,
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