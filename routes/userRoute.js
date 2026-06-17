const express=require('express');
const router=express.Router();
const { userModel, validateUser } = require("../models/user-model");


router.get('/',function(req,res){
    res.send("user's basic route");
})

router.post("/register", async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const user = await userModel.create(req.body);
    res.status(201).json(user);
});

module.exports=router;