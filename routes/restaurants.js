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
const router = express.Router();
const {validateRestaurant,isLoggedIn, isAuthor} = require('../middleware');


router.get('/', catchAsync(async (req,res) => {
    const restaurants = await Restaurant.find({});
    res.render('restaurants/index' , {restaurants});
}));

router.get('/new', isLoggedIn, (req,res) => { 
    
    res.render('restaurants/new');
    
});

router.post('/',isLoggedIn,validateRestaurant, catchAsync(async (req,res) => {  
    const restaurant = new Restaurant(req.body.restaurant);
    restaurant.author = req.user._id;
    await restaurant.save();
    req.flash('success', 'Restaurant added Sucessfully!');
    res.redirect(`/restaurants/${restaurant._id}`);
    
}));

router.get('/:id', isLoggedIn, catchAsync(async (req,res) => {

    const restaurant = await Restaurant.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    res.render('restaurants/show', {restaurant});
    
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req,res) => {
    const {id} = req.params;
    const restaurant = await Restaurant.findById(id);
    if(!restaurant){
        req.flash("error","Whoops! Cannot find that restaurant!");
        res.redirect('/restaurants');
    }
    res.render('restaurants/edit', {restaurant});
}));

router.put('/:id', isLoggedIn,isAuthor,validateRestaurant, catchAsync(async(req,res) => {
    const {id} = req.params;
    const restaurant= await Restaurant.findByIdAndUpdate(id, { ...req.body.restaurant});
    res.redirect(`/restaurants/${restaurant._id}`);
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async(req,res) => {
    const {id} = req.params;
    await Restaurant.findByIdAndDelete(id);
    res.redirect('/restaurants');
}));



module.exports = router;
