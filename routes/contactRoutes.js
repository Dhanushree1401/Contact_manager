import express from 'express';
import { getContacts, addContact, updateContact, deleteContact } from '../controllers/contactController.js';

const router = express.Router();

// Route to get all contacts
router.get('/', getContacts);

// Route to add a new contact
router.post('/', addContact);

// Route to update a contact by _id
router.put('/:id', updateContact);

// Route to delete a contact by _id
router.delete('/:id', deleteContact);

export default router;
