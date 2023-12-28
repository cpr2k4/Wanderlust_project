const express = require('express');
const router = express.Router({mergeParams:true});
const {validateReview, isLoggedIn,isReviewOwner} = require("../middleware");
const ReviewController = require("../Controller/reviews");

//post review route
router.post("/",isLoggedIn,validateReview,ReviewController.postReview);

//delete review:
router.delete("/:reviewId",isLoggedIn,isReviewOwner,ReviewController.deleteReview);

module.exports = router;