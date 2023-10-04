const router = require("express").Router();

const User = require("../models/User");
const { Post, Comment } = require("../models/Post");

//create a post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update a post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("the post has been updated");
    } else {
      res.status(403).json("you can only update your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete a post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne({ $set: req.body });
      res.status(200).json("the post has been deleted");
    } else {
      res.status(403).json("you can only delete your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//like or dislike a post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("the post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("the post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//get a post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get timeline posts
router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).json(err);
  }
});

//get user's all posts
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

////////////////Comments for post/////////////////////

//Add comment to post with specific post_id
router.post("/comment/:post_id", async (req, res) => {
  const newComment = new Comment(req.body);
  try {
    const retreivedPost = await Post.findById(req.params.post_id);
    retreivedPost.comments.push(newComment);
    const savedPost = await retreivedPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

/*
//get all comments under specific post by post_id
router.get("/comment/:post_id", async (req, res) => {
  try {
    const retreivedPost = await Post.findById(req.params.post_id);
    res.status(200).json(retreivedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});
*/

router.get("/comment/:post_id", async (req, res) => {
  try {
    const retrievedPost = await Post.findById(req.params.post_id).populate({
      path: "comments",
      populate: {
        path: "user_id",
        model: User,
        select: "username profilePicture",
      },
    });

    if (!retrievedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(retrievedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Edit comment by specific comment_id
router.put("/comment/edit/:post_id/:comment_id", async (req, res) => {
  const newCommentDescription = req.body.description;
  try {
    // //pobrać post i komentarz poprzez comment_id
    const retreivedPost = await Post.findById(req.params.post_id);

    const retreivedComment = await retreivedPost.comments.id(
      req.params.comment_id
    );

    if (req.body.user_id == retreivedComment.user_id) {
      //zedytować komentarz
      retreivedComment.description = newCommentDescription;
      console.log(retreivedPost);
      //wepchnąć komentarz zmieniony na to samo miejsce AKA zapisać cały post żeby zaktualizować pole w poddokumencie
      retreivedPost.save();
      res.status(200).json("post comment have been updated");
    } else {
      res.status(403).json("you only can edit your comments!");
      console.log("Z body:" + req.body.user_id);
      console.log("Z komentarza w bazie danych:" + retreivedComment.user_id);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//Delete comment from post with specific post_id by user with specific user_id
router.delete("/comment/:post_id/:comment_id", async (req, res) => {
  try {
    const retreivedPost = await Post.findById(req.params.post_id);
    const retreivedComment = await retreivedPost.comments.id(
      req.params.comment_id
    );

    console.log(req.body.user_id);
    console.log(retreivedComment.user_id);
    if (req.body.user_id == retreivedComment.user_id) {
      await retreivedPost.comments.pull(retreivedComment);
      await retreivedPost.save();
      res.status(200).json("comment element has been deleted");
    } else {
      res.status(403).json("you only can delete your comments!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//like or dislike a comment
router.put("/comment/like/:post_id/:comment_id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    const comment = await post.comments.id(req.params.comment_id);

    if (!comment.likes.includes(req.body.userId)) {
      comment.likes.push(req.body.userId);
      post.save();
      res.status(200).json("the comment has been liked");
    } else {
      comment.likes.pull(req.body.userId);
      post.save();
      res.status(200).json("the comment has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
