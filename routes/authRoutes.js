import express from 'express';
import { registerUser, loginUser,authenticateToken } from '../controllers/authController.js';

const router = express.Router();

// Route to register a new user
router.post('/register', registerUser);

// Route to login an existing user
router.post('/login', loginUser);
router.get('/profile', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'Welcome to your profile!', user: req.user });
});

export default router;
