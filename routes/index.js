const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

router.get('/', indexController.getHome);
router.get('/set-cookie', indexController.setCookie);
router.get('/get-cookie', indexController.getCookie);
router.get('/delete-cookie', indexController.deleteCookie);

module.exports = router;
