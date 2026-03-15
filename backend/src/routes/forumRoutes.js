import express from 'express';
import ForumPost from '../models/ForumPost.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (_req, res) => {
  const posts = await ForumPost.find({}).sort({ createdAt: -1 }).populate('createdBy', 'name role').populate('answers.answeredBy', 'name role');
  res.json(posts);
});

router.post('/', protect, async (req, res) => {
  const post = await ForumPost.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json(post);
});

router.post('/:id/answers', protect, async (req, res) => {
  const post = await ForumPost.findById(req.params.id);
  post.answers.push({ content: req.body.content, answeredBy: req.user._id, isHelpful: false });
  await post.save();
  res.json(post);
});

router.patch('/:postId/answers/:answerId/helpful', protect, async (req, res) => {
  const post = await ForumPost.findById(req.params.postId);
  const answer = post.answers.id(req.params.answerId);
  answer.isHelpful = true;
  await post.save();
  res.json(post);
});

export default router;
