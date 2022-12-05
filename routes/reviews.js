const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const ejsMate = require('ejs-mate');
const catchAsync = require('../utils/catchAsync');
const Restaurant = require('../models/restaurant');
const ExpressError = require('../utils/ExpressError');
const {restaurantSchema, reviewSchema} = require('../schemas.js');
const Review = require('../models/review');
const router = express.Router({mergeParams:true});
const {isLoggedIn,validateReview, isReviewAuthor} = require('../middleware');



router.post('/', validateReview, isLoggedIn, catchAsync(async (req,res) => {  
    const restaurant = await Restaurant.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    restaurant.reviews.push(review);  
    await review.save();
    await restaurant.save(); 
    console.log(review)
    res.redirect(`/restaurants/${restaurant._id}`);
}));

router.delete('/:reviewID', isLoggedIn, isReviewAuthor, catchAsync(async (req,res) => {
    const {id, reviewID} = req.params;
    await Restaurant.findByIdAndUpdate(id, { $pull: {reviews: reviewID}});
    await Review.findByIdAndDelete(reviewID);
    res.redirect(`/restaurants/${id}`);
}))

module.exports = router;