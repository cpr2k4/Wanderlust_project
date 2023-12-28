const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");

//signup get and post
module.exports.getSignupPage = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.postSignupPage = wrapAsync(async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        let newUser = new User({
            username:username,
            email:email
        })  
        let registeredUser = await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust!");
            res.redirect("/listings");
        })
    }
    catch(e){
        req.flash("error","User already exists!");
        res.redirect("/signup");
    }
});


//login get and post
module.exports.getLoginPage  = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.postLoginPage = async (req,res)=>{
    req.flash("success","Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};


//logout
module.exports.Logout = (req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("warning","You are logged out...");
        res.redirect("/listings");
    });
}