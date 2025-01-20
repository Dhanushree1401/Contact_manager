import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    year: Number,
    address: String,
    domain: String,
    department: String,
    github: String,
    linkedin: String,
    leetcode: String,
    hackerrank: String,
});

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;
