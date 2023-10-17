const Event = require("../models/Event");
const router = require("express").Router();

//create new event
router.post("/", async (req, res) => {
  const newEvent = new Event(req.body);
  try {
    const savedEvent = await newEvent.save();
    res.status(200).json(savedEvent);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get a list of current events (purge expired events before sending pending)

router.get("/list", async (req, res) => {
  try {
    await Event.deleteMany({ expiredIn: { $lt: new Date() } });

    const allEvent = await Event.find();

    //filter the events (purge expired)

    res.status(200).json(allEvent);
  } catch (err) {
    res.status(500).json(err);
  }
});

//add user._id to members of an event
router.put("/addmember/:userId/:eventId", async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (event.members.includes(req.body.username)) {
      return res
        .status(400)
        .json({ error: "User is already a member of this event" });
    } else {
      event.members.push(req.body.username);
      await event.save();
    }

    res.status(200).json(event);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Remove a user from event members
router.put("/removemember/:userId/:eventId", async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    //check if the "event.members" contains req.body.username

    if (event.members.includes(req.body.username)) {
      //update event.memebers by deleting element that is req.body.username
      //save event

      event.members = event.members.filter(
        (member) => member !== req.body.username
      );
      event.save();

      res.status(200).json(event);
    } else {
      res.status(400).json({ error: "User is not a member of this event" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
