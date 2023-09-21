import express from "express";
import Post from "../Model/Post.js";
import User from "../Model/User.js";

const router = express.Router();

//create post

router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).send({
      success: true,
      message: "Post Created Successfully",
      savedPost,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error Posting",
    });
  }
});

// Update Post

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).send({
        success: true,
        message: "Post has been updated Successfully",
      });
    } else {
      res.status(403).send({
        success: false,
        message: "you can update only your post",
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete Post

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).send({
        success: true,
        message: "Post has been deleted Successfully",
      });
    } else {
      res.status(403).send({
        success: false,
        message: "you can delete only your post",
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Like/ Dislike a Post

router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).send({
        success: true,
        message: "The Post has been liked",
      });
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).send({
        success: true,
        message: "The Post has been disliked",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
//get a post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).send({
      success: true,
      message: "The Post has been fetched Successfully",
      post,
    });
  } catch (err) {
    res.status(500).json(error);
  }
});
//get timeline Post
router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).send(userPosts.concat(...friendPosts));
    // res.json(userPosts.concat(...friendPosts));
  } catch (err) {
    console.log(err);
    res.status(500).json("API Fails");
  }
});
// get users all posts
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
