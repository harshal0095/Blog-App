const passport = require('passport');
const User = require('../models/User');

exports.getSignup = (req, res) => {
    res.render('signup');
};

exports.postSignup = async (req, res) => {
    const { username, password } = req.body;
    try {
        let user = await User.findOne({ username });
        if (user) {
            req.flash('error_msg', 'User already exists');
            return res.redirect('/auth/signup');
        }
        user = new User({ username, password });
        await user.save();
        req.flash('success_msg', 'Registration successful! You can now login.');
        res.redirect('/auth/login');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Something went wrong during registration');
        res.redirect('/auth/signup');
    }
};

exports.getLogin = (req, res) => {
    res.render('login');
};

exports.postLogin = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash: true
    })(req, res, next);
};

exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash('success_msg', 'You are logged out');
        res.redirect('/auth/login');
    });
};
