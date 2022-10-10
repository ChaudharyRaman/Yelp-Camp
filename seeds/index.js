const access_key = 'xiGhjaUo8usOem_o0gKwjxfvr6BWP1ou_sFAg0hkKBI';
const mongoose = require('mongoose');
// MODEL REF
// const Campground = require('./models/campground');
const Campground = require('../models/campground');
const cities = require('./cities');
const {descriptors,places} = require('./seedHelper');


// DB CONNECTION
mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database Connected");
});

// const sample = array => array[Math.floor(Math.random()*array.length)];
const sample = function(array){
    return array[Math.floor(Math.random() * array.length)];
    // console.log(array.length);
};

const seedDB = async()=>{
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location:`${cities[random1000].city},${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            image:`https://source.unsplash.com/collection/483251`,
            description:'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised',
            price:price
        });
        await camp.save();
    }
    // c.save();
};
seedDB().then(()=>{
    mongoose.connection.close();
});