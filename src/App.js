import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// הוסר ה-Socket כדי למנוע קריסות מול השרת הקיים

// ייבוא הדפים
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TicketList from './pages/TicketList';
import CreateTicket from './pages/CreateTicket';
import TicketDetails from './pages/TicketDetails';
import AdminSettings from './pages/AdminSettings';
import AdminUsers from './pages/AdminUsers';

/**
 * קומפוננטה להגנה על נתיבים (Route Guard)
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const NotFound = () => (
  <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Arial' }}>
    <h1 style={{ fontSize: '72px', color: '#ccc' }}>404</h1>
    <h2>הדף המבוקש לא נמצא</h2>
    <a href="/" style={{ color: '#007bff', textDecoration: 'none' }}>חזרה למסך הבית</a>
  </div>
);

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        {/* נתיבים ציבוריים */}
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate replace to="/dashboard" />}
        />
        <Route
          path="/register"
          element={!isAuthenticated ? <Register /> : <Navigate replace to="/dashboard" />}
        />

        {/* נתיבים מוגנים (Admin, Agent, Customer) */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />
        <Route
          path="/tickets"
          element={<ProtectedRoute><TicketList /></ProtectedRoute>}
        />
        <Route
          path="/tickets/:id"
          element={<ProtectedRoute><TicketDetails /></ProtectedRoute>}
        />

        {/* נתיב לפתיחת טיקט - ללקוח בלבד */}
        <Route
          path="/create-ticket"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CreateTicket />
            </ProtectedRoute>
          }
        />

        {/* נתיבים למנהל בלבד */}
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        {/* ניתוב ברירת מחדל */}
        <Route
          path="/"
          element={<Navigate replace to={isAuthenticated ? "/dashboard" : "/login"} />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;