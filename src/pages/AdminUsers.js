import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('customers'); // customers | agents | admins
  const navigate = useNavigate();
  
  const [showAddForm, setShowAddForm] = useState(false);
  // שיניתי מ-newAgent ל-newUser כדי שיתאים גם למנהלים
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'agent' });

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error('שגיאה בטעינת משתמשים');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/users', newUser);
      alert('המשתמש נוסף בהצלחה למערכת!');
      setShowAddForm(false);
      // איפוס הטופס
      setNewUser({ name: '', email: '', password: '', role: 'agent' });
      fetchUsers();
    } catch (err) {
      alert('שגיאה בהוספת משתמש (אולי האימייל כבר קיים?)');
    }
  };

  // חלוקה ל-3 קבוצות
  const customers = users.filter(u => u.role === 'customer');
  const agents = users.filter(u => u.role === 'agent');
  const admins = users.filter(u => u.role === 'admin');

  if (loading) return <div style={styles.centered}>טוען נתוני משתמשים...</div>;

  return (
    <div style={styles.container}>
      <h2>ניהול משתמשי המערכת</h2>
      
      <div style={styles.tabContainer}>
        <button 
          style={activeTab === 'customers' ? styles.activeTab : styles.tab} 
          onClick={() => setActiveTab('customers')}
        >
          ניהול לקוחות
        </button>
        <button 
          style={activeTab === 'agents' ? styles.activeTab : styles.tab} 
          onClick={() => setActiveTab('agents')}
        >
          ניהול סוכנים
        </button>
        {/* טאב חדש למנהלים */}
        <button 
          style={activeTab === 'admins' ? styles.activeTab : styles.tab} 
          onClick={() => setActiveTab('admins')}
        >
          ניהול מנהלים
        </button>
      </div>

      {/* טופס הוספה - מופיע רק אם אנחנו בלשונית סוכנים או מנהלים */}
      {(activeTab === 'agents' || activeTab === 'admins') && (
        <div style={{ marginBottom: '20px' }}>
          <button style={styles.addBtn} onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'ביטול' : '+ הוספת איש צוות חדש'}
          </button>
          
          {showAddForm && (
            <form onSubmit={handleAddUser} style={styles.formCard}>
              <h4>הוספת משתמש מערכת חדש</h4>
              <div style={styles.inputGroup}>
                <select 
                  style={styles.selectInput}
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                >
                    <option value="agent">סוכן תמיכה (Agent)</option>
                    <option value="admin">מנהל מערכת (Admin)</option>
                </select>

                <input 
                  placeholder="שם מלא" 
                  value={newUser.name} 
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})} 
                  required 
                  style={styles.input} 
                />
                <input 
                  type="email" 
                  placeholder="אימייל" 
                  value={newUser.email} 
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})} 
                  required 
                  style={styles.input} 
                />
                <input 
                  type="password" 
                  placeholder="סיסמה" 
                  value={newUser.password} 
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})} 
                  required 
                  style={styles.input} 
                />
                <button type="submit" style={styles.saveBtn}>שמור משתמש</button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* טבלה 1: לקוחות */}
      {activeTab === 'customers' && (
        <section>
          <h3>רשימת לקוחות ({customers.length})</h3>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th>שם הלקוח</th>
                <th>אימייל</th>
                <th>סטטוס</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id} style={styles.tr}>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.is_active ? '✅ פעיל' : '❌ חסום'}</td>
                  <td>
                    <button 
                      style={styles.infoBtn} 
                      onClick={() => navigate(`/tickets?customerId=${c.id}`)}
                    >
                      צפה בפניות
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* טבלה 2: סוכנים */}
      {activeTab === 'agents' && (
        <section>
          <h3>רשימת סוכנים פעילים ({agents.length})</h3>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th>שם הסוכן</th>
                <th>אימייל</th>
                <th>תפקיד</th>
                <th>מזהה מערכת</th>
              </tr>
            </thead>
            <tbody>
              {agents.map(a => (
                <tr key={a.id} style={styles.tr}>
                  <td>{a.name}</td>
                  <td>{a.email}</td>
                  <td>סוכן תמיכה</td>
                  <td>ID: {a.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* טבלה 3: מנהלים (חדש) */}
      {activeTab === 'admins' && (
        <section>
          <h3>רשימת מנהלי מערכת ({admins.length})</h3>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th>שם המנהל</th>
                <th>אימייל</th>
                <th>תפקיד</th>
                <th>מזהה מערכת</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(a => (
                <tr key={a.id} style={styles.tr}>
                  <td>{a.name}</td>
                  <td>{a.email}</td>
                  <td style={{fontWeight: 'bold', color: '#d32f2f'}}>מנהל מערכת (Admin)</td>
                  <td>ID: {a.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

    </div>
  );
};

const styles = {
  container: { padding: '40px', direction: 'rtl', fontFamily: 'Arial' },
  tabContainer: { display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' },
  tab: { padding: '10px 20px', cursor: 'pointer', border: 'none', background: '#f0f0f0', borderRadius: '5px' },
  activeTab: { padding: '10px 20px', cursor: 'pointer', border: 'none', background: '#1877f2', color: 'white', borderRadius: '5px' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  thRow: { backgroundColor: '#f8f9fa', textAlign: 'right', borderBottom: '2px solid #dee2e6', padding: '12px' },
  tr: { borderBottom: '1px solid #eee', height: '45px' },
  infoBtn: { padding: '5px 10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  addBtn: { padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  formCard: { backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', marginTop: '15px' },
  inputGroup: { display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' },
  input: { padding: '10px', borderRadius: '5px', border: '1px solid #ccc', minWidth: '150px' },
  selectInput: { padding: '10px', borderRadius: '5px', border: '1px solid #ccc', minWidth: '150px', cursor: 'pointer', backgroundColor: 'white' },
  saveBtn: { padding: '10px 20px', backgroundColor: '#1877f2', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  centered: { textAlign: 'center', marginTop: '50px' }
};

export default AdminUsers;