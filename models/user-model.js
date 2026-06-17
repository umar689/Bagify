const mongoose = require("mongoose");
const Joi = require("joi");

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

// Joi Validation Schema
const validateUser = (data) => {
    const schema = Joi.object({
        username: Joi.string()
            .min(3)
            .required(),

        email: Joi.string()
            .email()
            .required(),

        password: Joi.string()
            .min(6)
            .required(),

        contact: Joi.number(),

        picture: Joi.string(),

        cart: Joi.array().items(
            Joi.string().hex().length(24)
        ),

        orders: Joi.array().items(
            Joi.string().hex().length(24)
        )
    });

    return schema.validate(data);
};

const userModel = mongoose.model("User", userSchema);

module.exports = {
    userModel,
    validateUser
};