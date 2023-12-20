const express = require('express');
const { registerEmployee, loginEmployee, getEmployeeProfile, logoutEmployee } = require('../controllers/employeeController');
const { isAuthenticated } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', registerEmployee);
router.post('/login', loginEmployee);
router.get('/profile/:id', isAuthenticated, getEmployeeProfile);
router.get('/logout', logoutEmployee);

module.exports = router;