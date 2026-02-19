import { useEffect, useState } from 'react';
import { adminAPI, AGE_RANGES, CATEGORIES } from '../../api';

export default function Subscribers() {
    const [subscribers, setSubscribers] = useState([]);

    const loadSubscribers = async () => {
        try {
            const res = await adminAPI.getSubscribers();
            setSubscribers(res.data || []);
        } catch {
            console.error("Erreur chargement abonnés");
        }
    };

    useEffect(() => {
        const init = async () => { await loadSubscribers(); };
        init();
    }, []);

    return (
        <div className="admin-page-container">
            <h1>Gestion des Abonnés ({subscribers.length})</h1>

            <div className="registration-form table-card">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Prénom</th>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Âge Enfant</th>
                            <th>Préférences (Ordre)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subscribers.map(sub => (
                            <tr key={sub.id} className="category-item">
                                <td>{sub.id}</td>
                                <td>{sub.first_name}</td>
                                <td>{sub.last_name}</td>
                                <td>{sub.email}</td>
                                <td><span className="badge age">{AGE_RANGES[sub.child_age_range]}</span></td>
                                <td>
                                    <div className="pref-grid">
                                        {(Array.isArray(sub.category_preferences)
                                            ? sub.category_preferences
                                            : (sub.category_preferences?.split(',') || [])
                                        ).map((cat, idx) => (
                                            <div key={idx} className="pref-tag" title={CATEGORIES[cat.trim()]}>
                                                <span className="pref-rank">{idx + 1}</span>
                                                <span className="pref-label">{CATEGORIES[cat.trim()] || cat}</span>
                                            </div>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style>{`
                :root { 
                    --primary: #646cff;
                    --primary-light: #8b91ff;
                    --glass: rgba(255, 255, 255, 0.7);
                    --text-black: #000000;
                    --text-white: #ffffff;
                }

                .admin-page-container {
                    padding: 40px 20px;
                    width: 100%;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .admin-page-container h1 {
                    color: var(--text-black);
                    margin-bottom: 30px;
                    text-align: center;
                }

                .registration-form {
                    padding: 25px;
                    background: var(--glass); 
                    border-radius: 16px;
                    backdrop-filter: blur(10px); 
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                }

                .table-card {
                    overflow-x: auto;
                    max-width: none;
                }

                .admin-table {
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 0 10px;
                }

                .admin-table th {
                    text-align: left;
                    padding: 15px;
                    color: var(--primary);
                    font-weight: bold;
                    border-bottom: 2px solid var(--primary);
                }

                .category-item {
                    background: rgba(255, 255, 255, 0.5);
                    transition: 0.2s;
                }

                .category-item:hover {
                    background: white;
                    transform: scale(1.005);
                }

                .category-item td {
                    padding: 15px;
                    color: var(--text-black);
                }

                .category-item td:first-child { border-radius: 10px 0 0 10px; }
                .category-item td:last-child { border-radius: 0 10px 10px 0; }

                .badge {
                    padding: 4px 10px;
                    border-radius: 4px;
                    font-size: 0.85em;
                    font-weight: 600;
                }

                .age { background: var(--primary); color: white; }

                .pref-grid {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }

                .pref-tag {
                    display: flex;
                    align-items: center;
                    background: #f0f0f0;
                    border-radius: 6px;
                    padding: 2px 8px;
                    border: 1px solid rgba(0,0,0,0.05);
                }

                .pref-rank {
                    background: var(--primary);
                    color: white;
                    font-size: 0.7em;
                    width: 18px;
                    height: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    margin-right: 6px;
                    font-weight: bold;
                }

                .pref-label {
                    font-size: 0.8em;
                    color: var(--text-black);
                }
            `}</style>
        </div>
    );
}
