const mongoose = require("mongoose")

const DiseaseSchema = new mongoose.Schema({
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
    symptoms:{//https://stackoverflow.com/questions/35509611/mongoose-save-array-of-strings
        type:[String],
        required:true,
    },
});

module.exports = mongoose.model("Disease",DiseaseSchema);