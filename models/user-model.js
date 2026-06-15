const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true
    },

    contact: {
        type: Number
    },

    picture: {
        type: String,
        default: "/images/default-user.png"
    },

    isAdmin: {
        type: Boolean,
        default: false
    },

    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],

    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    }]

}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);