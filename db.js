
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");


dotenv.config();

const connect=()=>{
    try {

       mongoose.connect(process.env.MONGO_URL).then(()=>
        console.log("db is connect successfully")
       ) 
    } catch (error) {
        console.log("MongoDB connection failed",err)
    }
}

module.exports={connect}