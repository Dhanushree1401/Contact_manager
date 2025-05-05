import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import ContactList from './Components/ContactList';
import AddContact from './Components/AddContact';
import Login from './Components/Login';
import Register from './Components/Register';
import axios from 'axios';
import './App.css';

function App() {
    const [contacts, setContacts] = useState([]);
    const [isAddContactVisible, setIsAddContactVisible] = useState(false);
    const [currentContact, setCurrentContact] = useState(null);
    const [isLogin, setIsLogin] = useState(true);
    const [user, setUser] = useState(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navigate = useNavigate();

    // Fetch all contacts on user login
    useEffect(() => {
        if (user) fetchContacts();
    }, [user]);

    // Auto-login on page reload
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser)); // Restore user session
            setIsLogin(false);
        }
    }, []);

    // Fetch all contacts
    const fetchContacts = async () => {
        try {
            const response = await axios.get('https://contact-backend-xo64.onrender.com/contact');

            setContacts(response.data);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    // Add a new contact
    const addContact = async (contact) => {
        try {
            await axios.post('https://contact-backend-xo64.onrender.com/contact', contact);
            fetchContacts();
            closeModal();
        } catch (error) {
            console.error('Error adding contact:', error.response?.data || error.message);
        }
    };

    // Edit a contact
    const editContact = async (id, updatedData) => {
        try {
            const response = await axios.put(`https://contact-backend-xo64.onrender.com/contact/${id}`, updatedData);
            fetchContacts();
            console.log('Contact updated successfully:', response.data);
        } catch (error) {
            console.error('Error editing contact:', error.response?.data || error.message);
        }
    };

    // Delete a contact
    const deleteContact = async (id) => {
        try {
            const response = await axios.delete(`https://contact-backend-xo64.onrender.com/contact/${id}`);
            console.log('Contact deleted successfully:', response.data);
            fetchContacts();
        } catch (error) {
            console.error('Error deleting contact:', error.response?.data || error.message);
        }
    };

    // Toggle the Add Contact form
    const toggleAddContactForm = () => {
        setIsAddContactVisible(!isAddContactVisible);
        setCurrentContact(null);
    };

    // Close the Add/Edit Contact modal
    const closeModal = () => {
        setIsAddContactVisible(false);
        setCurrentContact(null);
    };

    // Handle user login
    const handleLogin = async (credentials) => {
        try {
            const response = await axios.post('https://contact-backend-xo64.onrender.com/login', credentials);
            const { userData } = response.data;

            if (userData) {
                setUser(userData); // Set the logged-in user
                setIsLogin(false); // Mark the user as logged in
                localStorage.setItem('user', JSON.stringify(userData)); // Save user session
                navigate('/'); // Redirect to the main page
            } else {
                alert('Invalid credentials, please try again.');
            }
        } catch (error) {
            console.error('Error during login:', error.response?.data || error.message);
            alert('Login failed. Please check your credentials.');
        }
    };

    // Handle user registration
    const handleRegister = (newUser) => {
        handleLogin(newUser); // Log the user in after registration
    };

    // Handle logout confirmation
    const confirmLogout = (logout) => {
        if (logout) {
            setUser(null);
            setIsLogin(true);
            localStorage.removeItem('user'); // Clear user session
            navigate('/'); // Redirect to login
        }
        setShowLogoutModal(false);
    };
console.log(isLogin);
    return (
        <div className="app-container">
            <h1>Contact Manager</h1>
            {isLogin ? (
                <Routes>
                    <Route path="/" element={<Login onLogin={handleLogin} setIsLogin={setIsLogin}  setUser={setUser} />} />
                    <Route path="/register" element={<Register onRegister={handleRegister} />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            ) : (
                <div>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <>
                                    <ContactList
                                        contacts={contacts}
                                        onDelete={deleteContact}
                                        onEdit={(contact) => {
                                            setCurrentContact(contact);
                                            setIsAddContactVisible(true);
                                        }}
                                        onAdd={toggleAddContactForm}
                                        user={user}
                                    />
                                    {isAddContactVisible && (
                                        <div className="add-contact-modal">
                                            <AddContact
                                                addContact={addContact}
                                                editContact={editContact}
                                                currentContact={currentContact}
                                                setCurrentContact={setCurrentContact}
                                                closeModal={closeModal}
                                            />
                                        </div>
                                    )}
                                </>
                            }
                        />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                    {showLogoutModal && (
                        <div className="logout-modal">
                            <p>Are you sure you want to log out?</p>
                            <button
                                onClick={() => confirmLogout(true)}
                                style={{ padding: '10px 20px', marginRight: '10px', backgroundColor: '#007bff', color: '#fff' }}
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => confirmLogout(false)}
                                style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: '#fff' }}
                            >
                                No
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function Main() {
    return (
        <Router>
            <App />
        </Router>
    );
}

export default Main;
