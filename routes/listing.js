const express = require('express');
const router = express.Router({mergeParams:true});
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const {isLoggedIn,isOwner,validateListing,validateReview} = require('../middleware.js');
const ListingController = require("../Controller/listing.js");
const multer  = require('multer')
const {storage} = require('../cloudConfig.js');
const upload = multer({ storage });


//route for all listings and //create a listing
router
    .route("/")
    .get(ListingController.index)
    .post(
        isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        ListingController.createListing
    );
    

//new list
router.get("/new",
    isLoggedIn,
    ListingController.getNewList
    );



//show info of each list 
//update listing route 
//Delete listing route
router.route("/:id")
    .get(ListingController.showInfoOfList)
    .put(
        isLoggedIn,
        isOwner,
        upload.single('listing[image]'),
        validateListing,
        ListingController.updateListing)
    .delete(
        isLoggedIn,
        isOwner,
        ListingController.deleteListing
        );


//get edit lisiting route 
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    ListingController.getEditForListing);



module.exports = router;