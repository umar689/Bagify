const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userModel, validateUser } = require("../models/user-model");
const genToken=require('../utils/generateToken');

module.exports.registerUser=async (req, res) => {
    try{
        const { error } = validateUser(req.body);
        if (error) {
            req.flash("error",error.details[0].message)
            return res.status(200).redirect('/');
            // return res.status(400).send(error.details[0].message);
        }
        const userobj=req.body;
        const userexists=await userModel.findOne({
            email:req.body.email
        })
        if(userexists){
            req.flash("error", "Something Went Worng");
            return res.status(200).redirect('/');
        }
        const hashedPassword = await bcrypt.hash(userobj.password, 10);
        userobj.password=hashedPassword;
        const user = await userModel.create(userobj);
        const token = genToken(user);
        res.cookie("token", token);
        return res.status(201).redirect('/shop');
        
    } catch(err){
        req.flash("error",err.message)
        return res.status(200).redirect('/');
    }
}

module.exports.loginUser=async(req,res)=>{
    try{
        const user=await userModel.findOne({
            email:req.body.email,
        })
        if(user===null){
            req.flash("error", "Something Went Worng");
            return res.status(200).redirect('/');   
        }
        const isMatch = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if(isMatch){
            const token = genToken(user);
            res.cookie("token", token);
            return res.status(201).redirect('/shop');
        }
        req.flash("error", "Something Went Worng");
        return res.status(200).redirect('/');
        // res.status(400).send('user is not registered , please SignUp');
    }catch(err){
        req.flash("error",err.message)
        return res.status(200).redirect('/');
    }
    
}

module.exports.logoutUser=async(req,res)=>{
    if(req.cookies.token){
        res.clearCookie('token');
    }
    res.redirect('/');
}