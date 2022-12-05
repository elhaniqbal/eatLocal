const Joi = require('joi');
const {number} =require('joi');

module.exports.restaurantSchema = Joi.object({
    restaurant: Joi.object({
        name: Joi.string().required(),
        cuisine: Joi.string().required(),
        image: Joi.string().required(),
        address: Joi.string().required(),
        description: Joi.string().required()
    }).required()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(0).max(10),
        body: Joi.string().required()
    }).required()
})