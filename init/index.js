const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

let MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main()
.then(()=>{
    console.log("Connection has been established with mongodb....");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

//Deleting old data and Inserting new Data
async function dataInit(){
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:"658582f4b0f1a1af89e07d27"}));
    await Listing.insertMany(initData.data);
    console.log("Inserted new data...");
}

dataInit();