import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const CreateTicket = () => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('1'); // ברירת מחדל: Low
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({}); // ולידציה בצד לקוח [cite: 92]
  const navigate = useNavigate();

  // פונקציית בדיקת תקינות שדות [cite: 93]
  const validate = () => {
    let tempErrors = {};
    if (!subject.trim()) tempErrors.subject = "חובה להזין נושא לקריאה [cite: 88, 94]";
    if (!description.trim()) tempErrors.description = "חובה להזין תיאור מפורט [cite: 89, 94]";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return; // עצירה אם הולדיציה נכשלה [cite: 92]

    setLoading(true);
    setMessage('');

    try {
      const response = await axiosInstance.post('/tickets', {
        subject: subject,
        description: description,
        priority_id: parseInt(priority), // שליחת עדיפות שנבחרה 
        status_id: 1, // סטטוס ראשוני: Open
        assigned_to: null
      });

      setMessage('הקריאה נפתחה בהצלחה! [cite: 99]');
      setTimeout(() => navigate('/tickets'), 1500); // חזרה לרשימה לאחר הצלחה [cite: 100]

    } catch (err) {
      console.error('Error:', err.response);
      setMessage(err.response?.data?.message || 'שגיאה בפתיחת הקריאה. [cite: 119]');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>פתיחת קריאה חדשה</h2>

        {message && (
          <div style={{
            ...styles.info,
            backgroundColor: message.includes('שגיאה') ? '#ffebee' : '#e8f5e9',
            color: message.includes('שגיאה') ? '#c62828' : '#2e7d32'
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.field}>
            <label style={styles.label}>נושא:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                if (errors.subject) setErrors({...errors, subject: null});
              }}
              style={{...styles.input, borderColor: errors.subject ? '#f44336' : '#ddd'}}
              placeholder="מה הבעיה?"
            />
            {errors.subject && <span style={styles.errorText}>{errors.subject}</span>}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>רמת דחיפות: </label>
            <select 
              value={priority} 
              onChange={(e) => setPriority(e.target.value)}
              style={styles.input}
            >
              <option value="1">נמוכה (Low)</option>
              <option value="2">בינונית (Medium)</option>
              <option value="3">גבוהה (High)</option>
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>תיאור:</label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors({...errors, description: null});
              }}
              style={{...styles.input, height: '120px', borderColor: errors.description ? '#f44336' : '#ddd'}}
              placeholder="פרט כאן את הבעיה..."
            />
            {errors.description && <span style={styles.errorText}>{errors.description}</span>}
          </div>

          <div style={styles.actions}>
            <button type="button" onClick={() => navigate('/dashboard')} style={styles.cancelBtn}>ביטול</button>
            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? 'שולח... [cite: 118]' : 'שלח קריאה [cite: 116]'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', padding: '40px', backgroundColor: '#f0f2f5', minHeight: '90vh' },
  card: { backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '100%', maxWidth: '500px', textAlign: 'right', direction: 'rtl' },
  title: { textAlign: 'center', marginBottom: '25px', color: '#1c1e21' },
  field: { marginBottom: '20px', display: 'flex', flexDirection: 'column' },
  label: { marginBottom: '8px', fontWeight: 'bold' },
  input: { width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box', fontSize: '16px' },
  errorText: { color: '#f44336', fontSize: '12px', marginTop: '5px' },
  actions: { display: 'flex', justifyContent: 'space-between', marginTop: '30px' },
  submitBtn: { backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  cancelBtn: { backgroundColor: '#f0f2f5', color: '#65676b', border: 'none', padding: '12px 25px', borderRadius: '6px', cursor: 'pointer' },
  info: { padding: '12px', borderRadius: '6px', marginBottom: '20px', textAlign: 'center', fontSize: '14px' }
};

export default CreateTicket;