import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTickets } from '../store/ticketSlice';

const TicketList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [agentFilter, setAgentFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const queryParams = new URLSearchParams(location.search);
    const filterCustomerId = queryParams.get('customerId');

    const { list: allTickets, loading, error } = useSelector((state) => state.tickets);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchTickets());
    }, [dispatch]);

    // --- לוגיקת סינון מעודכנת ---
    const tickets = allTickets.filter(t => {
        // 1. בדיקת הרשאות קשיחה לפי סוג משתמש (התיקון הקריטי)
        if (user?.role === 'customer' && t.created_by !== user.id) {
            return false; // לקוח רואה אך ורק את הטיקטים שיצר
        }
        if (user?.role === 'agent' && t.assigned_to !== user.id) {
            return false; // סוכן רואה אך ורק את מה שהוקצה לו
        }
        // מנהל (Admin) רואה הכל כברירת מחדל, אלא אם סינן למטה

        // 2. סינונים שהמשתמש בחר בממשק
        const matchesCustomerParam = filterCustomerId ? t.created_by === parseInt(filterCustomerId) : true;
        const matchesSearch = t.subject.toLowerCase().includes(searchTerm.toLowerCase()) || t.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter ? t.status_name === statusFilter : true;
        const matchesPriority = priorityFilter ? t.priority_name === priorityFilter : true;
        const matchesAgent = agentFilter ? t.assigned_to_name === agentFilter : true;
        const ticketDate = new Date(t.created_at).setHours(0, 0, 0, 0);
        const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
        const end = endDate ? new Date(endDate).setHours(0, 0, 0, 0) : null;
        const matchesDate = (!start || ticketDate >= start) && (!end || ticketDate <= end);
        return matchesCustomerParam && matchesSearch && matchesStatus && matchesPriority && matchesAgent && matchesDate;
    });
    const uniqueAgents = [...new Set(allTickets.map(t => t.assigned_to_name).filter(Boolean))];
    const uniquePriorities = [...new Set(allTickets.map(t => t.priority_name).filter(Boolean))];
    const getRoleColor = (role) => {
        switch (role?.toLowerCase()) {
            case 'admin': return '#d32f2f';
            case 'agent': return '#1976d2';
            default: return '#388e3c';
        }
    };
    if (loading) return (
        <div style={styles.centered}>
            <div className="spinner" style={styles.spinner}></div>
            <p>טוען קריאות שירות מהשרת...</p>
        </div>
    );
    if (error) return (
        <div style={{ ...styles.centered, color: '#c62828', backgroundColor: '#ffebee', padding: '20px', borderRadius: '8px' }}>
            <strong>שגיאה בטעינה:</strong> {error}
            <button onClick={() => dispatch(fetchTickets())} style={styles.resetBtn}>נסה שוב</button>
        </div>
    );
    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={styles.headerTop}>
                    <div style={styles.headerSide}>
                        <h2 style={styles.title}>ניהול קריאות שירות</h2>
                        {filterCustomerId && (
                            <button onClick={() => navigate('/tickets')} style={styles.clearFilterBtn}>חזרה להכל</button>
                        )}
                    </div>

                    <div style={styles.headerCenter}>
                        שלום <strong>{user?.name}</strong>, מחובר כ-{user?.role === 'customer' ? 'לקוח' : user?.role === 'agent' ? 'סוכן' : 'מנהל'}
                    </div>

                    <div style={styles.headerSideLeft}>
                        <div
                            style={{ ...styles.roleCircle, backgroundColor: getRoleColor(user?.role) }}
                            title={`מחובר בתור: ${user?.role}`}
                        >
                            {user?.role?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>
                <div style={styles.filterSection}>
                    <div style={styles.filterRow}>
                        <input
                            type="text"
                            placeholder="חיפוש לפי נושא או תיאור..."
                            style={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select style={styles.filterSelect} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="">כל הסטטוסים</option>
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Closed">Closed</option>
                        </select>
                        <select style={styles.filterSelect} value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                            <option value="">כל רמות העדיפות</option>
                            {uniquePriorities.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <div style={styles.filterRow}>
                        <div style={styles.dateGroup}>
                            <label style={styles.dateLabel}>מתאריך:</label>
                            <input type="date" style={styles.dateInput} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                        <div style={styles.dateGroup}>
                            <label style={styles.dateLabel}>עד תאריך:</label>
                            <input type="date" style={styles.dateInput} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                        <button
                            onClick={() => { setSearchTerm(''); setStatusFilter(''); setPriorityFilter(''); setAgentFilter(''); setStartDate(''); setEndDate(''); }}
                            style={styles.resetBtn}
                        >
                            איפוס סינונים
                        </button>
                    </div>
                </div>
            </header>
            {tickets.length === 0 ? (
                <div style={styles.centered}>
                    <p>לא נמצאו קריאות שירות התואמות את החיפוש.</p>
                    <button onClick={() => navigate('/tickets/new')} style={styles.viewBtn}>פתח קריאה חדשה</button>
                </div>
            ) : (
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.thRow}>
                            <th>מזהה</th>
                            <th>נושא</th>
                            <th>סטטוס</th>
                            <th>עדיפות</th>
                            <th>תאריך יצירה</th>
                            <th>נוצר ע"י</th>
                            <th>סוכן מטפל</th>
                            <th>פעולות</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map((ticket) => {
                            const hoursOpen = (new Date() - new Date(ticket.created_at)) / (1000 * 60 * 60);
                            const isAging = ticket.status_name !== 'Resolved' && ticket.status_name !== 'Closed' && hoursOpen > 48;
                            return (
                                <tr key={ticket.id} style={{ ...styles.tr, backgroundColor: isAging ? '#fff9c4' : 'transparent' }}>
                                    <td>#{ticket.id}</td>
                                    <td style={{ fontWeight: '600' }}>
                                        {isAging && <span title="קריאה פתוחה מעל 48 שעות" style={{ marginLeft: '5px' }}>⏰</span>}
                                        {ticket.subject}
                                    </td>
                                    <td>
                                        <span style={{ ...styles.badge, ...getStatusStyle(ticket.status_name) }}>
                                            {ticket.status_name}
                                        </span>
                                    </td>
                                    <td>
                                        <span style={{ color: ticket.priority_name === 'Critical' ? 'red' : '#444' }}>
                                            {ticket.priority_name || 'Normal'}
                                        </span>
                                    </td>
                                    <td>{new Date(ticket.created_at).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                                    <td>{ticket.created_by_name}</td>
                                    <td>
                                        {ticket.assigned_to_name ? (
                                            <span style={styles.agentInfo}>👤 {ticket.assigned_to_name}</span>
                                        ) : (
                                            <span style={styles.unassignedBadge}>טרם הוקצה</span>
                                        )}
                                    </td>
                                    <td>
                                        <button onClick={() => navigate(`/tickets/${ticket.id}`)} style={styles.viewBtn}>
                                            {user?.role === 'admin' ? 'ניהול' : 'צפייה'}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
};

const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
        case 'open': return { backgroundColor: '#e3f2fd', color: '#1565c0' };
        case 'in progress': return { backgroundColor: '#fff3e0', color: '#ef6c00' };
        case 'resolved': return { backgroundColor: '#e8f5e9', color: '#2e7d32' };
        case 'closed': return { backgroundColor: '#eceff1', color: '#455a64' };
        default: return { backgroundColor: '#f5f5f5', color: '#616161' };
    }
};

const styles = {
    container: { padding: '40px', maxWidth: '1300px', margin: '0 auto', direction: 'rtl', fontFamily: 'Segoe UI, Tahoma, sans-serif' },
    header: { marginBottom: '30px', borderBottom: '2px solid #eee', paddingBottom: '20px' },
    headerTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    headerSide: { flex: 1, display: 'flex', alignItems: 'center', gap: '15px' },
    headerCenter: { flex: 2, textAlign: 'center', fontSize: '18px', color: '#555', backgroundColor: '#f0f4f8', padding: '10px', borderRadius: '20px' },
    headerSideLeft: { flex: 1, display: 'flex', justifyContent: 'flex-end' },
    roleCircle: { width: '45px', height: '45px', borderRadius: '50%', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' },
    title: { margin: 0, color: '#2c3e50', fontSize: '28px' },
    filterSection: { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #eee' },
    filterRow: { display: 'flex', gap: '15px', marginBottom: '12px', alignItems: 'center', flexWrap: 'wrap' },
    searchInput: { padding: '10px', borderRadius: '8px', border: '1px solid #ddd', flex: '2', minWidth: '200px' },
    filterSelect: { padding: '10px', borderRadius: '8px', border: '1px solid #ddd', flex: '1', cursor: 'pointer' },
    dateGroup: { display: 'flex', alignItems: 'center', gap: '8px' },
    dateLabel: { fontSize: '14px', color: '#666', fontWeight: '500' },
    dateInput: { padding: '8px', borderRadius: '8px', border: '1px solid #ddd' },
    resetBtn: { padding: '10px 20px', backgroundColor: '#f8f9fa', border: '1px solid #ccc', borderRadius: '8px', cursor: 'pointer', transition: '0.3s' },
    table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', borderRadius: '12px', overflow: 'hidden' },
    thRow: { backgroundColor: '#f1f3f5', borderBottom: '2px solid #dee2e6', textAlign: 'right', padding: '15px' },
    tr: { borderBottom: '1px solid #eee', height: '60px' },
    badge: { padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' },
    agentInfo: { color: '#2e7d32', fontWeight: '600' },
    unassignedBadge: { color: '#d32f2f', fontStyle: 'italic', fontSize: '13px' },
    viewBtn: { backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
    clearFilterBtn: { backgroundColor: '#6c757d', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' },
    centered: { textAlign: 'center', marginTop: '100px', fontSize: '20px', color: '#666', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' },
    spinner: { width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', animation: 'spin 2s linear infinite' }
};

export default TicketList;