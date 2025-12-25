import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../api/axiosInstance';

const TicketDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [ticket, setTicket] = useState(null);
    const [comments, setComments] = useState([]);
    const [agents, setAgents] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const fetchData = async () => {
        try {
            setLoading(true);
            setError('');
            const [ticketRes, commentsRes] = await Promise.all([
                axiosInstance.get(`/tickets/${id}`),
                axiosInstance.get(`/tickets/${id}/comments`)
            ]);
            setTicket(ticketRes.data);
            setComments(commentsRes.data);
            if (user?.role === 'admin') {
                try {
                    const usersRes = await axiosInstance.get('/users');
                    const onlyAgents = usersRes.data.filter(u => u.role === 'agent');
                    setAgents(onlyAgents);
                } catch (agentErr) {
                    console.warn('לא הצלחנו לטעון את רשימת הסוכנים.');
                }
            }
        } catch (err) {
            setError(`לא ניתן לטעון את פרטי הקריאה.`);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, [id]);
    const handleStatusChange = async (newStatusId) => {
        if (!newStatusId) return;
        try {
            await axiosInstance.patch(`/tickets/${id}`, {
                status_id: parseInt(newStatusId)
            });
            alert('הסטטוס עודכן בהצלחה');
            fetchData();
        } catch (err) {
            alert('שגיאה בעדכון הסטטוס');
        }
    };
    const handleAssignAgent = async (agentId) => {
        if (!agentId) return;
        try {
            await axiosInstance.patch(`/tickets/${id}`, {
                assigned_to: parseInt(agentId)
            });
            alert('הקריאה הוקצתה לסוכן בהצלחה');
            fetchData();
        } catch (err) {
            alert('שגיאה בהקצאת הסוכן');
        }
    };
    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            await axiosInstance.post(`/tickets/${id}/comments`, { content: newComment });
            setNewComment('');
            fetchData();
        } catch (err) {
            alert('שגיאה בשליחת התגובה');
        }
    };
    if (loading) return <div style={styles.centered}>טוען נתונים...</div>;
    if (error) return <div style={{ ...styles.centered, color: 'red' }}>{error}</div>;
    if (!ticket) return <div style={styles.centered}>הקריאה לא נמצאה.</div>;
    return (
        <div style={styles.container}>
            <button onClick={() => navigate('/tickets')} style={styles.backBtn}>
                &rarr; חזרה לרשימה
            </button>
            <div style={styles.card}>
                <div style={styles.cardHeader}>
                    <h2 style={styles.subject}>{ticket.subject}</h2>
                    <span style={{ ...styles.badge, ...getStatusStyle(ticket.status_name) }}>
                        {ticket.status_name}
                    </span>
                </div>
                <hr style={styles.hr} />
                <p style={styles.description}>{ticket.description}</p>
                {(user?.role === 'admin' || user?.role === 'agent') && (
                    <div style={styles.adminPanel}>
                        <h4 style={{ margin: '0 0 10px 0' }}>ניהול קריאה (צוות בלבד):</h4>
                        <div style={styles.adminActions}>
                            <select onChange={(e) => handleStatusChange(e.target.value)} style={styles.select}>
                                <option value="">עדכן סטטוס...</option>
                                <option value="1">Open</option>
                                <option value="2">In Progress</option>
                                <option value="3">Resolved</option>
                                <option value="4">Closed</option>
                            </select>
                            {user?.role === 'admin' && (
                                <select onChange={(e) => handleAssignAgent(e.target.value)} style={styles.select}>
                                    <option value="">הקצה לסוכן...</option>
                                    {agents.map(agent => (
                                        <option key={agent.id} value={agent.id}>{agent.name}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <div style={styles.commentsContainer}>
                <h3>תגובות ועדכונים</h3>
                <div style={styles.commentList}>
                    {comments.map((comment) => (
                        <div key={comment.id} style={styles.commentBox}>
                            <div style={styles.commentHeader}>
                                <span style={styles.commentUser}>
                                    {comment.user_name || comment.author_name || comment.author?.name || "משתמש מערכת"}
                                </span>
                                <span style={styles.commentDate}>{new Date(comment.created_at).toLocaleString('he-IL')}</span>
                            </div>
                            <p style={styles.commentText}>
                                {comment.comment_text || comment.content || comment.text || "אין תוכן"}
                            </p>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleAddComment} style={styles.form}>
                    <textarea
                        style={styles.textarea}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="הוסף תגובה..."
                        required
                    />
                    <button type="submit" style={styles.submitBtn}>שלח תגובה</button>
                </form>
            </div>
        </div>
    );
};

const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
        case 'open': return { backgroundColor: '#e1f5fe', color: '#01579b' };
        case 'in progress': return { backgroundColor: '#fff3e0', color: '#e65100' };
        case 'resolved': return { backgroundColor: '#e8f5e9', color: '#2e7d32' };
        default: return { backgroundColor: '#f5f5f5', color: '#616161' };
    }
};

const styles = {
    container: { padding: '40px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial', direction: 'rtl' },
    backBtn: { marginBottom: '20px', padding: '10px', cursor: 'pointer', border: 'none', borderRadius: '5px' },
    card: { backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '30px' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    subject: { margin: 0 },
    badge: { padding: '5px 12px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' },
    hr: { margin: '15px 0', border: 'none', borderTop: '1px solid #eee' },
    description: { fontSize: '17px', color: '#444', marginBottom: '20px' },
    adminPanel: { backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #dee2e6' },
    adminActions: { display: 'flex', gap: '15px' },
    select: { padding: '8px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: '#fff' },
    commentsContainer: { backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '12px' },
    commentBox: { backgroundColor: '#fff', padding: '15px', borderRadius: '8px', marginBottom: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    commentHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
    commentUser: { fontWeight: 'bold', fontSize: '15px', color: '#333' },
    commentDate: { fontSize: '12px', color: '#999' },
    commentText: { margin: 0, fontSize: '15px', color: '#555', lineHeight: '1.5' },
    form: { display: 'flex', flexDirection: 'column', gap: '10px' },
    textarea: { padding: '10px', borderRadius: '5px', border: '1px solid #ddd', height: '80px', resize: 'none' },
    submitBtn: { padding: '10px', backgroundColor: '#1877f2', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
    centered: { textAlign: 'center', marginTop: '100px' }
};

export default TicketDetails;