const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const catchAsync = require('./utils/catchAsync');
const Restaurant = require('./models/restaurant');
const ExpressError = require('./utils/ExpressError');
const {restaurantSchema, reviewSchema} = require('./schemas.js');
const Review = require('./models/review');
const restaurants = require('./routes/restaurants');
const reviews = require('./routes/reviews');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');
const userRoutes = require('./routes/users');
const restaurantRoutes = require('./routes/restaurants');
const reviewRoutes = require('./routes/reviews');

//test admin username: elhan pass: ElhanTest


mongoose.connect('mongodb://localhost:27017/eatLocal', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error: "));

db.once("open", ()=> {
    console.log("Database connection successful!");
});

const app = express();

app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded( {extended: true} )) // to send post requests by asking express to parse the body 

app.use(methodOverride('_method'));



const sessionConfig = {
            secret: 'this is just a filler object',
            resave: false,
            saveUninitialized: true,
}

app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
app.use('/', userRoutes);
app.use('/restaurants', restaurantRoutes);
app.use('/restaurants/:id/reviews', reviewRoutes);

app.get('/' , (req,res) => {
    res.render('home');
});


app.all('*', (req,res,next) => {
    next(new ExpressError('Page Not Found!', 404))
});

app.use((err,req,res,next) => {
    const { statusCode = 500 } = err;
    if(!err.message){
        err.message="Oops! Something Went Wrong!"
    }
    res.status(statusCode).render('error',{err})
});

app.listen(3000, () => {
    console.log('Server open on port 3000');

});



