import Contact from '../models/contact.js';
import mongoose from 'mongoose';
const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addContact = async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        res.status(201).json(contact);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateContact = async (req, res) => {
    const { id } = req.params; // Get the contact ID from the request parameters
    const updateData = req.body; // Get the update data from the request body

    console.log('Received ID for update:', id); // Log the ID to verify

    try {
        // Find the contact by ID
        const contact = await Contact.findOne({ _id: id });

        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        // Update the fields of the contact
        console.log(contact);
        Object.assign(contact, updateData);

        // Save the updated contact back to the database
        const updatedContact = await contact.save();

        res.json(updatedContact); // Send the updated contact as the response
    } catch (error) {
        res.status(400).json({ error: error.message }); // Handle any errors
    }
};



const deleteContact = async (req, res) => {
    const { id } = req.params; // Extract the ID from the route parameter

    // Validate if the `id` is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }

    try {
        const contact = await Contact.findByIdAndDelete(id);
        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }
        res.status(200).json({ message: "Contact deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getContacts, addContact, updateContact, deleteContact };
