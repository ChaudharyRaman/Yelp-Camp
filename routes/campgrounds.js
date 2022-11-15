const express = require('express');
const router = express.Router({mergeParams:true});


const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const Campground = require("../models/campground");

const { campgroundSchema } = require("../schemas.js");

const validateCampground = (req, res, next) => {
    // const campgroundSchema = Joi.object({
    //   campground:Joi.object({
    //     title:Joi.string().required(),
    //     price:Joi.number().required().min(0),
    //     image:Joi.string().required(),
    //     location:Joi.string().required(),
    //     description:Joi.string().required()
    //   }).required()
    // })
  
    // const result = campgroundSchema.validate(req.body)
    // console.log(result);
  
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
      const message = error.details.map((el) => el.message).join(",");
      throw new ExpressError(message, 400);
    } else {
      next();
    }
  };


  router.get("/", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  }));
  
  // CREATING DATA..
  router.get("/new", (req, res) => {
    res.render("campgrounds/new");
  });
  
  router.post("/",validateCampground, catchAsync(async (req, res, next) => {
    // try{
      // if(!req.body.campground){
      //   throw new ExpressError('INVALID CAMPGROUND DATA',400);
      // }
      // const campgroundSchema = Joi.object({
      //   campground:Joi.object({
      //     title:Joi.string().required(),
      //     price:Joi.number().required().min(0),
      //     image:Joi.string().required(),
      //     location:Joi.string().required(),
      //     description:Joi.string().required()
      //   }).required()
      // })
  
      // // const result = campgroundSchema.validate(req.body)
      // // console.log(result);
  
      // const {error} = campgroundSchema.validate(req.body);
      // if(error){
      //   const message = error.details.map(el =>el.message).join(',');
      //   throw new ExpressError(message,400);
      // }
  
      const newCampground = new Campground(req.body.campground);
      await newCampground.save();
      // res.redirect('/campgrounds');
      req.flash('success','Successfully made a new campGround');
      res.redirect(`/campgrounds/${newCampground._id}`);
    // }catch(e){
      // next(e);
    // }
    
  }));
  
  router.get("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    // console.log(campground);

    if(!campground){
      req.flash('error','Cannot find that campground');
      return res.redirect('/campgrounds');
    }
    res.render("campgrounds/show", { campground });
  }));
  
//   router.post('/:id/reviews',validateReview,async (req,res)=>{
//     const campground = await Campground.findById(req.params.id);
//     const review = new Review(req.body.review);
//     // here body.review is used as all the key are within the review[object] in the form
//     campground.reviews.push(review);
//     await review.save();
//     await campground.save();
//     res.redirect('/campgrounds/'+ campground._id);
//   });
  
//   router.delete('/:id/reviews/:reviewId',catchAsync(async (req,res)=>{
//     // res.send("DELETE ME");
//     const {id,reviewId} = req.params;
//     await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
//     await review.findByIdAndDelete(reviewId);
  
//     res.redirect(`/campgrounds/${id}`);
  
//   }));
  
  // Update FOrm
  router.get("/:id/edit", catchAsync(async (req, res) => {
    // console.log(req.params.id);
    const campground = await Campground.findById(req.params.id);
    // console.log(campground);
    res.render("campgrounds/edit", { campground });
  }));
  
  
  router.put("/:id",validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    // res.send(req.body.campground);
    res.redirect(`/campgrounds/${id}`);
  }));
  
  
  // Delte the data
  router.delete("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    // console.log(id);
    const campground = await Campground.findByIdAndDelete(id);
    // console.log(campground);
    res.redirect("/campgrounds");
    // res.send(req.params.id);
  }));

  module.exports = router;
