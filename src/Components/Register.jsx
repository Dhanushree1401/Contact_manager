import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import './Register.css'; 

const Register = ({ onRegister }) => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student'); 
    const [error, setError] = useState('');
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUser = { phone, password, role };

        try {
            const response = await axios.post('http://localhost:5000/auth/register', newUser);
            if (response.status === 201) {
                onRegister(response.data); 
                navigate('/'); 
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <div className="image-section"></div> 
            <div className="form-section">
                <h2>Register</h2>
                {error && <p className="error">{error}</p>} 
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Phone Number" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                    </select>
                    <button type="submit">Register</button>
                </form>
                <p>
                    Already have an account? <a href="/" onClick={() => navigate('/')}>Login here</a>
                </p>
            </div>
        </div>
    );
};

export default Register;
