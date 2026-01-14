import User from "../models/userModel.js";
import Post from "../models/postModel.js";

const postCreate = async (req, res) => {
  const posterId = req.user._id;

  const { text, picture } = req.body;

  try {
    const user = await User.findById(posterId);

    if (!user) {
      throw new Error("User not found!");
    }

    if (user._id.toString() !== req.params.id.toString()) {
      throw new Error("Unauthorized!");
    }

    const newPost = new Post({ postedBy: posterId, text, image: picture });

    await newPost.save();

    return res.json({ status: 200, message: "Posted!" });
  } catch (err) {
    import('fs').then(fs => fs.appendFileSync('error.log', `Post Create Error: ${err.stack}\n`));
    res.json({
      message: err.message,
    });
  }
};

const postGet = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      throw new Error("Post not found!");
    }

    const user = await User.findById(post.postedBy);

    if (!user) {
      throw new Error("User not found!");
    }

    const userReplyIds = [
      ...new Set(post.replies.map((reply) => reply.userId.toString())),
    ];

    const userData = await User.find({ _id: { $in: userReplyIds } }).select(
      "username name picture",
    );

    const userMap = new Map(
      userData.map((user) => [user._id.toString(), user]),
    );
    const postData = {
      ...post.toObject(),
      postedBy: {
        _id: user._id,
        username: user.username,
        name: user.name,
        picture: user.picture,
      },
      replies: post.replies.map((reply) => ({
        ...reply.toObject(),
        userId: userMap.get(reply.userId.toString()) || {},
      })),
    };

    return res.json(postData);
  } catch (err) {
    res.json({ message: err.message });
  }
};

const postedByUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new Error("User not found!");
    }

    if (!req.user) {
      throw new Error("Unauthorized!");
    }

    const posts = await Post.find({ postedBy: user._id });

    return res.json(posts);
  } catch (err) {
    res.json({ message: err.message });
  }
};

const postFeed = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new Error("User not found!");
    }

    if (req.user._id.toString() !== user._id.toString()) {
      throw new Error("Unauthorized!");
    }

    const followingIds = user.following.map(id => id.toString());
    followingIds.push(user._id.toString());

    const postData = await Post.find({ postedBy: { $in: followingIds } })
      .lean()
      .populate("postedBy", "username name picture")
      .sort({ postedAt: -1 });

    const posts = postData.map((post) => ({
      ...post,
      postedBy: post.postedBy || {},
      type: "post",
    }));

    return res.json(posts);
  } catch (err) {
    res.json({ message: err.message });
  }
};

const getForYouFeed = async (req, res) => {
  try {
    const postData = await Post.find({})
      .lean()
      .populate("postedBy", "username name picture")
      .sort({ postedAt: -1 });

    const posts = postData.map((post) => ({
      ...post,
      postedBy: post.postedBy || {},
      type: "post",
    }));

    return res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getLikedPosts = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userId !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 1. Fetch Liked Posts
    const likedPosts = await Post.find({ likes: userId })
      .lean()
      .populate("postedBy", "username name picture");

    const formattedPosts = likedPosts.map((post) => ({
      ...post,
      postedBy: post.postedBy || {},
      type: "post",
    }));

    // 2. Fetch Liked Replies
    const postsWithLikedReplies = await Post.find({
      "replies.likes": userId,
    })
      .lean()
      .populate("replies.userId", "username name picture");

    const likedReplies = [];
    postsWithLikedReplies.forEach((post) => {
      post.replies.forEach((reply) => {
        if (reply.likes.includes(userId)) {
          likedReplies.push({
            ...reply,
            postId: post._id, // Add context
            type: "reply",
          });
        }
      });
    });

    // 3. Combine and Sort
    const feed = [...formattedPosts, ...likedReplies].sort((a, b) => {
      return new Date(b.postedAt) - new Date(a.postedAt);
    });

    return res.json(feed);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSavedPosts = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userId !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Saved posts (Note: Replies don't have savedBy field yet)
    const posts = await Post.find({ savedBy: userId })
      .lean()
      .populate("postedBy", "username name picture")
      .sort({ postedAt: -1 });

    const formattedPosts = posts.map((post) => ({
      ...post,
      postedBy: post.postedBy || {},
      type: "post",
    }));

    return res.json(formattedPosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const postLike = async (req, res) => {
  try {
    const postId = await Post.findById(req.params.id);
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post not found!");
    }

    const likedPost = post.likes.includes(userId);

    if (likedPost) {
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await post.save();
      return res.json({ status: 200, message: "Post unliked!" });
    } else {
      await Post.updateOne({ _id: postId }, { $push: { likes: userId } });
      await post.save();
      return res.json({ status: 200, message: "Post liked!" });
    }
  } catch (err) {
    return res.json({ message: err.message });
  }
};

const postRepliesByUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new Error("User not found!");
    }

    const postData = await Post.find({
      replies: {
        $elemMatch: { userId: user._id },
      },
    }).select("replies.text replies.userId replies.postedAt");

    const filteredPosts = postData.map((post) => ({
      ...post._doc,
      replies: post.replies.filter((reply) => reply.userId.equals(user._id)),
    }));

    const replies = [];

    for (let i = 0; i < filteredPosts.length; i++) {
      const post = filteredPosts[i];
      for (let j = 0; j < post.replies.length; j++) {
        replies.push(post.replies[j]);
      }
    }

    return res.json(replies);
  } catch (err) {
    res.json({ message: err.message });
  }
};

const postRepostedByUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new Error("User not found!");
    }

    const postData = await Post.find({ repostedBy: user._id })
      .lean()
      .populate("postedBy", "username name picture");

    return res.json(postData);
  } catch (err) {
    res.json({ message: err.message });
  }
};

const postReply = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = await Post.findById(req.params.id);

    const { text } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post not found!");
    }

    await Post.updateOne(
      { _id: postId },
      { $push: { replies: [{ userId, text }] } },
    );

    await post.save();

    return res.json({ status: 200, message: "Post replied!" });
  } catch (err) {
    return res.json({ message: err.message });
  }
};

const postReplyLike = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.id;
  const replyId = req.params.id2;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post not found!");
    }

    const reply = post.replies.id(replyId);

    if (!reply) {
      throw new Error("Reply not found!");
    }

    const userLiked = reply.likes.includes(userId);

    console.log(userLiked);

    if (userLiked) {
      reply.likes.pull(userId);
      await post.save();
      return res.json({ status: 200, message: "Reply unliked!" });
    } else {
      reply.likes.push(userId);
      await post.save();
      return res.json({ status: 200, message: "Reply liked!" });
    }
  } catch (err) {
    return res.json({ message: err.message });
  }
};

const postReplyDelete = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.id;
  const replyId = req.params.id2;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post not found!");
    }

    const reply = post.replies.id(replyId);

    if (!reply) {
      throw new Error("Reply not found!");
    }

    if (reply.userId._id != userId) {
      throw new Error("Unauthorized!");
    }

    post.replies.pull({ _id: replyId });

    await post.save();
    return res.json({ status: 200, message: "Reply deleted!" });
  } catch (err) {
    return res.json({ message: err.message });
  }
};

const postSave = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const post = await Post.findById(req.params.id);
    if (!user) {
      throw new Error("User not found!");
    }

    const modifyPostSavedBy = post.savedBy.includes(user._id);

    if (modifyPostSavedBy) {
      await Post.updateOne({ _id: post._id }, { $pull: { savedBy: user._id } });
      return res.json({ status: 200, message: "Unsaved!" });
    } else {
      await Post.updateOne({ _id: post._id }, { $push: { savedBy: user._id } });
      return res.json({ status: 200, message: "Saved!" });
    }
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};

const postDelete = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      throw new Error("Post not found!");
    }

    if (req.user._id.toString() !== post.postedBy.toString()) {
      throw new Error("Unauthorized!");
    }

    await Post.findByIdAndDelete(req.params.id);

    return res.json({ status: 200, message: "Post deleted!" });
  } catch (err) {
    res.json({ message: err.message });
  }
};

const postRepost = async (req, res) => {
  const postId = req.params.id;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new Error("User not found!");
    }

    await Post.updateOne({ _id: postId }, { $push: { repostedBy: user._id } });

    return res.json({ status: 200, message: "Reposted!" });
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};

export {
  postCreate,
  postGet,
  postedByUser,
  postFeed,
  postLike,
  postReply,
  postReplyLike,
  postRepliesByUser,
  postRepostedByUser,
  postReplyDelete,
  postSave,
  postDelete,
  postRepost,
  getForYouFeed,
  getLikedPosts,
  getSavedPosts,
};
