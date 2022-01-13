const express = require('express');
const { get } = require('express/lib/response');
const movieController = require('../controllers/movieController');

const router = express.Router();

router.route('/').get(movieController.list).post(movieController.create);
router.route('/import').post(movieController.import);

router
  .route('/:id')
  .get(movieController.show)
  .patch(movieController.update)
  .delete(movieController.create);

module.exports = router;
