const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const upload = require('../middleware/upload');
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/new', ensureAuthenticated, (req, res) => {
    res.render('new-blog');
});

router.post('/', ensureAuthenticated, upload.single('image'), async (req, res) => {
    try {
        const { title, content } = req.body;
        const newBlog = new Blog({
            title,
            content,
            image: req.file ? `/uploads/${req.file.filename}` : '/uploads/default-blog.jpg',
            author: req.user._id
        });
        await newBlog.save();
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('author', 'username');
        if (!blog) return res.status(404).send('Blog not found');
        res.render('show-blog', { blog });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/:id/edit', ensureAuthenticated, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).send('Blog not found');
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(401).send('Unauthorized');
        }
        res.render('edit-blog', { blog });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.put('/:id', ensureAuthenticated, upload.single('image'), async (req, res) => {
    try {
        const { title, content } = req.body;
        let blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).send('Blog not found');
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(401).send('Unauthorized');
        }

        blog.title = title;
        blog.content = content;
        if (req.file) {
            blog.image = `/uploads/${req.file.filename}`;
        }
        await blog.save();
        res.redirect(`/blogs/${blog._id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.delete('/:id', ensureAuthenticated, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).send('Blog not found');
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(401).send('Unauthorized');
        }
        await Blog.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
