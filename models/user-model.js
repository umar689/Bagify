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


    cart: [
            {
                product:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref:'Product'
                },
                quantity:{
                    type:Number,
                    default:1
                }
            }
        ],

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
            .required()
            .messages({
                "string.empty": "Username is required",
                "any.required": "Username is required",
                "string.min": "Username must be at least 3 characters long"
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

        contact: Joi.number()
            .messages({
                "number.base": "Contact must be a number"
            }),

        picture: Joi.string(),

        cart: Joi.array().items(
                Joi.object({
                    product: Joi.string()
                        .hex()
                        .length(24)
                        .required(),

                    quantity: Joi.number()
                        .integer()
                        .min(1)
                        .default(1)
                })
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