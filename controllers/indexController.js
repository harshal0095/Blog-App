const Blog = require('../models/Blog');

exports.getHome = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 }).populate('author', 'username');
        res.render('home', { blogs });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.setCookie = (req, res) => {
    res.cookie('userPreference', 'dark-mode', { maxAge: 900000, httpOnly: true });
    res.send('Cookie has been set');
};

exports.getCookie = (req, res) => {
    const preference = req.cookies.userPreference;
    res.send(`User Preference: ${preference || 'Not set'}`);
};

exports.deleteCookie = (req, res) => {
    res.clearCookie('userPreference');
    res.send('Cookie has been deleted');
};
