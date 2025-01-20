import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Import contact routes
import contactRoutes from './routes/contactRoutes.js';
import authRoutes from './routes/authRoutes.js';
const app = express();

// Middleware to parse JSON and enable CORS
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://contact_manager:Dhanu%401401@cluster0.ffxel.mongodb.net/contact-m')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// Mount contact routes
app.use('/contact', contactRoutes);
app.use('/auth', authRoutes);
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
