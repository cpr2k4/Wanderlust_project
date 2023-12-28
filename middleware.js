const Listing = require("./models/listing");
const Review = require("./models/reviews");
const ExpressError = require('./utils/ExpressError.js');
const {listingSchema} = require('./schema.js');
const {reviewSchema} = require('./schema.js');

//validation of joi
module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg.toString());
    }
    else{
        next();
    }
}

//validate middleware for joi
module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg.toString());
    }
    else{
        next();
    }
}

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","Please login into your account...");
        return res.redirect("/login");
    }
    next();
}

module.exports.savedRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    const {id} = req.params;
    let list =  await Listing.findById(id);
    if(!list.owner._id.equals(res.locals.user._id)){
        req.flash("error","You are not the owner!");
        return res.redirect(`/listings/${id}`);
    } 
    next();
}

module.exports.isReviewOwner = async(req,res,next)=>{
    const {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.user._id)){
        req.flash("error","You have not created this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}