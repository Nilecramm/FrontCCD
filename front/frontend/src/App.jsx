import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Register from './pages/subscriber/Register';
import AdminDashboard from './pages/admin/Dashboard';
import AdminArticles from './pages/admin/Articles';
import AdminCampaigns from './pages/admin/Campaigns';
import AdminSubscribers from './pages/admin/Subscribers';
import Login from './pages/admin/Login';
import SubscriberBox from './pages/subscriber/SubscriberBox';
import logo from './assets/logo.png';

import { useNavigate } from 'react-router-dom';

// Composant pour protéger les routes
const PrivateRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('admin_token');
    return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

// Composant pour le bouton de connexion/déconnexion avec style optimisé
const LoginLogoutButton = ({ isAdmin, setIsAdmin }) => {
    const navigate = useNavigate();

    const handleAction = () => {
        if (isAdmin) {
            localStorage.removeItem('admin_token');
            setIsAdmin(false);
            navigate('/admin/login');
        } else {
            navigate('/admin/login');
        }
    };

    return (
        <button onClick={handleAction} className="logout-btn">
            {isAdmin ? 'Déconnexion' : 'Connexion Admin'}
        </button>
    );
};

function App() {
    const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem('admin_token'));

    return (
        <Router>
            <nav className="main-nav">
                <div className="nav-links">
                    <Link to="/" className="logo-link">
                        <img src={logo} alt="ToyBoxing Logo" className="nav-logo" />
                    </Link>
                    <Link to="/">Inscription</Link>
                    <Link to="/ma-box">Ma Box</Link>
                    {isAdmin && (
                        <>
                            <span className="nav-separator">|</span>
                            <Link to="/admin">Dashboard</Link>
                            <Link to="/admin/subscribers">Abonnés</Link>
                            <Link to="/admin/articles">Stock</Link>
                            <Link to="/admin/campaigns">Campagnes</Link>
                        </>
                    )}
                </div>
                <LoginLogoutButton isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
            </nav>

            <Routes>
                <Route path="/" element={<Register />} />
                <Route path="/admin/login" element={<Login onLogin={() => setIsAdmin(true)} />} />
                <Route path="/ma-box" element={<SubscriberBox />} />

                {/* Routes Admin Protégées */}
                <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
                <Route path="/admin/articles" element={<PrivateRoute><AdminArticles /></PrivateRoute>} />
                <Route path="/admin/subscribers" element={<PrivateRoute><AdminSubscribers /></PrivateRoute>} />
                <Route path="/admin/campaigns" element={<PrivateRoute><AdminCampaigns /></PrivateRoute>} />
            </Routes>
        </Router>
    );
}

export default App;