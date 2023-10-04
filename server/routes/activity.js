const Activity = require("../models/Activity");
const router = require("express").Router();

//for admin template activities manipulation (CRUD)

//create new activity
router.post("/",async (req,res)=>{
    const newActivity = new Activity(req.body);
    try{
        const savedActivity = await newActivity.save();
        res.status(200).json(savedActivity);
    }catch(err){
        res.status(500).json(err);
    }
});

//get one activity by activity id
router.get("/:id", async (req,res)=>{
    try{
        const activity = await Activity.findById(req.params.id);
        res.status(200).json(activity);
    }catch(err){
        res.status(500).json(err)
    }
});

//get all activities as array
router.get("/all/activities",async (req,res)=>{
    try{
        const allActivity = await Activity.find();
        res.status(200).json(allActivity);
    }catch(err){
        res.status(500).json(err);
    }
});

//update activity by id
router.put("/:id",async (req,res)=>{
    try{
        const activity = await Activity.findById(req.params.id);
        await activity.updateOne({$set:req.body});
        res.status(200).json("activity has been updated");
    }catch(err){
        res.status(500).json(err);
    }
});

//delete activity by id
router.delete("/:id",async (req,res)=>{
    try{
        const activity = await Activity.findByIdAndDelete(req.params.id);
        res.status(200).json("the activity has been deleted");
    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router