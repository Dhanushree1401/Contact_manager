import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

function ContactList({ contacts, onDelete, onEdit, onAdd, user }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('name');
    const [domainSearchTerm, setDomainSearchTerm] = useState('');
    const [departmentSearchTerm, setDepartmentSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('home');
    const [sortType, setSortType] = useState('latest');
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const navigate = useNavigate();

    const filteredContacts = useMemo(() => {
        return contacts.filter(contact => {
            const lowerCaseTerm = searchTerm.toLowerCase();
            const lowerCaseDomainTerms = domainSearchTerm.toLowerCase().split(',').map(term => term.trim());
            const lowerCaseDepartmentTerms = departmentSearchTerm.toLowerCase().split(',').map(term => term.trim());

            const matchesSearchType = searchType === 'name' 
                ? contact.name.toLowerCase().includes(lowerCaseTerm)
                : searchType === 'email' 
                ? contact.email.toLowerCase().includes(lowerCaseTerm)
                : contact.phone.includes(lowerCaseTerm);

            const matchesDomain = lowerCaseDomainTerms.some(domain => 
                contact.domain.toLowerCase().startsWith(domain.slice(0, 2))
            );

            const matchesDepartment = lowerCaseDepartmentTerms.some(department => 
                contact.department.toLowerCase().includes(department)
            );
            
            return matchesSearchType && matchesDomain && matchesDepartment;
        });
    }, [contacts, searchTerm, searchType, domainSearchTerm, departmentSearchTerm]);
    
    const ContactList = ({ contacts }) => {
        const [expandedContact, setExpandedContact] = useState(null);
    
        const handleContactClick = (contact) => {
            if (expandedContact === contact) {
                setExpandedContact(null); 
            } else {
                setExpandedContact(contact); 
            }
        };
    }

    const sortedContacts = useMemo(() => {
        return [...filteredContacts].sort((a, b) => {
            if (sortType === 'latest') return new Date(b.last_modified) - new Date(a.last_modified);
            if (sortType === 'oldest') return new Date(a.last_modified) - new Date(b.last_modified);
            if (sortType === 'a-z') return a.name.localeCompare(b.name);
            if (sortType === 'z-a') return b.name.localeCompare(a.name);
            return 0;
        });
    }, [filteredContacts, sortType]);

    const contactsToDisplay = activeTab === 'home'
        ? user.role === 'teacher'
            ? sortedContacts.slice(0, 6)
            : contacts.filter(contact => contact.phone === user.phone)
        : sortedContacts;

    const createGmailLink = (email) => `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`;
    const createGoogleMapsLink = (address) => `https://www.google.com/maps/search/?q=${encodeURIComponent(address)}`;
    const createCallLink = (phone) => `tel:${phone}`;
    const getUsernameFromUrl = (url) => {
        if (!url) return '';
        try {
            const pathname = new URL(url).pathname;
            return pathname.split('/').filter(Boolean).pop();
        } catch (error) {
            console.error('Invalid URL:', url);
            return '';
        }
    };

    const handleLogout = () => setShowLogoutModal(true);
    const confirmLogout = () => {
        setShowLogoutModal(false);
        window.location.reload();
    };

    const handleContactClick = (contact) => {
        setSelectedContact(contact === selectedContact ? null : contact);
    };

    return (
        <div style={{
            padding: '20px',
            maxWidth: '100%',
            fontSize: '20px',
            margin: 'auto',
            backgroundImage: 'url(https://static.vecteezy.com/system/resources/thumbnails/003/127/954/small_2x/abstract-template-blue-background-white-squares-free-vector.jpg)',
            backgroundSize: 'cover', 
            backgroundPosition: 'center',  
            minHeight: '100vh',  
            backgroundRepeat: 'no-repeat', 
            backgroundColor: 'rgba(0, 0, 0, 1.0)'  
        }}>
            <h1>
     You are logged in as a {user?.role}.
</h1>

            <button onClick={handleLogout} style={{
                position: 'absolute', top: '20px', right: '20px', backgroundColor: '#dc3545', color: '#fff', padding: '10px 15px',
            }}>Logout</button>
    
    {showLogoutModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{
                        backgroundColor: '#fff', padding: '20px', borderRadius: '8px', textAlign: 'center', maxWidth: '400px'
                    }}>
                        <h3>Confirm Logout</h3>
                        <p>Are you sure you want to log out?</p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                            <button onClick={confirmLogout} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: '#fff' }}>Yes</button>
                            <button onClick={() => setShowLogoutModal(false)} style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: '#fff' }}>No</button>
                        </div>
                    </div>
                </div>
            )}


<div style={{ display: 'flex', borderBottom: '2px solid #007bff', marginBottom: '20px' }}>
    <div onClick={() => setActiveTab('home')} style={{
        padding: '15px 525px', cursor: 'pointer', 
        borderBottom: activeTab === 'home' ? '4px solid #007bff' : 'none',
        fontSize: '20px', fontWeight: 'bold', color: '#007bff'
    }}>Home</div>
    <div onClick={() => setActiveTab('view-all')} style={{
        padding: '15px 525px', cursor: 'pointer', 
        borderBottom: activeTab === 'view-all' ? '4px solid #007bff' : 'none',
        fontSize: '20px', fontWeight: 'bold', color: '#007bff'
    }}>View_All</div>
</div>
    {activeTab === 'view-all' && (
                <div style={{ display: 'flex',  alignItems: 'center', flexDirection: 'column', gap: '20px', width: '59%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px',width:'50%'}}>
                    <input
                        type="text"
                        placeholder={`Search by ${searchType}`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: '12px', marginBottom: '10px', flex:1 }}
                    />
                    <select
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                        style={{
                            padding: '12px 16px',
                            backgroundColor: '#f8f9fa',
                            border: '1px solid #ccc',
                            marginLeft: '10px',
                        }}
                    >
                        <option value="name">Name</option>
                        <option value="email">Email</option>
                        <option value="phone">Phone Number</option>
                    </select>
                </div>
            
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <input
                        type="text"
                        placeholder="Search by Domain (separate with commas)"
                        value={domainSearchTerm}
                        onChange={(e) => setDomainSearchTerm(e.target.value)}
                        style={{ flex: 1, padding: '12px', marginBottom: '10px', width: '300px' }}
                    />
                    <input
                        type="text"
                        placeholder="Search by Department (separate with commas)"
                        value={departmentSearchTerm}
                        onChange={(e) => setDepartmentSearchTerm(e.target.value)}
                        style={{ flex: 1, padding: '12px', marginBottom: '10px', width: '300px' }}
                    />
                </div>
            </div>
            
            )}
            
            {user.role === 'teacher' && activeTab === 'view-all' && user.role==='student' || activeTab === 'view-all'&&(
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label style={{ fontWeight: 'bold', marginRight: '10px', fontSize: '18px' }}>Sort By:</label>
                <select
                    value={sortType}
                    onChange={(e) => setSortType(e.target.value)}
                    style={{
                        
                        padding: '12px', 
                        borderRadius: '5px', 
                        border: '1px solid #ccc', 
                        fontSize: '16px', 
                        width: '200px' 
                    }}
                >
                    <option value="latest">Date Modified (Latest First)</option>
                    <option value="oldest">Date Modified (Oldest First)</option>
                    <option value="a-z">Name (A - Z)</option>
                    <option value="z-a">Name (Z - A)</option>
                </select>
            </div>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {contactsToDisplay.map(contact => (
                    <div key={contact.id}  style={{ flex: '0 1 30%', padding: '15px', backgroundColor: '#e0f7fa', borderRadius: '8px',textAlign: 'left' }}>
                        <p>
                            <strong>Name(view full profile):</strong> 
                            <span onClick={() => handleContactClick(contact)} style={{ cursor: 'pointer', color: 'blue' }}>
                                {contact.name}
                            </span>
                        </p>
                        <p><strong>Phone:</strong> <a href={createCallLink(contact.phone)}>{contact.phone}</a></p>
                        <p><strong>Department:</strong> {contact.department}</p>
                        <p><strong>Domain:</strong> {contact.domain}</p>
                        <p><strong>Email:</strong> <a href={createGmailLink(contact.email)} target="_blank" rel="noopener noreferrer">
                {contact.email}
            </a></p>

                        {selectedContact === contact && (
                            <>
                                
                                <p><strong>Year:</strong> {contact.year}</p>
                                <p><strong>Address:</strong> <a href={createGoogleMapsLink(contact.address)} target="_blank" rel="noopener noreferrer">{contact.address}</a></p>
                                <p><strong>GitHub:</strong> <a href={contact.github} target="_blank" rel="noopener noreferrer">{getUsernameFromUrl(contact.github)}</a></p>
                            <p><strong>LinkedIn:</strong> <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">{getUsernameFromUrl(contact.linkedin)}</a></p>
                            <p><strong>LeetCode:</strong> <a href={contact.leetcode} target="_blank" rel="noopener noreferrer">{getUsernameFromUrl(contact.leetcode)}</a></p>
                            <p><strong>Hackerrank:</strong> <a href={contact.hackerrank} target="_blank" rel="noopener noreferrer">{getUsernameFromUrl(contact.hackerrank)}</a></p>
                                
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                {user.role === 'teacher' && (
                                    <button 
                                    onClick={() => {
                                        onDelete(contact._id);
                                    }} 
                                    style={{
                                        backgroundColor: '#dc3545', color: '#fff', padding: '5px 10px'
                                    }}
                                >
                                    Delete
                                </button>

)}

    {(user.role === 'teacher' || user.phone === contact.phone) && (
        <button 
            onClick={() => onEdit(contact)} 
            style={{ 
                backgroundColor: '#007bff', 
                color: 'white', 
                padding: '10px 20px', 
                borderRadius: '5px', 
                border: 'none',
                cursor: 'pointer'
            }}
        >
            Edit
        </button>
    )}
</div>
 </>
                        )}
                    </div>
                ))}
            </div>
            {user.role === 'teacher' && activeTab === 'view-all' && (
                <button onClick={onAdd} style={{
                    position: 'fixed', bottom: '20px', right: '20px', borderRadius: '50%', width: '60px', height: '60px',
                    backgroundColor: '#007bff', color: '#fff', fontSize: '24px'
                }}>+</button>
            )}
        </div>
    );
}

export default ContactList;