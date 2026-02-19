import { useEffect, useState } from 'react';
import { adminAPI, CATEGORIES, AGE_RANGES, CONDITIONS } from '../../api';

export default function Dashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        adminAPI.getDashboard().then(res => setStats(res.data));
    }, []);

    if (!stats) return <p>Chargement du dashboard...</p>;

    // Petit helper pour afficher les listes de stats (ex: SOC: 5)
    const renderStatList = (data, labels) => (
        <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
            {Object.entries(data).map(([key, count]) => (
                <li key={key} style={{ marginBottom: '5px' }}>
                    <span style={{ fontWeight: 'bold' }}>{labels[key] || key} :</span> {count}
                </li>
            ))}
        </ul>
    );

    return (
        <div style={{ padding: '20px' }}>
            <h1>Tableau de Bord Gestionnaire</h1>

            {/* 1. Résumé Global */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div className="card" style={cardStyle}>
                    <h3>📦 Stock Total</h3>
                    <p style={bigNumberStyle}>{stats.total_articles}</p>
                </div>
                <div className="card" style={cardStyle}>
                    <h3>👥 Abonnés</h3>
                    <p style={bigNumberStyle}>{stats.active_subscribers}</p>
                </div>
                <div className="card" style={cardStyle}>
                    <h3>✅ Box Envoyées</h3>
                    <p style={bigNumberStyle}>{stats.total_validated_boxes}</p>
                </div>
                <div className="card" style={cardStyle}>
                    <h3>⭐ Score Moyen</h3>
                    <p style={bigNumberStyle}>{stats.average_box_score?.toFixed(1) || 0}</p>
                </div>
            </div>

            {/* 2. Détails des répartitions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>

                <section style={sectionStyle}>
                    <h4>Répartition par Catégorie</h4>
                    {renderStatList(stats.articles_by_category, CATEGORIES)}
                </section>

                <section style={sectionStyle}>
                    <h4>Articles par Tranche d'Âge</h4>
                    {renderStatList(stats.articles_by_age_range, AGE_RANGES)}
                </section>

                <section style={sectionStyle}>
                    <h4>État du Stock</h4>
                    {renderStatList(stats.articles_by_condition, CONDITIONS)}
                </section>

                <section style={sectionStyle}>
                    <h4>Abonnés par Tranche d'Âge</h4>
                    {renderStatList(stats.subscribers_by_age_range, AGE_RANGES)}
                </section>

            </div>
        </div>
    );
}

// Styles rapides en ligne pour la présentation
const cardStyle = {
    background: '#f8f9fa',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #dee2e6',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
};

const sectionStyle = {
    background: 'white',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #eee',
    color: '#333'
};

const bigNumberStyle = {
    fontSize: '32px',
    margin: '10px 0 0 0',
    color: '#2c3e50',
    fontWeight: 'bold'
};