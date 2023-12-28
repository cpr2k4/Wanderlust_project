if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require ('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const session = require("express-session");
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const MongoStore = require('connect-mongo');


//routers require
const listingsRouter = require('./routes/listing.js');
const reviewsRouter = require('./routes/reviews.js');
const usersRouter = require('./routes/user.js');


let port = 8080;

// let MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
const dbUrl = process.env.ATLASDB_URL;

const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto:{
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600 // time period in seconds
});
store.on("error",()=>{
    console.log(error);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true
    }
};
//application level configurations
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

//middlewares
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));
app.use(methodOverride("_method"));

//ejs mate engine
app.engine("ejs",ejsMate);


//session and flash
app.use(session(sessionOptions));
app.use(flash());

//passport(place this after //session)
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//custom middleware for locals and flash(place this middleware before //routes)
app.use((req,res,next)=>{
    res.locals.successMsg = req.flash('success');
    res.locals.errorMsg = req.flash('error');
    res.locals.warningMsg = req.flash('warning');
    res.locals.user= req.user;  
    next();
})

//fake user signup for testing...
// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User({
//         username:"delta-student",
//         email:"deltastudent@gmail.com"
//     });
//     let newUser = await User.register(fakeUser,"helloworld");
//     res.send(newUser);
// })

//routes
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",usersRouter);



main()
.then((res)=>{
    console.log("Connection has been established with mongodb...");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}



app.listen(port,()=>{
    console.log("server listening at port ",port);
})


//if user tries to go on any weird route other than our app routes
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
})

//error handling middleware(custom)
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong!"} = err;
    res.status(statusCode).render("listings/error.ejs",{err});
})




//Testing

// app.get('/testListing',async(req,res)=>{
//     const list1 = new Listing({
//         title:"My New Villa",
//         description:"By the beach",
//         price:3000,
//         location:"Calungate,Goa",
//         Country:"India"
//     });

//     await list1.save();
//     res.send("Saved...");
// })