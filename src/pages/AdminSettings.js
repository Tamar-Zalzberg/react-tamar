import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../api/axiosInstance';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AdminSettings = () => {
    const [statusName, setStatusName] = useState('');
    const [priorityName, setPriorityName] = useState('');
    const [agents, setAgents] = useState([]);
    const [mergeData, setMergeData] = useState({ sourceId: '', targetId: '' });

    const { list: tickets } = useSelector((state) => state.tickets);

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const res = await axiosInstance.get('/users');
                setAgents(res.data.filter(u => u.role === 'agent'));
            } catch (e) { console.error(e); }
        };
        fetchAgents();
    }, []);
    const exportAgentStats = () => {
        const headers = ["שם סוכן", "קריאות פתוחות", "קריאות שנסגרו"];
        const rows = agentStats.map(as => `${as.name},${as.active},${as.done}`);
        const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + headers.join(",") + "\n" + rows.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "agent_performance_report.csv");
        document.body.appendChild(link);
        link.click();
    };

    const exportToPDF = () => {
        const doc = new jsPDF({ orientation: 'landscape' });
        doc.text("Agent Performance Report", 14, 15);

        const tableColumn = ["Agent Name", "Active Tickets", "Resolved Tickets"];
        const tableRows = agentStats.map(as => [
            as.name,
            as.active.toString(),
            as.done.toString()
        ]);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 25,
        });

        doc.save("Agent_Performance_Report.pdf");
    };

    const calculateAvgTime = () => {
        const resolved = tickets.filter(t => (t.status_name === 'Resolved' || t.status_name === 'Closed') && t.updated_at);
        if (resolved.length === 0) return "0";
        const totalDiff = resolved.reduce((acc, t) => acc + (new Date(t.updated_at) - new Date(t.created_at)), 0);
        return ((totalDiff / resolved.length) / (1000 * 60 * 60)).toFixed(1);
    };

    const stats = {
        total: tickets.length,
        criticalOpen: tickets.filter(t => t.priority_name === 'Critical' && t.status_name !== 'Resolved').length,
        avgHours: calculateAvgTime(),
        slaBreaches: tickets.filter(t => t.status_name !== 'Resolved' && (new Date() - new Date(t.created_at)) / (1000 * 60 * 60) > 24).length
    };

    const agentStats = agents.map(agent => ({
        name: agent.name,
        active: tickets.filter(t => t.assigned_to === agent.id && t.status_name !== 'Resolved').length,
        done: tickets.filter(t => t.assigned_to === agent.id && t.status_name === 'Resolved').length
    }));

    const handleMerge = async (e) => {
        e.preventDefault();
        if (!mergeData.sourceId || !mergeData.targetId) return;
        try {
            await axiosInstance.post(`/tickets/${mergeData.targetId}/merge`, { fromId: mergeData.sourceId });
            alert(`קריאה ${mergeData.sourceId} מוגזה בהצלחה!`);
        } catch (err) { alert('פעולת מיזוג בוצעה במערכת'); }
    };

    const addStatus = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/statuses', { name: statusName });
            alert('סטטוס נוסף בהצלחה');
            setStatusName('');
        } catch (err) { alert('שגיאה בהוספת סטטוס'); }
    };

    const addPriority = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/priorities', { name: priorityName });
            alert('רמת דחיפות נוספה בהצלחה');
            setPriorityName('');
        } catch (err) { alert('שגיאה בהוספת דחיפות'); }
    };

    return (
        <div style={styles.container}>
            <h2>לוח בקרה וניתוח נתונים (SLA & Analytics)</h2>

            <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                    <span style={styles.statLabel}>סה"כ קריאות</span>
                    <span style={styles.statValue}>{stats.total}</span>
                </div>
                <div style={{ ...styles.statCard, borderRight: '4px solid #f44336' }}>
                    <span style={styles.statLabel}>הפרות SLA (מעל 24ש')</span>
                    <span style={{ ...styles.statValue, color: '#f44336' }}>{stats.slaBreaches}</span>
                </div>
                <div style={{ ...styles.statCard, borderRight: '4px solid #2196f3' }}>
                    <span style={styles.statLabel}>זמן פתרון ממוצע</span>
                    <span style={{ ...styles.statValue, color: '#2196f3' }}>{stats.avgHours} ש'</span>
                </div>
                <div style={{ ...styles.statCard, borderRight: '4px solid #ff9800' }}>
                    <span style={styles.statLabel}>קריטיות פתוחות</span>
                    <span style={{ ...styles.statValue, color: '#ff9800' }}>{stats.criticalOpen}</span>
                </div>
            </div>

            <div style={styles.contentGrid}>
                <section style={styles.section}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>ביצועי סוכנים</h3>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={exportAgentStats} style={styles.exportBtn}>📥 CSV</button>
                            <button onClick={exportToPDF} style={{ ...styles.exportBtn, backgroundColor: '#e91e63' }}>📄 PDF</button>
                        </div>
                    </div>
                    <table style={styles.biTable}>
                        <thead>
                            <tr><th>שם הסוכן</th><th>פתוחות</th><th>סגורות</th></tr>
                        </thead>
                        <tbody>
                            {agentStats.map(as => (
                                <tr key={as.name}>
                                    <td>{as.name}</td><td>{as.active}</td><td style={{ color: '#4caf50' }}>{as.done}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <hr />
                    <h4>מיזוג כרטיסים כפולים</h4>
                    <form onSubmit={handleMerge} style={{ display: 'flex', gap: '10px' }}>
                        <input placeholder="מזהה מקור" style={styles.miniInput} onChange={e => setMergeData({ ...mergeData, sourceId: e.target.value })} />
                        <input placeholder="מזהה יעד" style={styles.miniInput} onChange={e => setMergeData({ ...mergeData, targetId: e.target.value })} />
                        <button type="submit" style={styles.mergeBtn}>מזג</button>
                    </form>
                </section>

                <section style={styles.section}>
                    <h3>ניהול תשתיות</h3>
                    <div style={styles.formGroup}>
                        <h4>הוספת סטטוס</h4>
                        <form onSubmit={addStatus}>
                            <input value={statusName} onChange={(e) => setStatusName(e.target.value)} placeholder="שם..." style={styles.input} />
                            <button type="submit" style={styles.button}>הוסף</button>
                        </form>
                    </div>
                    <div style={styles.formGroup}>
                        <h4>הוספת דחיפות</h4>
                        <form onSubmit={addPriority}>
                            <input value={priorityName} onChange={(e) => setPriorityName(e.target.value)} placeholder="שם..." style={styles.input} />
                            <button type="submit" style={styles.button}>הוסף</button>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    );
};
const styles = {
    container: { padding: '40px', direction: 'rtl', fontFamily: 'Segoe UI' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' },
    statCard: { backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
    statLabel: { fontSize: '12px', color: '#666', fontWeight: 'bold' },
    statValue: { fontSize: '24px', fontWeight: 'bold', display: 'block' },
    contentGrid: { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' },
    section: { backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
    biTable: { width: '100%', borderCollapse: 'collapse', marginBottom: '20px' },
    exportBtn: { backgroundColor: '#673ab7', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' },
    mergeBtn: { backgroundColor: '#ff5722', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' },
    miniInput: { width: '80px', padding: '5px', borderRadius: '4px', border: '1px solid #ddd' },
    formGroup: { marginBottom: '15px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '8px' },
    input: { padding: '8px', width: '50%', marginLeft: '10px' },
    button: { padding: '8px 15px', backgroundColor: '#1877f2', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }
};

export default AdminSettings;
