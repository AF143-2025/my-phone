const express = require('express');
const router = express.Router();
const offersController = require('../controllers/offersController');
const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');

router.get('/', offersController.getOffers);
router.post('/', authenticateToken, authorizeRoles('store_owner', 'admin'), offersController.createOffer);

module.exports = router;
