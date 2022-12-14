const express = require("express");
const app = express();
const methodOverride = require("method-override");
const ejs_mate = require("ejs-mate");

const path = require("path");
// ERRORS
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");

const mongoose = require("mongoose");

// sessions
const session = require('express-session');
// Flash
const flash = require('connect-flash');

// JOI
const Joi = require("joi");
const { campgroundSchema, reviewSchema } = require("./schemas.js");

// MODEL REF
const Review = require("./models/review");
const Campground = require("./models/campground");
const review = require("./models/review");

// ROUTER
const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");
const { log } = require("console");

// CONECTION WITH MONGOOSE
mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});

app.engine("ejs", ejs_mate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "./public")));

const sessionConfig = {
  secret:'thisshouldbeabettersecret!',
  resave:false,
  saveUninitialized:true,
  cookie:{
    httpOnly:true,
    expires:Date.now() + 1000 * 60 *60 *24 *7,
    maxAge:1000 * 60 *60 *24 *7
  }
}
app.use(session(sessionConfig));

// ERROR MIDDLEWARE
// method to check for validation in campground

// -----------------------------------
// Validate MIDDLE WARE
// const validateCampground = (req, res, next) => {
//   // const campgroundSchema = Joi.object({
//   //   campground:Joi.object({
//   //     title:Joi.string().required(),
//   //     price:Joi.number().required().min(0),
//   //     image:Joi.string().required(),
//   //     location:Joi.string().required(),
//   //     description:Joi.string().required()
//   //   }).required()
//   // })

//   // const result = campgroundSchema.validate(req.body)
//   // console.log(result);

//   const { error } = campgroundSchema.validate(req.body);
//   if (error) {
//     const message = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(message, 400);
//   } else {
//     next();
//   }
// };


// method to check for validation in Review Model
// const validateReview = (req, res, next) => {
//   // console.log(req.body);
//   const { error } = reviewSchema.validate(req.body);
//   if (error) {
//     const message = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(message, 400);
//   } else {
//     next();
//   }
// };

app.use(flash());
// FLASH MIDDLEWARE
app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    // console.log("HII");
    next();    
})

app.use('/campgrounds',campgrounds);
app.use('/campgrounds/:id/reviews',reviews);

app.get("/", (req, res) => {
  res.render("home");
});

// ------------------------------------------------------------------------------
// Campground PREV ROUTES METHOD>>>
// ------------------------------------------------------------------------------

// app.get("/campgrounds", catchAsync(async (req, res) => {
//   const campgrounds = await Campground.find({});
//   res.render("campgrounds/index", { campgrounds });
// }));

// // CREATING DATA..
// app.get("/campgrounds/new", (req, res) => {
//   res.render("campgrounds/new");
// });

// app.post("/campgrounds",validateCampground, catchAsync(async (req, res, next) => {
//   // try{
//     // if(!req.body.campground){
//     //   throw new ExpressError('INVALID CAMPGROUND DATA',400);
//     // }
//     // const campgroundSchema = Joi.object({
//     //   campground:Joi.object({
//     //     title:Joi.string().required(),
//     //     price:Joi.number().required().min(0),
//     //     image:Joi.string().required(),
//     //     location:Joi.string().required(),
//     //     description:Joi.string().required()
//     //   }).required()
//     // })

//     // // const result = campgroundSchema.validate(req.body)
//     // // console.log(result);

//     // const {error} = campgroundSchema.validate(req.body);
//     // if(error){
//     //   const message = error.details.map(el =>el.message).join(',');
//     //   throw new ExpressError(message,400);
//     // }

//     const newCampground = new Campground(req.body.campground);
//     await newCampground.save();
//     // res.redirect('/campgrounds');
//     res.redirect(`/campgrounds/${newCampground._id}`);
//   // }catch(e){
//     // next(e);
//   // }

// }));

// app.get("/campgrounds/:id", catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const campground = await Campground.findById(id).populate('reviews');
//   console.log(campground);
//   res.render("campgrounds/show", { campground });
// }));

// app.post('/campgrounds/:id/reviews',validateReview,async (req,res)=>{
//   const campground = await Campground.findById(req.params.id);
//   const review = new Review(req.body.review);
//   // here body.review is used as all the key are within the review[object] in the form
//   campground.reviews.push(review);
//   await review.save();
//   await campground.save();
//   res.redirect('/campgrounds/'+ campground._id);
// });

// app.delete('/campgrounds/:id/reviews/:reviewId',catchAsync(async (req,res)=>{
//   // res.send("DELETE ME");
//   const {id,reviewId} = req.params;
//   await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
//   await review.findByIdAndDelete(reviewId);

//   res.redirect(`/campgrounds/${id}`);

// }));

// // Update FOrm
// app.get("/campgrounds/:id/edit", catchAsync(async (req, res) => {
//   // console.log(req.params.id);
//   const campground = await Campground.findById(req.params.id);
//   console.log(campground);
//   res.render("campgrounds/edit", { campground });
// }));

// app.put("/campgrounds/:id",validateCampground, catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const campground = await Campground.findByIdAndUpdate(id, {
//     ...req.body.campground,
//   });
//   // res.send(req.body.campground);
//   res.redirect(`/campgrounds/${id}`);
// }));

// // Delte the data
// app.delete("/campgrounds/:id", catchAsync(async (req, res) => {
//   const { id } = req.params;
//   // console.log(id);
//   const campground = await Campground.findByIdAndDelete(id);
//   // console.log(campground);
//   res.redirect("/campgrounds");
//   // res.send(req.params.id);
// }));

// ------------------------------------------------------------------------
// ERRor on url we dont recognise
app.all("*", (req, res, next) => {
  // res.send("404!!!");
  next(new ExpressError("Page Not Found", 404));
});

// ERROR HANDLING
app.use((err, req, res, next) => {
  // console.log(err.name);
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "something went wrong";
  // res.status(statusCode).send(message);
  res.status(statusCode).render("errors", { err });
  // res.send('Something! not Right!!!');
});

app.listen(3000, () => {
  console.log("LISTENING ON PORT 3000");
});
