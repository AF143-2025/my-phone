const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/servicesController');
const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');

router.get('/', servicesController.getServices);
router.post('/', authenticateToken, authorizeRoles('store_owner', 'admin'), servicesController.createService);
router.put('/:id', authenticateToken, authorizeRoles('store_owner', 'admin'), servicesController.updateService);
router.delete('/:id', authenticateToken, authorizeRoles('store_owner', 'admin'), servicesController.deleteService);

module.exports = router;
