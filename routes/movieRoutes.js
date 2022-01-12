const express = require('express');
const movieController = require('../controllers/movieController');

const router = express.Router();

router.route('/').get(movieController.getAll).post(movieController.create);

module.exports = router;
