const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
//for all listings
module.exports.index = wrapAsync(async(req,res)=>{
    let lists = await Listing.find({});
    res.render("listings/index.ejs",{lists});
});

//new list
module.exports.getNewList = (req,res)=>{
    res.render("listings/new.ejs");
}

//create a listing
module.exports.createListing = wrapAsync(async(req,res)=>{
    let url = req.file.path;
    let filename = req.file.filename;

    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success","New Listing created...");
    res.redirect("/listings");
});

//show info of each list
module.exports.showInfoOfList = wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let list = await Listing.findById(id)
    .populate({                     //nested populate
        path:"reviews",
        populate:{
            path:"author"
        }
    })
    .populate("owner");
    if(!list){
        req.flash("error","Listing not found!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{list});
});

//update lisiting route
module.exports.updateListing = wrapAsync(async(req,res)=>{
    let {id} = req.params;

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        let listingBody = {...req.body.listing};
        listingBody.image= {url,filename};
        await Listing.findByIdAndUpdate(id,{...listingBody},{new:true});
    }else{
        await Listing.findByIdAndUpdate(id,{...req.body.listing},{new:true});
    }
    res.redirect(`/listings/${id}`);
});

//get edit lisiting route 
module.exports.getEditForListing = wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let list = await Listing.findById(id).populate("owner");
    if(!list){
        req.flash("error","Listing not found!");
        return;
    }
    let originalUrl = list.image.url;
    let compressedUrl = originalUrl.replace('upload','upload/q_40');
    res.render("listings/edit.ejs",{list,compressedUrl});
});

//Delete lisiting route
module.exports.deleteListing = wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted.....");
    res.redirect("/listings");
});