const Disease = require("../models/Disease");
const router = require("express").Router();

//for admin template diseases manipulation (CRUD)

//create new disease
router.post("/",async(req,res)=>{
    const newDisease = new Disease(req.body);
    try{
        const savedDisease = await newDisease.save();
        res.status(200).json(savedDisease);
    }catch(err){
        res.status(500).json(err);
    }
});

//get one disease by disease id
router.get("/:id", async (req,res)=>{
    try{
        const disease = await Disease.findById(req.params.id);
        res.status(200).json(disease);
    }catch(err){
        res.status(500).json(err)
    }
});


//get all diseases as array
router.get("/all/diseases",async (req,res)=>{
    try{
        const allDisease = await Disease.find();
        res.status(200).json(allDisease);
    }catch(err){
        res.status(500).json(err);
    }
});


//update disease by id
router.put("/:id",async (req,res)=>{
    try{
        const disease = await Disease.findById(req.params.id);
        await disease.updateOne({$set:req.body});
        res.status(200).json("disease has been updated");
    }catch(err){
        res.status(500).json(err);
    }
});

//delete disease by id
router.delete("/:id",async (req,res)=>{
    try{
        const disease = await Disease.findByIdAndDelete(req.params.id);
        res.status(200).json("the disease has been deleted");
    }catch(err){
        res.status(500).json(err);
    }
});


module.exports = router