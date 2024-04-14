import express from "express";

import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  commentPost,
  getPostsBySearch,
  getFamousPosts,
} from "../controllers/posts.js";

import auth from "../middleware/auth.js";

const router = express.Router();

// Every route here is now prefixed with '/posts'
router.get("/search", getPostsBySearch);
router.get("/", getPosts);
//! details page
router.get("/:id", getPost);
//! Explore page

router.get("/get/famous", getFamousPosts);

router.post("/", auth, createPost);

// ! patch is used to edit the entries
router.patch("/:id", auth, updatePost);

router.patch("/:id/likePost", auth, likePost);
router.post("/:id/commentPost", auth, commentPost);
router.delete("/:id", auth, deletePost);

export default router;
