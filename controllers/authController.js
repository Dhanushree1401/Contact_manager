import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = 'rrrr';  // Secret key for signing the JWT token

// Register user
const registerUser = async (req, res) => {
    try {
        const { phone, password, role } = req.body;

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the user
        const user = new User({ phone, password: hashedPassword, role });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};

// Login user
const loginUser = async (req, res) => {
    const { phone, role } = req.body;

    try {
        // Find user by phone number and role
        const user = await User.findOne({ phone, role });

        if (!user) {
            return res.status(400).json({ message: 'User not found or incorrect role' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { phone: user.phone, role: user.role, id: user._id },
            JWT_SECRET,
            { expiresIn: '1h' }  // The token will expire in 1 hour
        );

        // Send the token in the response
        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Middleware to verify the JWT token
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');  // Extract the token from the Authorization header

    if (!token) {
        return res.status(403).json({ message: 'Access denied' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        req.user = user;  // Store the decoded user info in the request
        next();
    });
};

export { registerUser, loginUser, authenticateToken };
