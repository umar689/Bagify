const express=require('express');
const router=express.Router();
const { ownerModel, validateOwner } = require("../models/owner-model");

router.get('/',function(req,res){
    res.send("basic owner route");
})

console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV==="development"){
    router.post('/create',async function(req,res){
        const { error } = validateOwner(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        const userch=await ownerModel.find();
        if(userch.length>=1){
            return res.status(500).send('owner already exist,new user cannot be created');
        }
        let {username,email,password}=req.body;
        const user=await ownerModel.create({
            username,
            email,
            password
        })
        res.send(user);
    });
}
    

module.exports=router;