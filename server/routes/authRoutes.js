const Router = require("express").Router
const router = Router();
const authController = require('../controllers/authControllers');
const authMiddleware = require('../middleware/authMiddleware');

// Register
router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

module.exports = router;