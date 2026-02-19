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
        <div className="admin-container">
            <h1>Gestion des Abonnés ({subscribers.length})</h1>

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
                    <tr key={sub.id}>
                        <td>{sub.id}</td>
                        <td>{sub.first_name}</td>
                        <td>{sub.last_name}</td>
                        <td>{sub.email}</td>
                        <td><span className="badge age">{AGE_RANGES[sub.child_age_range]}</span></td>
                        <td>
                            <div className="pref-list">
                                {(Array.isArray(sub.category_preferences)
                                        ? sub.category_preferences
                                        : (sub.category_preferences?.split(',') || [])
                                ).map((cat, idx) => (
                                    <span key={idx} className="pref-tag" title={CATEGORIES[cat.trim()]}>
                                            {idx + 1}. {cat.trim()}
                                        </span>
                                ))}
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <style>{`
                .admin-container { padding: 20px; max-width: 1000px; margin: 0 auto; color: #fff; }
                .admin-table { width: 100%; border-collapse: collapse; margin-top: 20px; background: rgba(0,0,0,0.2); border-radius: 8px; overflow: hidden; }
                .admin-table th, .admin-table td { padding: 12px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.05); }
                .admin-table th { background: rgba(255,255,255,0.05); font-weight: 600; }
                
                .badge { padding: 4px 8px; border-radius: 4px; font-size: 0.8em; }
                .age { background: rgba(139, 92, 246, 0.2); color: #c4b5fd; }
                
                .pref-list { display: flex; flex-wrap: wrap; gap: 5px; }
                .pref-tag { 
                    font-size: 0.75em; 
                    background: rgba(255,255,255,0.1); 
                    padding: 2px 6px; 
                    border-radius: 3px;
                    border: 1px solid rgba(255,255,255,0.05);
                }
            `}</style>
        </div>
    );
}
