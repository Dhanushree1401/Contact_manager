import User from '../models/user.js';
import jwt from 'jsonwebtoken';

const registerUser = async (req, res) => {
    try {
        const { phone, password, role } = req.body;

        const user = new User({ phone, password, role });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { phone, password } = req.body;

        const user = await User.findOne({ phone });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { phone: user.phone, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { registerUser, loginUser };
