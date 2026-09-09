const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoritesController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, favoritesController.getFavorites);
router.post('/', authenticateToken, favoritesController.addFavorite);
router.delete('/:id', authenticateToken, favoritesController.removeFavorite);

module.exports = router;
