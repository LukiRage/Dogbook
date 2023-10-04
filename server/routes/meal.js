const Meal = require("../models/Meal");
const router = require("express").Router();


//for admin template meals manipulation (CRUD)

//create new meal
router.post("/", async (req,res)=>{
    const newMeal = new Meal(req.body);
    try{
        const savedMeal = await newMeal.save();
        res.status(200).json(savedMeal);
    } catch(err){
        res.status(500).json(err);
    }
});


//get one meal by meal id
router.get("/:id", async (req,res)=>{
    try{
        const meal = await Meal.findById(req.params.id);
        res.status(200).json(meal);
    }catch(err){
        res.status(500).json(err)
    }
});


//get all meals as array
router.get("/all/meals",async (req,res)=>{
    try{
        const allMeal = await Meal.find();
        res.status(200).json(allMeal);
    }catch(err){
        res.status(500).json(err);
    }
});


//update meal by id
router.put("/:id",async (req,res)=>{
    try{
        const meal = await Meal.findById(req.params.id);
        await meal.updateOne({$set:req.body});
        res.status(200).json("meal has been updated");
    }catch(err){
        res.status(500).json(err);
    }
});


//delete meal by id
router.delete("/:id",async (req,res)=>{
    try{
        const meal = await Meal.findByIdAndDelete(req.params.id);
        res.status(200).json("the meal has been deleted");
    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router