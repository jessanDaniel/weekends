// !! All handler for our routes....because the routes file should be only for routes and not the logic

import PostMessage from "../models/postMessage.js";
import mongoose from "mongoose";

export const getPosts = async (req, res) => {
  const { page } = req.query;

  try {
    const limit = 8;
    const startIndex = (Number(page) - 1) * limit;
    const total = await PostMessage.countDocuments({});
    //executes when someone visits '/'
    const posts = await PostMessage.find()
      .sort({ _id: -1 })
      .limit(limit)
      .skip(startIndex);

    // console.log(postMessages);
    res.status(200).json({
      data: posts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//! Details page
export const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await PostMessage.findById(id);

    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//! explore page
export const getFamousPosts = async (req, res) => {
  try {
    const postMessages = await PostMessage.find();

    res.status(200).json(postMessages);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPostsBySearch = async (req, res) => {
  //* the string here comes in the form of a query and not as a param
  //! syntax for params : "/url/:param"...
  //! syntax for query : "/url?searchQuery={someValue}"...
  const { searchQuery, tags } = req.query;

  try {
    const title = new RegExp(searchQuery, "i"); //* 'i' stands for ignore case...

    const posts = await PostMessage.find({
      $or: [{ title }, { tags: { $in: tags.split(",") } }],
    });

    res.json({ data: posts });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//! create post
export const createPost = async (req, res) => {
  const post = req.body;

  const newPost = new PostMessage({
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });

  try {
    // * saving to mongoDB
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// ? Update function
export const updatePost = async (req, res) => {
  //* destructure id from the params and at the same time rename it to the proper keyName
  const { id: _id } = req.params;
  const post = req.body;
  //check whether id is present or valid
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(400).send("Sorry, No post exists with that id");

  //* adding new: true will update the database to save a modified object...
  const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {
    new: true,
  });

  res.json(updatedPost);
};

export const deletePost = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(400).send("Sorry, no post exists with that id");

  await PostMessage.findByIdAndRemove(_id);

  res.json({ message: "Post deleted yo" });
};

// * Update likes on a post

export const likePost = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) return res.json({ message: "Unauthenticated" });

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send("Sorry, no post exists with that id");

  const post = await PostMessage.findById(id);

  const index = post.likes.findIndex((id) => id === String(req.userId));

  if (index === -1) {
    // like a post
    post.likes.push(req.userId);
  } else {
    // dislike a post
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }

  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  });

  res.json(updatedPost);
};

//! Comment post

export const commentPost = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;

  const post = await PostMessage.findById(id);

  post.comments.push(value);

  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  });

  res.status(200).json(updatePost);
};
