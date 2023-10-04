const {Breed, Advantage, Disadvantage, ImageStatus} = require("../models/Breed");
const router = require("express").Router();


//for admin template breed manipulation (CRUD)


/////////////////////// BASIC FIELDS BREED MANIPULATION  ///////////////////////
//add new breed (create)
router.post("/",async (req,res)=>{
    const newBreed = new Breed(req.body);
    try{
        const savedBreed = await newBreed.save();
        res.status(200).json(savedBreed);
    }catch(err){
        res.status(500).json(err);
    }
});

//read breed by breed id (read)
router.get("/:breedId",async (req,res)=>{
    try{
        const breed = await Breed.findById(req.params.breedId);
        res.status(200).json(breed);
    }catch(err){
        res.status(500).json(err);
    }
});

//read all breeds (read)
router.get("/all/breeds",async (req,res)=>{
    try{
        const breed = await Breed.find()
        res.status(200).json(breed);
    }catch (err){
        res.status(500).json(err);
    }
});

//update breed by breed id (update)
router.put("/:breedId",async (req,res)=>{
    try{
        const breed = await Breed.findByIdAndUpdate(req.params.breedId,req.body);       
        res.status(200).json("breed has been updated");
    }catch(err){
        //console.log(err);
        res.status(500).json(err);
    }
});


//delete breed by breed id (delete)
router.delete("/:breedId",async (req,res)=>{
    try{
        const breed = await Breed.findByIdAndDelete(req.params.breedId);
        res.status(200).json("the breed has been deleted");
    }catch(err){
        res.status(500).json(err);
    }
});


/////////////////////// SUBDOCUMENT -- BREED ADVANTAGE MANIPULATION  ///////////
//add new advantage to the breed by breed_id (create)
router.post("/advantage/:breedId", async (req,res)=>{
    const newAdvantage = new Advantage(req.body);
    try{   
        const retreivedBreed = await Breed.findById(req.params.breedId);
        retreivedBreed.breed_advantage.push(newAdvantage);
        const savedBreed = await retreivedBreed.save();
        res.status(200).json(savedBreed);
    }catch(err){
        res.status(500).json(err);
    }
});


//read all advantages of the breed by breed_id (read)
router.get("/advantage/:breedId", async (req,res)=>{
    try{
        const retreivedBreed = await Breed.findById(req.params.breedId);
        res.status(200).json(retreivedBreed.breed_advantage);
    }catch(err){
        res.status(500).json(err);
    }
});

//update advantage by advantage_id and breed_id (update)
router.put("/advantage/:breedId/:advantageId", async (req,res)=>{
    try{
        const retreivedBreed = await Breed.findById(req.params.breedId);
        const retreivedSubdocument = await retreivedBreed.breed_advantage.id(req.params.advantageId);
        retreivedSubdocument.name = req.body.name;
        retreivedSubdocument.description = req.body.description;
        retreivedBreed.save();
        res.status(200).json("advantage element has been updated");
    }catch(err){
        res.status(500).json(err);
    }
});


//delete advantage by advantage_id and breed_id (delete)
router.delete("/advantage/:breedId/:advantageId",async (req,res)=>{
    try{
        const retreivedBreed = await Breed.findById(req.params.breedId);
        const retreivedSubdocument = await retreivedBreed.breed_advantage.id(req.params.advantageId);
        await retreivedBreed.breed_advantage.pull(retreivedSubdocument);
        await retreivedBreed.save();
        res.status(200).json("advantage element has been deleted");
    }catch(err){
        //console.log(err);
        res.status(500).json(err);
    }
});



/////////////////////// SUBDOCUMENT -- BREED DISADVANTAGE MANIPULATION   ///////
//add new disadvantage to the breed by breed id (create)
router.post("/disadvantage/:breedId", async (req,res)=>{
    const newDisadvantage = new Disadvantage(req.body);
    try{   
        const retreivedBreed = await Breed.findById(req.params.breedId);
        retreivedBreed.breed_disadvantage.push(newDisadvantage);
        const savedBreed = await retreivedBreed.save();
        res.status(200).json(savedBreed);
    }catch(err){
        res.status(500).json(err);
    }
});

//read all disadvantages of the breed by breed_id (read)
router.get("/disadvantage/:breedId", async (req,res)=>{
    try{
        const retreivedBreed = await Breed.findById(req.params.breedId);
        res.status(200).json(retreivedBreed.breed_disadvantage);
    }catch(err){
        res.status(500).json(err);
    }
});


//update disadvantage by disadvantage_id and breed_id (update)
router.put("/disadvantage/:breedId/:disadvantageId", async (req,res)=>{
    try{
        const retreivedBreed = await Breed.findById(req.params.breedId);
        const retreivedSubdocument = await retreivedBreed.breed_disadvantage.id(req.params.disadvantageId);
        retreivedSubdocument.name = req.body.name;
        retreivedSubdocument.description = req.body.description;
        retreivedBreed.save();
        res.status(200).json("disadvantage element has been updated");
    }catch(err){
        res.status(500).json(err);
    }
});


//delete disadvantage by disadvantage_id and breed_id (delete)
router.delete("/disadvantage/:breedId/:disadvantageId",async (req,res)=>{
    try{
        const retreivedBreed = await Breed.findById(req.params.breedId);
        const retreivedSubdocument = await retreivedBreed.breed_disadvantage.id(req.params.disadvantageId);
        await retreivedBreed.breed_disadvantage.pull(retreivedSubdocument);
        await retreivedBreed.save();
        res.status(200).json("disadvantage element has been deleted");
    }catch(err){
        //console.log(err);
        res.status(500).json(err);
    }
});


/////////////////////// SUBDOCUMENT -- IMAGE STATUS MANIPULATION    ////////////
//add new image to the breed by breed_id (create)
router.post("/image_status/:breedId", async (req,res)=>{
    const newStatus = new ImageStatus(req.body);
    try{   
        const retreivedBreed = await Breed.findById(req.params.breedId);
        retreivedBreed.image_status.push(newStatus);
        const savedBreed = await retreivedBreed.save();
        res.status(200).json(savedBreed);
    }catch(err){
        res.status(500).json(err);
    }
});

//read all images of the breed breed_id (read)
router.get("/image_status/:breedId", async (req,res)=>{
    try{
        const retreivedBreed = await Breed.findById(req.params.breedId);
        res.status(200).json(retreivedBreed.image_status);
    }catch(err){
        res.status(500).json(err);
    }
});


//update image by image_id and breed_id(update)
router.put("/image_status/:breedId/:imageStatusId", async (req,res)=>{
    try{
        const retreivedBreed = await Breed.findById(req.params.breedId);
        const retreivedSubdocument = await retreivedBreed.image_status.id(req.params.imageStatusId);
        retreivedSubdocument.name = req.body.name;
        retreivedSubdocument.resource = req.body.resource;
        retreivedBreed.save();
        res.status(200).json("image resource element has been updated");
    }catch(err){
        res.status(500).json(err);
    }
});

//delete image by image_id and breed_id (delete)
router.delete("/image_status/:breedId/:imageStatusId",async (req,res)=>{
    try{
        const retreivedBreed = await Breed.findById(req.params.breedId);
        const retreivedSubdocument = await retreivedBreed.image_status.id(req.params.imageStatusId);
        await retreivedBreed.image_status.pull(retreivedSubdocument);
        await retreivedBreed.save();
        res.status(200).json("image resource element has been deleted");
    }catch(err){
        //console.log(err);
        res.status(500).json(err);
    }
});



module.exports = router