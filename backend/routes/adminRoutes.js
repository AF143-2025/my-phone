const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');

// All admin routes require valid token and 'admin' role
router.use(authenticateToken, authorizeRoles('admin'));

router.get('/dashboard', adminController.getDashboardStats);
router.get('/stores/pending', adminController.getPendingStores);
router.put('/stores/:id/approve', adminController.approveStore);
router.put('/stores/:id/reject', adminController.rejectStore);
router.put('/stores/:id/verify', adminController.verifyStore);
router.put('/users/:id/ban', adminController.banUser);

module.exports = router;
