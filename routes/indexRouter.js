const express=require('express');
const router=express.Router();
const {isLoggedIn}=require('../middlewares/isLoggedIn');
const {productModel,validateProduct}=require('../models/product-model');
const {userModel}=require('../models/user-model');

router.get('/',(req,res)=>{
    const error = req.flash("error");
    res.render('index',{error});
});

router.get('/cart/:pid',isLoggedIn,async(req,res)=>{
    const user=await userModel.findById(req.user.id);
    var c=0;
    user.cart.forEach(function(productinfo){
        if(productinfo.product.toString() === req.params.pid){
            c=1;
        }
    })
    if(c==1) return res.redirect('/shop');
    user.cart.push({product : req.params.pid});
    
    await user.save();
    req.flash('success','Product added successfully');
    res.redirect('/shop')
})

router.get('/shop',isLoggedIn,async(req,res)=>{

    const allproducts=await productModel.find();
    var loggedin=false;
    const success=req.flash("success");
    if(req.cookies.token){
        loggedin=true;
    }
    res.render('shop',{
        products:allproducts,
        loggedin,
        success
    });
})

router.get('/cart',isLoggedIn,async (req,res)=>{
    const user=await userModel.findById(req.user.id).populate('cart');
    console.log(user);
    res.render('cart',{user});
});



module.exports=router;
