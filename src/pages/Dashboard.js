import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        localStorage.removeItem('token');
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={styles.userInfo}>
                    <span style={styles.roleTag}>{formatRole(user?.role)}</span>
                    <h2 style={styles.userName}>שלום, {user?.name}</h2>
                </div>
                <button onClick={handleLogout} style={styles.logoutBtn}>התנתק</button>
            </header>

            <div style={styles.grid}>
                <div style={styles.card} onClick={() => navigate('/tickets')}>
                    <h3>📋 רשימת קריאות</h3>
                    <p>{user?.role === 'admin' ? 'צפייה בכל הקריאות במערכת' : 'צפייה בקריאות שלי'}</p>
                </div>

                {user?.role === 'customer' && (
                    <div style={{ ...styles.card, backgroundColor: '#e8f5e9' }} onClick={() => navigate('/create-ticket')}>
                        <h3>➕ פתיחת קריאה</h3>
                        <p>שלח פנייה חדשה לצוות התמיכה</p>
                    </div>
                )}

                {user?.role === 'admin' && (
                    <>
                        <div style={{ ...styles.card, backgroundColor: '#fff3e0' }} onClick={() => navigate('/admin/settings')}>
                            <h3>⚙️ ניהול מערכת</h3>
                            <p>הוספת סטטוסים ורמות דחיפות</p>
                        </div>
                        <div style={{ ...styles.card, backgroundColor: '#f3e5f5' }} onClick={() => navigate('/admin/users')}>
                            <h3>👥 ניהול משתמשים</h3>
                            <p>ניהול סוכנים ולקוחות</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const formatRole = (role) => {
    if (role === 'admin') return 'מנהל מערכת';
    if (role === 'agent') return 'סוכן תמיכה';
    return 'לקוח';
};

const styles = {
    container: { padding: '30px', direction: 'rtl', fontFamily: 'Segoe UI' },
    header: { display: 'flex', justifyContent: 'space-between', marginBottom: '40px', borderBottom: '1px solid #ddd', paddingBottom: '15px' },
    roleTag: { backgroundColor: '#1877f2', color: 'white', padding: '3px 10px', borderRadius: '12px', fontSize: '12px' },
    userName: { margin: '5px 0 0 0' },
    logoutBtn: { border: 'none', background: 'none', color: '#d32f2f', cursor: 'pointer', fontWeight: 'bold' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' },
    card: { padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.2s', backgroundColor: '#fff' },
};

export default Dashboard;