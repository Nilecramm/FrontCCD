import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react'; // Ajout de useState et useEffect
import Register from './pages/subscriber/Register';
import AdminDashboard from './pages/admin/Dashboard';
import AdminArticles from './pages/admin/Articles';
import AdminCampaigns from './pages/admin/Campaigns';
import AdminSubscribers from './pages/admin/Subscribers';
import Login from './pages/admin/Login';
import SubscriberBox from './pages/subscriber/SubscriberBox';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('admin_token');
    return token ? children : <Navigate to="/admin/login" />;
};

function App() {
    // État pour suivre la connexion en temps réel
    const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem('admin_token'));

    // Met à jour l'état si le token change (utile si on ouvre plusieurs onglets)
    useEffect(() => {
        setIsAdmin(!!localStorage.getItem('admin_token'));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        setIsAdmin(false); // Mise à jour instantanée de l'interface
        window.location.href = '/'; // Redirection vers l'accueil pour éviter le bug du proxy
    };

    return (
        <Router>
            <nav>
                <Link to="/">Inscription Client</Link> |
                <Link to="/ma-box">Ma Box</Link> |
                <Link to="/admin"> Dashboard</Link> |
                <Link to="/admin/subscribers">Abonnés</Link> |
                <Link to="/admin/articles"> Stock</Link> |
                <Link to="/admin/campaigns"> Campagnes</Link>
                {/* Utilisation de l'état isAdmin au lieu de localStorage directement */}
                {isAdmin && (
                    <button onClick={handleLogout} style={{ marginLeft: '20px' }}>Déconnexion</button>
                )}
            </nav>

            <Routes>
                <Route path="/" element={<Register />} />
                {/* On passe une fonction onLogin pour prévenir App du succès de la connexion */}
                <Route path="/admin/login" element={<Login onLogin={() => setIsAdmin(true)} />} />
                <Route path="/ma-box" element={<SubscriberBox />} />

                <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
                <Route path="/admin/articles" element={<PrivateRoute><AdminArticles /></PrivateRoute>} />
                <Route path="/admin/subscribers" element={<PrivateRoute><AdminSubscribers /></PrivateRoute>} />
                <Route path="/admin/campaigns" element={<PrivateRoute><AdminCampaigns /></PrivateRoute>} />
            </Routes>
        </Router>
    );
}
export default App;