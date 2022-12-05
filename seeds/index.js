
const mongoose = require('mongoose');
const cities = require('./cities');
const {descriptors, attachments, cuisines} = require('./seedRestaurants');

const Restaurant = require('../models/restaurant');

 
mongoose.connect('mongodb://localhost:27017/eatLocal', {
    useNewUrlParser: true,
    useUnifiedTopology: true

});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error: "));

db.once("open", ()=> {
    console.log("Database connection successful!");
})



const generator = array => array[Math.floor(Math.random() * array.length)];



const seedDB = async () => {
    await Restaurant.deleteMany({});
    for (let i = 0; i < 50; i++) {

        const random1000 = Math.floor(Math.random() * 1000);
        const rest = new Restaurant({
            author: '638d1813530378158c3db9dc',
            name: `${generator(descriptors)} ${generator(attachments)}` ,
            address :`${cities[random1000].city}, ${cities[random1000].state}`,
            cuisine:`${generator(cuisines)}`,
            image: 'https://source.unsplash.com/collection/67395466',
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui cumque eaque cum autem id rem quos consectetur aut aperiam assumenda harum rerum nostrum in, iusto excepturi blanditiis, quidem ab beatae!'
        })

        await rest.save();

    }

}

seedDB();
