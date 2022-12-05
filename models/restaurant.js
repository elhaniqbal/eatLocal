const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;


const restaurantSchema = new Schema ({

    name: String,
    address : String,
    image: String,
    cuisine: String,
    price: String,
    description: String,
    author: {
        type: Schema.Types.ObjectId,
        ref:'User'

    },
    reviews: [{
       type: Schema.Types.ObjectId,
       ref: 'Review'
    }]

});
restaurantSchema.post('findOneAndDelete', async(doc)=> {

    if(doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }

})
module.exports = mongoose.model('Restaurant', restaurantSchema);


 