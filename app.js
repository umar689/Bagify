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
const path = require("path");

app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    })
);
app.use(flash());

app.set('view engine','ejs');


app.use('/',indexRouter);
app.use('/users',userRouter);
app.use('/products',productRouter);
app.use('/owners',ownerRouter);
app.use('/hourse',hourseRouter);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🌐 Local: http://localhost:${PORT}`);
});