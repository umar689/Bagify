const express=require('express');
const router=express.Router();
const { productModel, validateProduct } = require("../models/product-model");


router.get('/',function(req,res){
    res.send("basic product route");
})

router.post("/create", async (req, res) => {
    try {

        const { error } = validateProduct(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const product = await productModel.create(req.body);

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});


module.exports=router;

