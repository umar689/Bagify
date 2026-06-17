const mongoose = require("mongoose");
const Joi = require("joi");

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

// Joi Validation Schema
const validateProduct = (data) => {
    const schema = Joi.object({
        name: Joi.string()
            .required(),

        price: Joi.number()
            .min(0)
            .required(),

        discount: Joi.number()
            .min(0)
            .default(0),

        image: Joi.string()
            .required(),

        bgcolor: Joi.string(),

        panelcolor: Joi.string(),

        textcolor: Joi.string(),

        stock: Joi.number()
            .min(0),

        description: Joi.string()
            .allow("", null)
    });

    return schema.validate(data);
};

const productModel = mongoose.model("Product", productSchema);

module.exports = {
    productModel,
    validateProduct
};