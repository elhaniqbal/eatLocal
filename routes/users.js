const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

router.get('/register', (req,res) =>{
    res.render('users/register');
});

router.get('/login', (req,res) => {
    res.render('users/login');
});

router.post('/register', catchAsync (async(req,res) => {

    try{
    const { firstName, lastName, email, username, password} = req.body;
    const user = new User({ firstName,lastName,email,username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
        if(err) return next();
        req.flash('success',"Welcome to eatLocal!");
        res.redirect('/restaurants');
    })
    }
   catch(e){
    req.flash('error', e.message);
    res.redirect('register');
   }
}));

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req,res) => {
    req.flash("success", 'Welcome Back!');
    res.redirect('/restaurants');
})

router.get('/logout', (req,res) => {
    req.logout((err) =>{
        if(err){return next(err);}
        req.flash('success', 'Successfully Logged Out!');
        res.redirect('/restaurants');
    });
   

})
module.exports = router;