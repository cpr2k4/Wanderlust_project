const express = require('express');
const router = express.Router();
const passport = require('passport');
const {savedRedirectUrl} = require("../middleware.js");
const UserController = require('../Controller/users.js');
const ListingController = require('../Controller/listing.js');

//root page or home page
router.route("/")
    .get(ListingController.index);
    
//signup get and post
router.route("/signup")
    .get(UserController.getSignupPage)    
    .post(UserController.postSignupPage);


//login get and post
router.route("/login")
    .get(UserController.getLoginPage)
    .post(
        savedRedirectUrl,
        passport.authenticate("local",{
            failureRedirect : "/login",
            failureFlash : true
        }),
        UserController.postLoginPage
    );


//logout
router.get("/logout",UserController.Logout);


module.exports = router;