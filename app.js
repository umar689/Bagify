const express=require('express');
const app=express();
const DBconnection=require('./config/mongoose-connection');
const userRouter=require('./routes/userRoute');
const productRouter=require('./routes/productRouter');
const ownerRouter=require('./routes/ownerRouter');
const hourseRouter=require('./routes/hourseRouter.js');
const indexRouter=require('./routes/indexRouter');
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const session = require("express-session");
const flash = require("connect-flash");



app.use(express.json());
app.use(express.urlencoded({ extended: true }));app.use(
    session({
        secret: "mysecretkey",
        resave: false,
        saveUninitialized: false
    })
);
app.use(flash());

app.set('view engine','ejs');


app.use('/',indexRouter);
app.use('/user',userRouter);
app.use('/product',productRouter);
app.use('/owner',ownerRouter);
app.use('/hourse',hourseRouter);

app.listen(8000,()=>{
    console.log('Server is running on port 8000');
});