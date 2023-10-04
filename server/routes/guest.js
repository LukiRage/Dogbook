const Guest = require("../models/Guest");
const User = require("../models/User");
const { Dog } = require("../models/Dog");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

// create a user for specified dog
/*
    {
    "userId":""
    "username":"nowy_gosc",
    "email":"nowy_gosc@mail.com",
    "password":"nowy_gosc"
    }
*/
router.post("/:dogId", async (req, res) => {
  try {
    const dog_check = await Dog.findById(req.params.dogId);
    if (req.body.userId == dog_check.userId) {
      //stworzyć użytkownika
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      const newGuest = new Guest({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });

      //zapisać użytkownika do bazy danych
      const guest = await newGuest.save();

      //dodać id użytkownika do pola w kolekcji psa
      const dog = await Dog.findByIdAndUpdate(req.params.dogId, {
        guestId: guest._id,
      });

      const dog_with_guest = await Dog.findById(req.params.dogId);
      res.status(200).json(dog_with_guest);
    } else {
      res
        .status(403)
        .json("You can only create guest account for your own dog");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// delete guest (by guest_id from specified dog)
/*
    {
        "userId":"",
        "dogId":""
    }
*/
router.delete("/:guestId", async (req, res) => {
  try {
    const dog = await Dog.findById(req.body.dogId);
    if (req.body.userId == dog.userId) {
      //usunąć dokument gościa z kolekcji "guest"
      const guest = await Guest.findByIdAndDelete(req.params.guestId);

      //wyczyścić pole guestId z kolekcji Dog (pustym string)
      const dog = await Dog.findByIdAndUpdate(req.body.dogId, { guestId: "" });

      const dogUpdated = await Dog.findById(req.body.dogId);
      res.status(200).json(dogUpdated);
    } else {
      res
        .status(403)
        .json("You can only delete guest account for your own dog");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
// Delete all guests associated with dogs owned by a user
router.delete("/delete_all_guests/:user_id", async (req, res) => {
  try {
    const userId = req.params.user_id;

    // Find all dogs owned by the user
    const dogs = await Dog.find({ userId });
    // Find the user by their ID
    const user = await User.findById(userId);

    if (!dogs.length) {
      return res.status(404).json({ error: "No dogs found for this user" });
    }

    // Collect all guest IDs associated with the user's dogs
    const guestIdsToDelete = dogs.reduce((ids, dog) => {
      if (dog.guestId) {
        ids.push(dog.guestId);
      }
      return ids;
    }, []);

    if (!user.guestArr.length) {
      return res.status(200).json({ error: "No guest specofoed in user" });
    }

    // Delete all guests with the collected guest IDs
    await Guest.deleteMany({ _id: { $in: guestIdsToDelete } });

    // Clear the guestId field from all user's dogs
    await Dog.updateMany({ userId }, { $unset: { guestId: 1 } });

    // Clear the guestArr in the user document
    user.guestArr = [];

    // Save the updated user document
    await user.save();

    res
      .status(200)
      .json("All guests associated with user's dogs have been deleted");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" }); // Handle the error gracefully
  }
});

// Delete a guest from both User and Dog collections
router.delete("/delete_guest/:user_id/:guest_id", async (req, res) => {
  try {
    const userId = req.params.user_id;
    const guestId = req.params.guest_id;

    // Find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the guest ID exists in the user's guestArr
    if (!user.guestArr.includes(guestId)) {
      return res.status(404).json({ error: "Guest not found for this user" });
    }

    // Find the guest by their ID
    const guest = await Guest.findById(guestId);

    if (!guest) {
      return res.status(404).json({ error: "Guest not found" });
    }

    // Delete the guest from the User collection
    user.guestArr = user.guestArr.filter(
      (id) => id.toString() !== guestId.toString()
    );

    // Delete the guest from the Dog collection if associated with any dog
    await Dog.updateMany({ guestId: guestId }, { $unset: { guestId: 1 } });

    // Save the updated user document
    await user.save();

    // Delete the guest document
    await Guest.findByIdAndDelete(guestId);

    res
      .status(200)
      .json("Guest has been deleted from both User and Dog collections");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" }); // Handle the error gracefully
  }
});

// update guest
/*
    {
        "username":"",
        "email":"",
        "password":""
    }
*/
router.put("/:guestId", async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.guestId);

    guest.username = req.body.username;
    guest.email = req.body.email;
    //zaszyfrowanie hasła podczas zmiany hasła
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    guest.password = hashedPassword;
    //ustawienie zmiany hasła przez gościa (użytkownik nie może widzieć hasła po zmianie przez gościa)
    guest.isUpdated = true;

    await guest.save();

    const guest_updated = await Guest.findById(req.params.guestId);

    res.status(200).json(guest_updated);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// get guest by dog_id
/*
    {
        "userId":"",
    }
*/
router.get("/:dogId", async (req, res) => {
  //sprawdzić czy pole isUpdated jest "true" jeżeli tak to ustawić hasło zwracane na "gość zmienił domyślne hasło"
  try {
    const dog_check = await Dog.findById(req.params.dogId);
    if (req.body.userId == dog_check.userId) {
      const dog = await Dog.findById(req.params.dogId);
      const guest = await Guest.findById(dog.guestId);

      const responseUser = new Guest({
        username: guest.username,
        email: guest.email,
        password: "********",
        isUpdated: guest.isUpdated,
      });

      res.status(200).json(responseUser);
    } else {
      res
        .status(403)
        .json("You can only see guest account info for your own dog");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//get dog by guest_id
router.get("/dog_data_for_guest/:guest_id", async (req, res) => {
  try {
    //const retreived_dog = await Dog.findOne()
    const retrieved_dog = await Dog.findOne({ guestId: req.params.guest_id });
    //i want to find the dog document that have field "guestId" set to guest_id from params of the request

    res.status(200).json(retrieved_dog);

    /*
    const retreived_guest = await Guest.findById(req.params.guest_id);
    if (retreived_guest.dogId[0] !== null && retreived_guest.dogId[0] !== "") {
      console.log("guest:" + retreived_guest);
      const retreived_dog = await Dog.findById(retreived_guest.dogId[0]);

      console.log("guest:" + retreived_dog);
      res.status(200).json(retreived_dog);
    } else {
      res.status(404).json("Dog not found");
    }
    */
  } catch (err) {
    console.log(err);
  }
});

//get dogs for guest
router.get("/dogs_for_guest/:guest_id", async (req, res) => {
  try {
    //const retreived_dog = await Dog.findOne()
    const retrieved_dog = await Dog.find({ guestId: req.params.guest_id });

    res.status(200).json(retrieved_dog);
  } catch (err) {
    console.log(err);
  }
});

//get guests by userId
router.get("/guests_for_user/:user_id", async (req, res) => {
  try {
    const retrieved_user = await User.findById(req.params.user_id);
    const guestArray = retrieved_user.guestArr;

    const getGuestData = async (guestId) => {
      try {
        const guestData = await Guest.findById(guestId);
        return guestData;
      } catch (err) {
        console.error(err);
        return null; // Handle the error, you may want to send an error response.
      }
    };

    const guestDataArray = await Promise.all(guestArray.map(getGuestData));

    res.status(200).json(guestDataArray);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" }); // Handle the error gracefully
  }
});

/* --------------------------------GUEST REGISTRATION FOR DOG ------------------ */

//mail carrier
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.email",
  secure: false,
  service: "gmail",
  auth: {
    user: "dogbooksendmail@gmail.com",
    pass: "ksogaqzelisvurze",
  },
});

//user -> send email adress to send registration mail
/*
{
  "email":xxxx,
  "userId":xxxx,
}
*/
router.post("/registration/mail", async (req, res) => {
  try {
    const info = await transporter.sendMail({
      from: "dogbooksendmail@gmail.com",
      to: req.body.email,
      subject: "Guest Registration",
      text: `Your mail has been registered for dog. Perform last registration using link: http://localhost:3000/registerGuest/${req.body.userId}/${req.body.email}`,
    });

    console.log("Send:" + info.response);

    res.status(200).json({ message: "Registration link has been sent." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //stworzenie gościa (dodanie do kolekcji guest)
    const newGuest = new Guest({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    const guest = await newGuest.save();

    //dodanie gościa do tablicy w użytkownikach

    const updateUser = await User.findById(req.body.userId);
    if (!updateUser) {
      return res.status(404).json({ error: "User not found" });
    }
    updateUser.guestArr.push(guest._id);
    const updatedUser = await updateUser.save();

    res.status(200).json(newGuest);
  } catch (err) {
    //console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//get guest username by guestId
router.get(`/getUsername/:guestId`, async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.guestId);
    res.status(200).json(guest);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
    //console.log(err);
  }
});

module.exports = router;
