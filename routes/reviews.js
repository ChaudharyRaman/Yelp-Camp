const express = require('express');
const router = express.Router({mergeParams:true});

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const Campground = require("../models/campground");
const Review = require("../models/review");
const review = require("../models/review");

const { reviewSchema } = require("../schemas.js");


const validateReview = (req, res, next) => {
    // console.log(req.body);
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      const message = error.details.map((el) => el.message).join(",");
      throw new ExpressError(message, 400);
    } else {
      next();
    }
  };

router.post('/',validateReview,catchAsync(async (req,res)=>{
    console.log(req.params.id);
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    // here body.review is used as all the key are within the review[object] in the form
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Successfully added a new review');
    res.redirect('/campgrounds/'+ campground._id);
  }));

router.delete('/:reviewId',catchAsync(async (req,res)=>{
    // res.send("DELETE ME");
    const {id,reviewId} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await review.findByIdAndDelete(reviewId);
  
    req.flash('success','Successfully deleted a review');
    res.redirect(`/campgrounds/${id}`);

  }));


  module.exports = router;