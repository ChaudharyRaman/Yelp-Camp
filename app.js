const express = require("express");
const app = express();
const methodOverride = require("method-override");
const ejs_mate = require('ejs-mate');

const path = require("path");

const mongoose = require("mongoose");

// MODEL REF
const Campground = require("./models/campground");

// CONECTION WITH MONGOOSE
mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});

app.engine('ejs',ejs_mate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});
// CREATING DATA..
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.post("/campgrounds", async (req, res) => {
  // res.send(req.body);
  const newCampground = new Campground(req.body.campground);
  await newCampground.save();
  res.redirect(`/campgrounds/${newCampground._id}`);
});

app.get("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/show", { campground });
});

// Update FOrm
app.get("/campgrounds/:id/edit", async (req, res) => {
  const campground = await Campground.findById(req.params.id);

  res.render("campgrounds/edit", { campground });
});
app.put("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  // res.send(req.body.campground);
  res.redirect(`/campgrounds/${id}`);
});
// Delte the data
app.delete("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const campground = await Campground.findByIdAndDelete(id);
  console.log(campground);
  res.redirect("/campgrounds");
  // res.send(req.params.id);
});

app.listen(3000, () => {
  console.log("LISTENING ON PORT 3000");
});
