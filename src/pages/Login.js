import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../store/authSlice';
import axiosInstance from '../api/axiosInstance';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axiosInstance.post('/auth/login', { email, password });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            dispatch(loginSuccess({ user, token }));
            navigate('/dashboard');
        } catch (err) {
            console.error('Login Error:', err.response?.data);
            setError(err.response?.data?.message || 'פרטי התחברות שגויים');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h2 style={styles.title}>כניסה למערכת</h2>
                <p style={styles.subtitle}>Helpdesk API System</p>
                {error && <div style={styles.errorBox}>{error}</div>}
                <div style={styles.inputGroup}>
                    <input
                        type="email"
                        placeholder="אימייל (admin@example.com)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>
                <div style={styles.inputGroup}>
                    <input
                        type="password"
                        placeholder="סיסמה"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>
                <button
                    type="submit"
                    style={loading ? { ...styles.button, opacity: 0.7 } : styles.button}
                    disabled={loading}
                >
                    {loading ? 'מתחבר...' : 'התחברות'}
                </button>
            </form>
        </div>
    );
};
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5',
        fontFamily: 'Arial, sans-serif'
    },
    form: {
        padding: '40px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
    },
    title: { margin: '0 0 10px 0', color: '#1c1e21' },
    subtitle: { margin: '0 0 30px 0', color: '#65676b' },
    inputGroup: { marginBottom: '15px' },
    input: {
        width: '100%',
        padding: '12px',
        borderRadius: '6px',
        border: '1px solid #ddd',
        boxSizing: 'border-box',
        fontSize: '16px',
        textAlign: 'right'
    },
    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#1877f2',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '18px',
        fontWeight: 'bold'
    },
    errorBox: {
        backgroundColor: '#ffebee',
        color: '#c62828',
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '20px',
        fontSize: '14px'
    }
};

export default Login;