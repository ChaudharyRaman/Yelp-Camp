const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const CampgroundSchema = new Schema({
    title:String,
    image:String,
    price:Number,
    description:String,
    location:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
});

CampgroundSchema.post('findOneAndDelete',async function(doc){
    // console.log("DELETED");
    if(doc){
        await Review.remove({
            _id:{
                // delete all reviews where their Id in in doc.reviews arrray....
                $in: doc.reviews
            }
        })
    }
});

module.exports = mongoose.model('Campground',CampgroundSchema); 