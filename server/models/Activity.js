const mongoose = require("mongoose")

const ActivitySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        min: 3,
        max: 20,
    },
    image:{
        type:String,
        required:true,
    },
    kcal_per_minute:{
        type:Number,
        required:true,
    },
    distance_per_minute:{
        type:Number,
        required:true,
    }
});

module.exports = mongoose.model("Activity",ActivitySchema);