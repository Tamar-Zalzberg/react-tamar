import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'customer' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            await axiosInstance.post('/auth/register', formData);
            setSuccess('ההרשמה בוצעה בהצלחה! עובר להתחברות...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'שגיאה בתהליך ההרשמה');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h2 style={styles.title}>יצירת חשבון</h2>
                <p style={styles.subtitle}>הצטרף למערכת ה-Helpdesk</p>

                {error && <div style={styles.errorBox}>{error}</div>}
                {success && <div style={styles.successBox}>{success}</div>}

                <div style={styles.inputGroup}>
                    <input
                        type="text"
                        placeholder="שם מלא"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        style={styles.input}
                        required
                    />
                </div>
                <div style={styles.inputGroup}>
                    <input
                        type="email"
                        placeholder="אימייל"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={styles.input}
                        required
                    />
                </div>
                <div style={styles.inputGroup}>
                    <input
                        type="password"
                        placeholder="סיסמה"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        style={styles.input}
                        required
                    />
                </div>
                <button
                    type="submit"
                    style={loading ? { ...styles.button, opacity: 0.7 } : styles.button}
                    disabled={loading}
                >
                    {loading ? 'מבצע הרשמה...' : 'הרשמה'}
                </button>

                <p style={styles.toggleText}>
                    כבר רשום במערכת? <span onClick={() => navigate('/login')} style={styles.link}>התחבר כאן</span>
                </p>
            </form>
        </div>
    );
};

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5', fontFamily: 'Arial, sans-serif' },
    form: { padding: '40px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' },
    title: { margin: '0 0 10px 0', color: '#1c1e21' },
    subtitle: { margin: '0 0 30px 0', color: '#65676b' },
    inputGroup: { marginBottom: '15px' },
    input: { width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box', fontSize: '16px', textAlign: 'right' },
    button: { width: '100%', padding: '12px', backgroundColor: '#42b72a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' },
    errorBox: { backgroundColor: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '4px', marginBottom: '20px', fontSize: '14px' },
    successBox: { backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: '4px', marginBottom: '20px', fontSize: '14px' },
    toggleText: { marginTop: '20px', fontSize: '14px', color: '#65676b' },
    link: { color: '#1877f2', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }
};

export default Register;