const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    gstin: {
        type: String
    },

    picture: {
        type: String,
        default: "/images/default-owner.png"
    },

    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }]

}, {
    timestamps: true
});

module.exports = mongoose.model("Owner", ownerSchema);