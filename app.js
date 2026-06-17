const express=require('express');
const app=express();
const DBconnection=require('./config/mongoose-connection');
const userRouter=require('./routes/userRoute');
const productRouter=require('./routes/productRouter');
const ownerRouter=require('./routes/ownerRouter');
const hourseRouter=require('./routes/hourseRouter.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine','ejs');

app.get('/',(req,res)=>{
    const message="";
    const error="";
    res.render('index',{message,error});
});
 
app.use('/user',userRouter);
app.use('/product',productRouter);
app.use('/owner',ownerRouter);
app.use('/hourse',hourseRouter);

app.listen(8000,()=>{
    console.log('Server is running on port 8000');
});