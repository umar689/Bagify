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
        username: Joi.string().min(3).max(30).required(),

        email: Joi.string().email().required(),

        password: Joi.string().min(6).required(),

        gstin: Joi.string().allow("", null),

        picture: Joi.string(),

        products: Joi.array().items(
            Joi.string().hex().length(24)
        )
    });

    return schema.validate(data);
};

const ownerModel = mongoose.model("Owner", ownerSchema);

module.exports = {
    ownerModel,
    validateOwner
};