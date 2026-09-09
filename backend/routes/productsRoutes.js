const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');

router.get('/', productsController.getProducts);
router.get('/:id', productsController.getProductById);
router.post('/', authenticateToken, authorizeRoles('store_owner', 'admin'), productsController.createProduct);
router.put('/:id', authenticateToken, authorizeRoles('store_owner', 'admin'), productsController.updateProduct);
router.delete('/:id', authenticateToken, authorizeRoles('store_owner', 'admin'), productsController.deleteProduct);

module.exports = router;
