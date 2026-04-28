const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const upload = require('../middleware/upload');
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/new', ensureAuthenticated, blogController.getNewBlog);
router.post('/', ensureAuthenticated, upload.single('image'), blogController.createBlog);
router.get('/:id', blogController.getBlog);
router.get('/:id/edit', ensureAuthenticated, blogController.editBlogForm);
router.put('/:id', ensureAuthenticated, upload.single('image'), blogController.updateBlog);
router.delete('/:id', ensureAuthenticated, blogController.deleteBlog);

module.exports = router;
