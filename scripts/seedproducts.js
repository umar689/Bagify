const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const { productModel, validateProduct } = require("../models/product-model");// apne model ka path change kar lena

// mongoose
//   .connect("mongodb://127.0.0.1:27017/Bagify") // apna DB name
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.log(err));

const products = [
  {
    name: "Classic Black Bag",
    price: 2499,
    discount: 10,
    image: "1bag.png",
    bgcolor: "#000000",
    panelcolor: "#1f1f1f",
    textcolor: "#ffffff",
    stock: 15,
    description: "Premium black leather backpack."
  },
  {
    name: "Travel Explorer",
    price: 2999,
    discount: 15,
    image: "2bag.png",
    bgcolor: "#1e3a8a",
    panelcolor: "#dbeafe",
    textcolor: "#000000",
    stock: 20,
    description: "Perfect bag for travel lovers."
  },
  {
    name: "Urban Carry",
    price: 1899,
    discount: 5,
    image: "3bag 1.png",
    bgcolor: "#f59e0b",
    panelcolor: "#fef3c7",
    textcolor: "#000000",
    stock: 30,
    description: "Stylish everyday backpack."
  },
  {
    name: "Office Pro",
    price: 3299,
    discount: 20,
    image: "4bag.png",
    bgcolor: "#4b5563",
    panelcolor: "#e5e7eb",
    textcolor: "#000000",
    stock: 10,
    description: "Professional office laptop bag."
  },
  {
    name: "Adventure Pack",
    price: 2799,
    discount: 12,
    image: "5bag.png",
    bgcolor: "#065f46",
    panelcolor: "#d1fae5",
    textcolor: "#000000",
    stock: 18,
    description: "Built for outdoor adventures."
  },
  {
    name: "Minimal Backpack",
    price: 1599,
    discount: 8,
    image: "6bag.png",
    bgcolor: "#f3f4f6",
    panelcolor: "#ffffff",
    textcolor: "#000000",
    stock: 25,
    description: "Minimal and elegant design."
  },
  {
    name: "Campus Bag",
    price: 1399,
    discount: 0,
    image: "7bag.png",
    bgcolor: "#7c3aed",
    panelcolor: "#ede9fe",
    textcolor: "#000000",
    stock: 40,
    description: "Ideal for students."
  },
  {
    name: "Luxury Tote",
    price: 3999,
    discount: 25,
    image: "image 80.png",
    bgcolor: "#b91c1c",
    panelcolor: "#fee2e2",
    textcolor: "#000000",
    stock: 8,
    description: "Luxury premium tote bag."
  }
];

module.exports=async function seedProducts() {
  try {
    for (const item of products) {
      const imagePath = path.join(
          __dirname,
          "../public/images",
          item.image
      );

      const imageBuffer = fs.readFileSync(imagePath);

      await productModel.create({
        name: item.name,
        price: item.price,
        discount: item.discount,
        image: {
          data: imageBuffer,
          contentType: "image/png",
        },
        bgcolor: item.bgcolor,
        panelcolor: item.panelcolor,
        textcolor: item.textcolor,
        stock: item.stock,
        description: item.description,
      });
    }

    console.log("✅ Products Added Successfully");
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
}

