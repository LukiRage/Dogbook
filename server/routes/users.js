const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

//update user
router.put("/:id", async (req, res) => {
  if (req.body.userId == req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return req.status(500).json(err);
      }
    }

    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been updated");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can update only your account!");
  }
});

//delete user (delete method in axios does not carry body in it)
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const userToDelete = await User.findById(userId);

    await Post.updateMany(
      { "comments.user_id": userId },
      { $pull: { comments: { user_id: userId } } }
    );

    // Delete all posts associated with the user
    await Post.deleteMany({ userId });

    // Delete the user from other users' followers and followings
    await User.updateMany(
      {
        $or: [
          { _id: { $in: userToDelete.followers } },
          { _id: { $in: userToDelete.followings } },
        ],
      },
      { $pull: { followers: userId, followings: userId } }
    );

    // Delete the user
    await User.findByIdAndDelete(userId);

    res
      .status(200)
      .json("Account, posts, and comments have been deleted successfully");
  } catch (err) {
    return res.status(500).json(err);
  }
});

// //get user
// router.get("/:id",async (req,res) =>{
//     try{
//         const user = await User.findById(req.params.id);
//         const {password,updatedAt, ...other} = user._doc
//         res.status(200).json(other);
//     }catch(err){
//         res.status(500).json(err)
//     }
// });

//get user
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get friends
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get online friends
router.get("/friends_online/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followings.map(async (friendId) => {
        const friend = await User.findById(friendId);
        if (friend.isOnline) {
          return {
            _id: friend._id,
            username: friend.username,
            profilePicture: friend.profilePicture,
          };
        }
      })
    );
    const onlineFriends = friends.filter(Boolean); // Remove undefined values
    res.status(200).json(onlineFriends);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get users
router.get("/all/:username", async (req, res) => {
  try {
    const userArray = await User.find({});

    const username = req.params.username;

    //search users that their username contains "username" (no matter the case)
    const searchResults = await User.find({
      username: { $regex: username, $options: "i" },
    });
    res.status(200).json(searchResults);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all users
router.get("/all", async (req, res) => {
  try {
    const userArray = await User.find({});
    //return all users
    const allUsers = await User.find({});
    res.status(200).json(allUsers);
  } catch (err) {
    res.status(500).json(err);
  }
});

//follow a user
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you already follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
});

//unfollow a user
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you dont follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }
});

module.exports = router;
