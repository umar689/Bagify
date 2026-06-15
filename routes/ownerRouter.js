const express=require('express');
const router=express.Router();

router.get('/',function(req,res){
    res.send("basic owner route");
})

module.exports=router;