const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userModel, validateUser } = require("../models/user-model");
const genToken=require('../utils/generateToken');

module.exports.registerUser=async (req, res) => {
    try{
        const { error } = validateUser(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        const userobj=req.body;
        const userexists=await userModel.findOne({
            email:req.body.email
        })
        if(userexists){
            return res.status(200).send('user already exists');
        }
        const hashedPassword = await bcrypt.hash(userobj.password, 10);
        userobj.password=hashedPassword;
        const user = await userModel.create(userobj);
        const token = genToken(user);
        res.cookie("token", token);
        res.status(201).json(user);
        
    } catch(err){
        res.send(err.message);
    }
}

module.exports.loginUser=async(req,res)=>{
    const user=await userModel.findOne({
        email:req.body.email,
    })
    const isMatch = await bcrypt.compare(
        req.body.password,
        user.password
    );
    if(isMatch){
        const token = genToken(user);
        res.cookie("token", token);
        return res.status(201).json(user);
    }
    res.status(400).send('user is not registered , please SignUp');
}