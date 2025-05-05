import React, { useState, useEffect } from 'react';
import './AddContactStyles.css';

function AddContact({ addContact, editContact, currentContact, closeModal }) {
    const [contact, setContact] = useState({
        name: '',
        email: '',
        phone: '+91',
        year: '',
        address: '',
        domain: '',
        department: '',
        github: '',
        linkedin: '',
        leetcode: '',
        hackerrank: '',
    });

    useEffect(() => {
        // Populate the form fields if editing an existing contact
        if (currentContact) {
            setContact(currentContact);
        } else {
            setContact({
                name: '',
                email: '',
                phone: '+91',
                year: '',
                address: '',
                domain: '',
                department: '',
                github: '',
                linkedin: '',
                leetcode: '',
                hackerrank: '',
            });
        }
    }, [currentContact]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setContact((prevContact) => ({
            ...prevContact,
            [name]: name === 'phone' && value.length <= 3 ? '+91' : value, // Ensure phone starts with +91
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const { name, email, phone, address } = contact;

        // Validate required fields
        if (!name || !email || !phone || !address) {
            console.error("All required fields must be filled.");
            return;
        }

        try {
            if (currentContact?._id) {
                // Call editContact to update the existing contact
                const { _id, ...updatedContact } = contact; // Exclude _id when updating
                await editContact(currentContact._id, updatedContact);
                console.log("Contact updated successfully.");
            } else {
                // Call addContact to create a new contact
                await addContact(contact);
                console.log("Contact added successfully.");
            }
            closeModal(); // Close the modal after successful operation
        } catch (error) {
            console.error("Error processing contact:", error.response?.data || error.message);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close-button" onClick={closeModal}>&times;</span>
                <h2>{currentContact ? 'Edit Contact' : 'Add Contact'}</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={contact.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={contact.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        value={contact.phone}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="year"
                        placeholder="Year (1/2/3/4)"
                        value={contact.year}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        value={contact.address}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="domain"
                        placeholder="Domain"
                        value={contact.domain}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="department"
                        placeholder="Department"
                        value={contact.department}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="github"
                        placeholder="GitHub Profile URL"
                        value={contact.github}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="linkedin"
                        placeholder="LinkedIn Profile URL"
                        value={contact.linkedin}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="leetcode"
                        placeholder="LeetCode Profile URL"
                        value={contact.leetcode}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="hackerrank"
                        placeholder="HackerRank Profile URL"
                        value={contact.hackerrank}
                        onChange={handleChange}
                    />
                    <button type="submit">
                        {currentContact ? 'Update' : 'Add'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddContact;
