import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ onLogin }) {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (phone && role) {
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone, role }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                // Store the JWT token in localStorage
                localStorage.setItem('jwtToken', data.token);
                console.log('success');
                // Update state or navigate
                navigate('/');
            } else {
                setError(data.message || 'Login failed. Please check your credentials.');
            }
        } else {
            setError('All fields are required.');
        }
    };
    
    
    const handleRegisterRedirect = () => {
        navigate('/register');
    };

    return (
        <div className="login-container">
            <div className="image-section"></div>
            <div className="form-section">
                <form onSubmit={handleSubmit}>
                    <h2>Login</h2>
                    {error && <p className="error-message">{error}</p>}
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
                    <button type="submit">Login</button>
                </form>
                <p>Don't have an account?</p>
                <button onClick={handleRegisterRedirect} className="register-button">
                    Register
                </button>
            </div>
        </div>
    );
}

export default Login;
