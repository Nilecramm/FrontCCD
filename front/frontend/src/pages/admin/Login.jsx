import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../api';

// Ajout de la prop onLogin
export default function Login({ onLogin }) {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await adminAPI.login(credentials.username, credentials.password);
            localStorage.setItem('admin_token', res.data.token);

            // On prévient le composant App pour afficher le bouton immédiatement
            if (onLogin) onLogin();

            navigate('/admin');
        } catch (err) {
            alert("Identifiants incorrects (admin / toyboxing2026)");
        }
    };

    return (
        <div className="login-page-container">
            <div className="registration-form login-card">
                <h2>Connexion Gestionnaire</h2>
                <p className="login-subtitle">Accédez au panneau d'administration</p>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="field">
                        <label>Nom d'utilisateur</label>
                        <input
                            type="text"
                            placeholder="Admin"
                            onChange={e => setCredentials({ ...credentials, username: e.target.value })}
                            required
                        />
                    </div>

                    <div className="field">
                        <label>Mot de passe</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                            required
                        />
                    </div>

                    <button type="submit" className="submit-btn" style={{ marginTop: '10px' }}>
                        Se connecter
                    </button>
                </form>
            </div>

            <style>{`
                :root { 
                    --primary: #646cff;
                    --primary-light: #8b91ff;
                    --glass: rgba(255, 255, 255, 0.7);
                    --text-black: #000000;
                    --light-gray: #f4f4f4;
                }

                .login-page-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 80vh;
                    padding: 20px;
                }

                .login-card {
                    width: 100%;
                    max-width: 400px;
                    text-align: center;
                }

                .login-card h2 {
                    margin-bottom: 10px;
                    color: var(--text-black);
                }

                .login-subtitle {
                    color: var(--primary);
                    margin-bottom: 30px;
                    font-size: 0.9em;
                    opacity: 0.8;
                }

                .login-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .field {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    text-align: left;
                }

                label {
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--text-black);
                }

                input {
                    padding: 12px;
                    border-radius: 8px;
                    border: 1px solid rgba(0,0,0,0.1);
                    background: var(--light-gray);
                    color: var(--text-black);
                    font-size: 16px;
                    width: 100%;
                    box-sizing: border-box;
                }

                input:focus {
                    outline: 2px solid var(--primary);
                    background: white;
                }

                .submit-btn {
                    padding: 15px;
                    border-radius: 8px;
                    background: linear-gradient(135deg, var(--primary), var(--primary-light));
                    color: white;
                    border: none;
                    font-weight: bold;
                    cursor: pointer;
                    transition: transform 0.1s, opacity 0.2s;
                }

                .submit-btn:hover {
                    opacity: 0.9;
                    transform: translateY(-1px);
                }

                .registration-form {
                    padding: 35px;
                    background: var(--glass);
                    border-radius: 20px;
                    backdrop-filter: blur(10px);
                    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                }
            `}</style>
        </div>
    );
}