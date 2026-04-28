const Blog = require('../models/Blog');

exports.getNewBlog = (req, res) => {
    res.render('new-blog');
};

exports.createBlog = async (req, res) => {
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
};

exports.getBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('author', 'username');
        if (!blog) return res.status(404).send('Blog not found');
        res.render('show-blog', { blog });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.editBlogForm = async (req, res) => {
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
};

exports.updateBlog = async (req, res) => {
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
};

exports.deleteBlog = async (req, res) => {
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
};
