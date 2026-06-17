const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    discount: {
        type: Number,
        default: 0
    },

    image: {
        type: String,
        required: true
    },

    bgcolor: {
        type: String,
        default: "#ffffff"
    },

    panelcolor: {
        type: String,
        default: "#f5f5f5"
    },

    textcolor: {
        type: String,
        default: "#000000"
    },

    stock: {
        type: Number,
        default: 0
    },

    description: {
        type: String
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Product", productSchema);