import { useEffect, useState } from 'react';
import { adminAPI, CATEGORIES, AGE_RANGES, CONDITIONS } from '../../api';

export default function Dashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            const res = await adminAPI.getDashboard();
            setStats(res.data);
        };
        fetchStats();
    }, []);

    if (!stats) return (
        <div className="loader-container">
            <p>Chargement du dashboard...</p>
        </div>
    );

    // Petit helper pour afficher les listes de stats (ex: SOC: 5)
    const renderStatList = (data, labels) => (
        <ul className="stat-details-list">
            {Object.entries(data).map(([key, count]) => (
                <li key={key}>
                    <span className="stat-label">{labels[key] || key} :</span>
                    <span className="stat-count">{count}</span>
                </li>
            ))}
        </ul>
    );

    return (
        <div className="admin-page-container">
            <h1>Tableau de Bord Gestionnaire</h1>

            {/* 1. Résumé Global */}
            <div className="stats-grid">
                <div className="registration-form stat-card-glass">
                    <h3>📦 Stock Total</h3>
                    <p className="big-number">{stats.total_articles}</p>
                </div>
                <div className="registration-form stat-card-glass">
                    <h3>👥 Abonnés</h3>
                    <p className="big-number">{stats.active_subscribers}</p>
                </div>
                <div className="registration-form stat-card-glass">
                    <h3>✅ Box Envoyées</h3>
                    <p className="big-number">{stats.total_validated_boxes}</p>
                </div>
                <div className="registration-form stat-card-glass">
                    <h3>⭐ Score Moyen</h3>
                    <p className="big-number">{stats.average_box_score?.toFixed(1) || 0}</p>
                </div>
            </div>

            {/* 2. Détails des répartitions */}
            <div className="details-grid">
                <section className="registration-form detail-section">
                    <h4>Répartition par Catégorie</h4>
                    {renderStatList(stats.articles_by_category, CATEGORIES)}
                </section>

                <section className="registration-form detail-section">
                    <h4>Articles par Tranche d'Âge</h4>
                    {renderStatList(stats.articles_by_age_range, AGE_RANGES)}
                </section>

                <section className="registration-form detail-section">
                    <h4>État du Stock</h4>
                    {renderStatList(stats.articles_by_condition, CONDITIONS)}
                </section>

                <section className="registration-form detail-section">
                    <h4>Abonnés par Tranche d'Âge</h4>
                    {renderStatList(stats.subscribers_by_age_range, AGE_RANGES)}
                </section>
            </div>

            <style>{`
                :root { 
                    --primary: #646cff;
                    --primary-light: #8b91ff;
                    --glass: rgba(255, 255, 255, 0.7);
                    --text-black: #000000;
                }

                .admin-page-container {
                    padding: 40px 20px;
                    width: 100%;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .stats-grid { 
                    display: grid; 
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); 
                    gap: 20px; 
                    margin-bottom: 40px; 
                }

                .registration-form {
                    padding: 25px;
                    background: var(--glass); 
                    border-radius: 16px;
                    backdrop-filter: blur(10px); 
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    text-align: center;
                }

                .stat-card-glass h3 {
                    font-size: 1.1em;
                    color: var(--primary);
                    margin-bottom: 10px;
                }

                .big-number {
                    font-size: 2.5em;
                    font-weight: 800;
                    color: var(--text-black);
                    margin: 0;
                }

                .details-grid {
                    display: grid; 
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
                    gap: 20px; 
                }

                .detail-section {
                    text-align: left;
                }

                .detail-section h4 {
                    color: var(--primary);
                    border-bottom: 1px solid rgba(0,0,0,0.1);
                    padding-bottom: 10px;
                    margin-bottom: 15px;
                }

                .stat-details-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .stat-details-list li {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    border-bottom: 1px solid rgba(0,0,0,0.05);
                    color: var(--text-black);
                }

                .stat-label {
                    font-weight: 600;
                }

                .stat-count {
                    background: var(--primary);
                    color: white;
                    padding: 2px 10px;
                    border-radius: 12px;
                    font-size: 0.9em;
                }

                .loader-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 50vh;
                    font-size: 1.2em;
                    color: var(--primary);
                }
            `}</style>
        </div>
    );
}