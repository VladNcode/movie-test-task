const express = require('express');
const movieController = require('../controllers/movieController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.route('/').get(movieController.list).post(movieController.create);
router.route('/import').post(movieController.uploadMult, movieController.import);

router
  .route('/:id')
  .get(movieController.show)
  .patch(movieController.update)
  .delete(movieController.delete);

module.exports = router;
