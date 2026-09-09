const express = require('express');
const router = express.Router();
const storesController = require('../controllers/storesController');
const { authenticateToken, optionalAuthenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');

router.get('/', storesController.getStores);
router.get('/:id', optionalAuthenticateToken, storesController.getStoreById);
router.get('/:id/reviews', storesController.getStoreReviews);
router.post('/:id/reviews', optionalAuthenticateToken, storesController.addStoreReview);
router.post('/', authenticateToken, authorizeRoles('store_owner', 'admin'), storesController.createStore);
router.put('/:id', authenticateToken, authorizeRoles('store_owner', 'admin'), storesController.updateStore);
router.delete('/:id', authenticateToken, authorizeRoles('store_owner', 'admin'), storesController.deleteStore);

module.exports = router;

