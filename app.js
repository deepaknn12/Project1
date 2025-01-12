const express = require("express");
const engine = require('ejs-mate');
const App = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const Review = require("./models/review.js");

// Database Connection
main()
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb+srv://kumardeepu841231:7jYYqkJok4xCgQeW@cluster0.sr6pm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
}

// Middleware
App.set('view engine', 'ejs');
App.set('views', path.join(__dirname, 'views'));
App.use(express.urlencoded({ extended: true }));
App.use(methodOverride("_method"));
App.engine('ejs', engine);
App.use(express.static(path.join(__dirname, '/public')));

// Index Route
App.get("/listings", async (req, res) => {
    const AllListings = await Listing.find({});
    res.render("listings/index.ejs", { AllListings });
});

// New Route
App.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

// Show Route 
App.get("/listings/:id", async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate('reviews'); // Populate reviews
    res.render("listings/show.ejs", { listing });
});

// Create Route
App.post("/listings", async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

// Edit Route
App.get("/listings/:id/edit", async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        return res.status(404).send("Listing not found");
    }
    res.render("listings/edit.ejs", { listing });
});

// Update Route
App.put("/listings/:id", async (req, res) => {
    const { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, {
        new: true,
        runValidators: true,
    });
    res.redirect(`/listings/${updatedListing._id}`);
});

// Delete Route
App.delete("/listings/:id", async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

// POST Route for Reviews
App.post("/listings/:id/reviews", async (req, res) => {
    const listing = await Listing.findById(req.params.id);

    if (!req.body.review.comment.trim()) {
        return res.redirect(`/listings/${listing._id}`); // Prevent empty comments
    }

    const newReview = new Review({
        comment: req.body.review.comment,
        rating: req.body.review.rating
    });

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
});

// DELETE Route for Reviews
App.delete("/listings/:id/reviews/:reviewId", async (req, res) => {
    const { id, reviewId } = req.params;

    // Find the listing and pull the review
    await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId } // Remove review reference
    });

    await Review.findByIdAndDelete(reviewId); // Delete review from database

    res.redirect(`/listings/${id}`);
});

// Server
App.listen(8080, () => {
    console.log("Server is running on port 8080");
});
