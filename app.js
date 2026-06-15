const express=require('express');
const app=express();
const DBconnection=require('./config/mongoose-connection');
const userRouter=require('./routes/userRoute');
const productRouter=require('./routes/productRouter');
const ownerRouter=require('./routes/ownerRouter');

app.get('/',(req,res)=>{
    res.send('Hello World');
});
 
app.use('/user',userRouter);
app.use('/product',productRouter);
app.use('/owner',ownerRouter);

app.listen(8000,()=>{
    console.log('Server is running on port 8000');
});