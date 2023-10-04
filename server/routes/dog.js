//const Dog = require("../models/Dog");
const {
  Dog,
  ActivityDetails,
  MealDetails,
  DiseaseDetails,
  BehaviourDetails,
} = require("../models/Dog");
const Activity = require("../models/Activity");
const Meal = require("../models/Meal");
const Disease = require("../models/Disease");

const router = require("express").Router();

/////////////////////////////PODSTAWOWE-POLA_DOG////////////////////////////

//add a dog to user (create)
router.post("/", async (req, res) => {
  const newDog = new Dog(req.body);
  try {
    const savedDog = await newDog.save();
    res.status(200).json(savedDog);
  } catch (err) {
    res.status(500).json(err);
  }
});

//display dog by dog id (read)
router.get("/", async (req, res) => {
  const dogId = req.query.dogId;
  const dogName = req.query.dogName;
  try {
    const dog = dogId
      ? await Dog.findById(dogId)
      : await Dog.findOne({ name: dogName });

    //await Dog.findById(req.params.dogId);
    res.status(200).json(dog);
  } catch (err) {
    res.status(500).json(err);
  }
});

//display all dogs by user id (read)
router.get("/byUser/:userId", async (req, res) => {
  try {
    const dogArray = await Dog.find({ userId: req.params.userId });
    res.status(200).json(dogArray);
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete a dog from user (delete)
router.delete("/:id", async (req, res) => {
  try {
    const dog = await Dog.findByIdAndDelete(req.params.id);
    res.status(200).json("the dog has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete all dogs for a user
router.delete("/delete_all_dogs/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find all dogs belonging to the user
    const dogsToDelete = await Dog.find({ userId: req.params.userId });

    // Iterate through the list of dogs and delete each one
    for (const dog of dogsToDelete) {
      await Dog.findByIdAndDelete(dog._id);
    }

    res.status(200).json("All dogs for the user have been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

//modify dog properties by dog id (update)
router.put("/:id", async (req, res) => {
  try {
    const dog = await Dog.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json("dog has been updated");
  } catch (err) {
    //console.log(err);
    res.status(500).json(err);
  }
});

//set new activity status for dog by dog id
router.put("/new_status/:id", async (req, res) => {
  try {
    const dog = await Dog.findById(req.params.id);
    dog.status = req.body.status;
    await dog.save();
    res.status(200).json("changed status to:" + dog.status);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
///////////////////////////////ELEMENTY W TABLICY AKTYWNOŚCI///////////////

//add activity to dog by dog id (create)
router.post("/activity/:id", async (req, res) => {
  const newActivity = new ActivityDetails(req.body);
  try {
    const retreivedDog = await Dog.findById(req.params.id);
    retreivedDog.activities.push(newActivity);
    const savedDog = await retreivedDog.save();
    res.status(200).json(savedDog);
  } catch (err) {
    res.status(500).json(err);
  }
});

//read all activities by dog id (read)
router.get("/activity/:dogId", async (req, res) => {
  try {
    const retrieverDog = await Dog.findById(req.params.dogId);

    if (!retrieverDog) {
      return res.status(404).json({ message: "Dog not found" });
    }

    const activities = [];

    for (const activity of retrieverDog.activities) {
      const activityDetails = await Activity.findById(activity.activityId);

      if (activityDetails) {
        activities.push({
          _id: activityDetails._id,
          name: activityDetails.name,
          image: activityDetails.image,
          mins_spent: activity.mins_spent,
          kcal_per_minute: activityDetails.kcal_per_minute,
          distance_per_minute: activityDetails.distance_per_minute,
          createdAt: activity.createdAt,
          updatedAt: activity.updatedAt,
        });
      }
    }

    res.status(200).json(activities);
  } catch (err) {
    res.status(500).json(err);
  }
});

//retrieve the newest activity for a specific dog
router.get("/activity/newest/:dogId", async (req, res) => {
  try {
    const retrieverDog = await Dog.findById(req.params.dogId);

    if (!retrieverDog) {
      return res.status(404).json({ message: "Dog not found" });
    }

    if (retrieverDog.activities.length === 0) {
      return res
        .status(200)
        .json({ message: "No activities found for the dog" });
    }

    const newestActivity =
      retrieverDog.activities[retrieverDog.activities.length - 1];

    const activityDetails = await Activity.findById(newestActivity.activityId);

    if (!activityDetails) {
      return res.status(200).json({ message: "Activity details not found" });
    }

    // Create a new object with desired properties
    const responseObj = {
      _id: newestActivity._id,
      name: activityDetails.name,
      image: activityDetails.image,
      mins_spent: newestActivity.mins_spent,
      kcal_per_minute: activityDetails.kcal_per_minute,
      distance_per_minute: activityDetails.distance_per_minute,
      createdAt: newestActivity.createdAt,
      updatedAt: newestActivity.updatedAt,
    };

    res.status(200).json(responseObj);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update activity by activity id (update)
router.put("/activity/:dogId/:activityId", async (req, res) => {
  try {
    const retreivedDog = await Dog.findById(req.params.dogId);
    const retreivedSubdocument = await retreivedDog.activities.id(
      req.params.activityId
    );

    retreivedSubdocument.activityId = req.body.activityId;
    retreivedSubdocument.mins_spent = req.body.mins_spent;
    //retreivedSubdocument.save();
    retreivedDog.save(); //have to save document with subdocument changed innit

    res.status(200).json("activity element has been updated"); //retreivedSubdocument
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete activity by activity id (delete)
router.delete("/activity/:dogId/:activityId", async (req, res) => {
  try {
    const retreivedDog = await Dog.findById(req.params.dogId);

    //retreiverDog.activities.id(req.params.activityId).deleteOne();

    const retreivedSubdocument = await retreivedDog.activities.id(
      req.params.activityId
    );
    await retreivedDog.activities.pull(retreivedSubdocument);

    await retreivedDog.save();
    res.status(200).json("activity element has been deleted");
  } catch (err) {
    //console.log(err);
    res.status(500).json(err);
  }
});

//https://mongoosejs.com/docs/subdocs.html#finding-a-subdocument
///////////////////////////////////ELEMENTY W TABLICY POSIŁKÓW /////////////////////////

//add meal to dog by dog id (create)
router.post("/meal/:id", async (req, res) => {
  const newMeal = new MealDetails(req.body);
  try {
    const retreivedDog = await Dog.findById(req.params.id);
    retreivedDog.meals.push(newMeal);
    const savedDog = await retreivedDog.save();
    res.status(200).json(savedDog);
  } catch (err) {
    res.status(500).json(err);
  }
});

//read all meals by dog id (read)
router.get("/meal/:dogId", async (req, res) => {
  try {
    const retrieverDog = await Dog.findById(req.params.dogId);

    if (!retrieverDog) {
      return res.status(404).json({ message: "Dog not found" });
    }

    const meals = [];

    for (const meal of retrieverDog.meals) {
      const mealDetails = await Meal.findById(meal.mealId);

      if (mealDetails) {
        meals.push({
          _id: mealDetails._id,
          name: mealDetails.name,
          description: mealDetails.description,
          water_percentage: mealDetails.water_percentage,
          carbohydrates_percentage: mealDetails.carbohydrates_percentage,
          protein_percentage: mealDetails.protein_percentage,
          fat_percentage: mealDetails.fat_percentage,
          vitamins: mealDetails.vitamins,
          createdAt: meal.createdAt,
          updatedAt: meal.updatedAt,
        });
      }
    }

    res.status(200).json(meals);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update meal by meal id (update) -- no update because there is no field to update in child
router.put("/meal/:dogId/:mealId", async (req, res) => {
  try {
    const retrievedDog = await Dog.findById(req.params.dogId);
    const retrievedSubdocument = await retrievedDog.meals.id(req.params.mealId);

    if (!retrievedSubdocument) {
      return res.status(404).json({ message: "Meal not found" });
    }

    // Update the meal details
    retrievedSubdocument.mealId = req.body.mealId;

    retrievedDog.save(); // Save the changes to the main document

    res.status(200).json("Meal element has been updated");
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete meal by meal id (delete)
router.delete("/meal/:dogId/:mealId", async (req, res) => {
  try {
    const retreivedDog = await Dog.findById(req.params.dogId);
    const retreivedSubdocument = await retreivedDog.meals.id(req.params.mealId);
    await retreivedDog.meals.pull(retreivedSubdocument);
    await retreivedDog.save();
    res.status(200).json("meal element has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

////////////////////////////////////////////ELEMENTY W TABLICY CHORÓB ////////////

//add disease to dog by dog id (create)
router.post("/disease/:id", async (req, res) => {
  const newDisease = new DiseaseDetails(req.body);
  try {
    const retreivedDog = await Dog.findById(req.params.id);
    retreivedDog.diseases.push(newDisease);
    const savedDog = await retreivedDog.save();
    res.status(200).json(savedDog);
  } catch (err) {
    res.status(500).json(err);
  }
});

//read all diseases by dog id (read)
router.get("/disease/:dogId", async (req, res) => {
  try {
    const retrieverDog = await Dog.findById(req.params.dogId);

    if (!retrieverDog) {
      return res.status(404).json({ message: "Dog not found" });
    }

    const diseaseDetails = [];

    for (const diseaseDetail of retrieverDog.diseases) {
      const disease = await Disease.findById(diseaseDetail.diseaseId);

      if (disease) {
        diseaseDetails.push({
          _id: disease._id,
          name: disease.name,
          description: disease.description,
          symptoms: disease.symptoms,
          day_count: diseaseDetail.day_count,
          createdAt: diseaseDetail.createdAt,
          updatedAt: diseaseDetail.updatedAt,
        });
      }
    }

    res.status(200).json(diseaseDetails);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update disease by disease id (update)
router.put("/disease/:dogId/:diseaseId", async (req, res) => {
  try {
    const retreivedDog = await Dog.findById(req.params.dogId);
    const retreivedSubdocument = await retreivedDog.diseases.id(
      req.params.diseaseId
    );

    retreivedSubdocument.diseaseId = req.body.diseaseId;
    retreivedSubdocument.day_count = req.body.day_count;

    //retreivedSubdocument.save();
    retreivedDog.save(); //have to save document with subdocument changed innit

    res.status(200).json("disease element has been updated"); //retreivedSubdocument
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete disease by disease id (delete)
router.delete("/disease/:dogId/:diseaseId", async (req, res) => {
  try {
    const retreivedDog = await Dog.findById(req.params.dogId);
    const retreivedSubdocument = await retreivedDog.diseases.id(
      req.params.diseaseId
    );
    await retreivedDog.diseases.pull(retreivedSubdocument);
    await retreivedDog.save();
    res.status(200).json("disease element has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

///////////////////////////////////////ELEMENTY W TABLICY ZACHOWAŃ //////

//add behaviour to dog by dog id (create)
router.post("/behaviour/:id", async (req, res) => {
  const newBehaviour = new BehaviourDetails(req.body);
  try {
    const retreivedDog = await Dog.findById(req.params.id);
    retreivedDog.behaviours.push(newBehaviour);
    const savedDog = await retreivedDog.save();
    res.status(200).json(savedDog);
  } catch (err) {
    res.status(500).json(err);
  }
});

//read all behaviours by dog id (read)
router.get("/behaviour/:dogId", async (req, res) => {
  try {
    const retreivedDog = await Dog.findById(req.params.dogId);
    res.status(200).json(retreivedDog.behaviours);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update behaviour by behaviour id (update)
router.put("/behaviour/:dogId/:behaviourId", async (req, res) => {
  try {
    const retreivedDog = await Dog.findById(req.params.dogId);
    const retreivedSubdocument = await retreivedDog.behaviours.id(
      req.params.behaviourId
    );
    retreivedSubdocument.name = req.body.name;
    retreivedSubdocument.description = req.body.description;
    retreivedDog.save();
    res.status(200).json("behaviour element has been updated");
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete behaviour by behaviour id (delete)
router.delete("/behaviour/:dogId/:behaviourId", async (req, res) => {
  try {
    const retreivedDog = await Dog.findById(req.params.dogId);
    const retreivedSubdocument = await retreivedDog.behaviours.id(
      req.params.behaviourId
    );
    await retreivedDog.behaviours.pull(retreivedSubdocument);
    retreivedDog.save();
    res.status(200).json("behaviour element has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
