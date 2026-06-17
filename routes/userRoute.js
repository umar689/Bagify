const express=require('express');
const router=express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userModel, validateUser } = require("../models/user-model");
const genToken=require('../utils/generateToken');
require("dotenv").config();

const {registerUser , loginUser}=require('../controllers/authController');

router.get('/',function(req,res){
    res.send("user's basic route");
})

router.post("/register", registerUser);

router.post("/login", loginUser);

module.exports=router;