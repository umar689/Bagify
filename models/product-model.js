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
        data: Buffer,
        contentType: String
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
// Joi Validation Schema
const validateProduct = (data) => {
    const schema = Joi.object({
        name: Joi.string()
            .required()
            .messages({
                "string.empty": "Product name is required",
                "any.required": "Product name is required"
            }),

        price: Joi.number()
            .min(0)
            .required()
            .messages({
                "number.base": "Price must be a number",
                "any.required": "Price is required",
                "number.min": "Price cannot be negative"
            }),

        discount: Joi.number()
            .min(0)
            .default(0)
            .messages({
                "number.base": "Discount must be a number",
                "number.min": "Discount cannot be negative"
            }),

        image: Joi.string()
            .required()
            .messages({
                "string.empty": "Product image is required",
                "any.required": "Product image is required"
            }),

        bgcolor: Joi.string()
            .messages({
                "string.base": "Background color must be a string"
            }),

        panelcolor: Joi.string()
            .messages({
                "string.base": "Panel color must be a string"
            }),

        textcolor: Joi.string()
            .messages({
                "string.base": "Text color must be a string"
            }),

        stock: Joi.number()
            .min(0)
            .messages({
                "number.base": "Stock must be a number",
                "number.min": "Stock cannot be negative"
            }),

        description: Joi.string()
            .allow("", null)
            .messages({
                "string.base": "Description must be a string"
            })
    });

    return schema.validate(data, {
        abortEarly: false
    });
};
const productModel = mongoose.model("Product", productSchema);

module.exports = {
    productModel,
    validateProduct
};