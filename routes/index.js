const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 }).populate('author', 'username');
        res.render('home', { blogs });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/set-cookie', (req, res) => {
    res.cookie('userPreference', 'dark-mode', { maxAge: 900000, httpOnly: true });
    res.send('Cookie has been set');
});

router.get('/get-cookie', (req, res) => {
    const preference = req.cookies.userPreference;
    res.send(`User Preference: ${preference || 'Not set'}`);
});

router.get('/delete-cookie', (req, res) => {
    res.clearCookie('userPreference');
    res.send('Cookie has been deleted');
});

module.exports = router;
