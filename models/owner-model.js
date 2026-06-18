const mongoose = require("mongoose");
const Joi = require("joi");

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

// Joi Validation Schema
const validateOwner = (data) => {
    const schema = Joi.object({
        username: Joi.string()
            .min(3)
            .max(30)
            .required()
            .messages({
                "string.empty": "Username is required",
                "any.required": "Username is required",
                "string.min": "Username must be at least 3 characters long",
                "string.max": "Username cannot exceed 30 characters"
            }),

        email: Joi.string()
            .email()
            .required()
            .messages({
                "string.empty": "Email is required",
                "any.required": "Email is required",
                "string.email": "Please enter a valid email address"
            }),

        password: Joi.string()
            .min(6)
            .required()
            .messages({
                "string.empty": "Password is required",
                "any.required": "Password is required",
                "string.min": "Password must be at least 6 characters long"
            }),

        gstin: Joi.string()
            .allow("", null)
            .messages({
                "string.base": "GSTIN must be a string"
            }),

        picture: Joi.string()
            .messages({
                "string.base": "Picture must be a string"
            }),

        products: Joi.array()
            .items(
                Joi.string()
                    .hex()
                    .length(24)
                    .messages({
                        "string.hex": "Invalid Product ID format",
                        "string.length": "Product ID must be 24 characters long"
                    })
            )
            .messages({
                "array.base": "Products must be an array"
            })
    });

    return schema.validate(data, {
        abortEarly: false
    });
};
const ownerModel = mongoose.model("Owner", ownerSchema);

module.exports = {
    ownerModel,
    validateOwner
};