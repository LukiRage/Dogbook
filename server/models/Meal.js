const mongoose = require("mongoose")

const MealSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        min: 3,
        max: 20,
    },
    description:{
        type:String,
        required: true,
        max:500,
    },
    water_percentage:{
        type:Number,
        required:true,
    },
    carbohydrates_percentage:{
        type:Number,
        required:true,
    },
    protein_percentage:{
        type:Number,
        required:true,
    },
    fat_percentage:{
        type:Number,
        required:true,
    },
    vitamins:{//https://stackoverflow.com/questions/35509611/mongoose-save-array-of-strings
        type:[String],
        required:true,
    },
    buy_link:{
        type:String,
        max:100,
    },
});

module.exports = mongoose.model("Meal",MealSchema);