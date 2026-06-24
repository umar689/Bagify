const express=require('express');
const router=express.Router();
const {isLoggedIn}=require('../middlewares/isLoggedIn');
const {productModel,validateProduct}=require('../models/product-model');
const {userModel}=require('../models/user-model');
var log = require('../utils/loggedin');
const upload=require('../config/multer')

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

router.get('/shop', isLoggedIn, async (req, res) => {

    let allproducts;

    if (req.query.sortby === "newest") {
        allproducts = await productModel.find().sort({ createdAt: -1 });
    }
    else {
        // Popular ke liye abhi default order
        allproducts = await productModel.find();
    }

    const success = req.flash("success");

    res.render('shop', {
        products: allproducts,
        loggedin: log,
        success,
        currentRoute: req.path,
        sortby: req.query.sortby || 'popular'
    });
});

router.get('/shop/discounted',isLoggedIn,async(req,res)=>{
    let query = productModel.find({
        discount: { $gt: 0 }
    });

    if (req.query.sortby === "newest") {
        query = query.sort({ createdAt: -1 });
    }

    const allproducts = await query;
    
    const success=req.flash("success");
    res.render('shop', {
        products: allproducts,
        loggedin: log,
        success,
        currentRoute: req.path,
        sortby: req.query.sortby || 'popular'
    });
})

router.get('/shop/new', isLoggedIn, async (req, res) => {
     const fourDaysAgo = new Date();
    fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);

    let query = productModel.find({
        createdAt: { $gte: fourDaysAgo }
    });

    if (req.query.sortby === "newest") {
        query = query.sort({ createdAt: -1 });
    }

    const allproducts = await query;
    const success = req.flash("success");
        res.render('shop', {
        products: allproducts,
        loggedin: log,
        success,
        currentRoute: req.path,
        sortby: req.query.sortby || 'popular'
    });
});

router.get('/cart', isLoggedIn, async (req, res) => {
    const user = await userModel.findById(req.user.id).populate('cart.product');
    if(user.cart!==undefined && user.cart.length>0){
        return res.render('cart', { user,
            loggedin : log
        });
    }
    return res.render('oops',{loggedin:log})
});

router.post('/cart/delete/:pid',isLoggedIn,async(req,res)=>{
    const user = await userModel.findById(req.user.id).populate('cart.product');
    user.cart = user.cart.filter(
      item => item._id.toString() !== req.params.pid
    );
    await user.save();
    res.redirect(req.get('Referrer'));
})

router.post('/cart/incbyone/:pid',isLoggedIn,async(req,res)=>{
    // res.send(req.user);
    const user = await userModel.findById(req.user.id).populate('cart.product');
    console.log(user.cart[0]);
    console.log(req.params.pid);
    const prodobj = user.cart.find(
      item => item._id.toString() === req.params.pid
    );
    prodobj.quantity++;
    await user.save();
    res.redirect(req.get('Referrer'));
})

router.post('/cart/decbyone/:pid',isLoggedIn,async(req,res)=>{
    const user = await userModel.findById(req.user.id).populate('cart.product');
    console.log(user.cart[0]);
    console.log(req.params.pid);
    const prodobj = user.cart.find(
      item => item._id.toString() === req.params.pid
    );
    prodobj.quantity--;
    await user.save();
    res.redirect(req.get('Referrer'));
})

router.get("/account", isLoggedIn, async (req, res) => {
    const user = await userModel.findById(req.user.id);
    res.render("account", {
        success:req.flash('success'), 
        user,
        loggedin : log
     });
});

router.get("/account/edit", isLoggedIn, async (req, res) => {
    const user = await userModel.findById(req.user.id);
    res.render("edit-profile", { user ,
        loggedin : log
    });
});

router.post("/account/edit", isLoggedIn, async (req, res) => {
    const { username, contact, picture } = req.body;
    await userModel.findByIdAndUpdate(
        req.user.id,
        {
            username,
            contact,
            picture
        }
    );
    req.flash("success", "Profile updated successfully");
    res.redirect("/account");
});


router.post('/upload',
    upload.single('picture'),
    isLoggedIn,
    async (req, res) => {
        const user = await userModel.findById(req.user.id);
        user.picture = {
            data: req.file.buffer,
            contentType: req.file.mimetype
        };
        await user.save();
        res.redirect('/account');
});


module.exports=router;
