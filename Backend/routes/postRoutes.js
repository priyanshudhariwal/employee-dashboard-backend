const express = require('express');
const { createPost, upvotePost, downvotePost, deletePost, getPosts, addComment, getPostById } = require('../controllers/postController');
const { isAuthenticated } = require('../middlewares/auth');
const router = express.Router();

router.post('/post/new',isAuthenticated, createPost);
router.get('/post/upvote/:id', isAuthenticated, upvotePost);
router.get('/post/downvote/:id', isAuthenticated, downvotePost);
router.delete('/post/delete/:id', isAuthenticated, deletePost);
router.get('/post/all', isAuthenticated, getPosts);
router.put('/post/comment/:id', isAuthenticated, addComment);
router.get('/post/:id', isAuthenticated, getPostById);

module.exports = router;