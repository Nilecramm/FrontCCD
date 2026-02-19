import { useEffect, useState } from 'react';
import { adminAPI, CATEGORIES, AGE_RANGES, CONDITIONS } from '../../api';

export default function AdminArticles() {
    const [articles, setArticles] = useState([]);
    // Initialisation avec des valeurs par défaut cohérentes
    const [newArticle, setNewArticle] = useState({
        designation: '',
        category: 'SOC',
        age_range: 'PE',
        condition: 'N',
        price: 0,
        weight: 0
    });

    const loadArticles = async () => {
        try {
            const res = await adminAPI.getArticles();
            setArticles(res.data.items); // L'API renvoie { items, total... }
        } catch (err) {
            console.error("Erreur chargement articles", err);
        }
    };

    useEffect(() => { loadArticles(); }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await adminAPI.addArticle(newArticle);
            alert("Article ajouté avec succès !");
            loadArticles();
            // Optionnel : reset du formulaire
        } catch (err) {
            alert("Erreur lors de l'ajout");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Gestion du Stock</h2>

            {/* Formulaire complet et stylisé */}
            <form onSubmit={handleAdd} style={formStyle}>
                <div style={inputGroupStyle}>
                    <label>Désignation</label>
                    <input
                        placeholder="Ex: Puzzle 500 pièces"
                        onChange={e => setNewArticle({...newArticle, designation: e.target.value})}
                        required
                    />
                </div>

                <div style={inputGroupStyle}>
                    <label>Catégorie</label>
                    <select value={newArticle.category} onChange={e => setNewArticle({...newArticle, category: e.target.value})}>
                        {Object.entries(CATEGORIES).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                </div>

                <div style={inputGroupStyle}>
                    <label>Tranche d'âge</label>
                    <select value={newArticle.age_range} onChange={e => setNewArticle({...newArticle, age_range: e.target.value})}>
                        {Object.entries(AGE_RANGES).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                </div>

                <div style={inputGroupStyle}>
                    <label>État</label>
                    <select value={newArticle.condition} onChange={e => setNewArticle({...newArticle, condition: e.target.value})}>
                        {Object.entries(CONDITIONS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                </div>

                <div style={inputGroupStyle}>
                    <label>Prix (€)</label>
                    <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        onChange={e => setNewArticle({...newArticle, price: parseFloat(e.target.value)})}
                        required
                    />
                </div>

                <div style={inputGroupStyle}>
                    <label>Poids (g)</label>
                    <input
                        type="number"
                        placeholder="En grammes"
                        onChange={e => setNewArticle({...newArticle, weight: parseInt(e.target.value)})}
                        required
                    />
                </div>

                <button type="submit" style={buttonStyle}>Ajouter au stock</button>
            </form>

            {/* Table d'affichage améliorée */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '30px' }}>
                <thead>
                <tr style={{ background: '#eee' }}>
                    <th style={tdStyle}>ID</th>
                    <th style={tdStyle}>Désignation</th>
                    <th style={tdStyle}>Catégorie</th>
                    <th style={tdStyle}>Âge</th>
                    <th style={tdStyle}>État</th>
                    <th style={tdStyle}>Prix</th>
                    <th style={tdStyle}>Poids</th>
                </tr>
                </thead>
                <tbody>
                {articles.map(art => (
                    <tr key={art.id} style={{ borderBottom: '1px solid #ddd' }}>
                        <td style={tdStyle}>{art.id}</td>
                        <td style={tdStyle}>{art.designation}</td>
                        <td style={tdStyle}>{CATEGORIES[art.category]}</td>
                        <td style={tdStyle}>{AGE_RANGES[art.age_range]}</td>
                        <td style={tdStyle}>{CONDITIONS[art.condition]}</td>
                        <td style={tdStyle}>{art.price}€</td>
                        <td style={tdStyle}>{art.weight}g</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

// Styles rapides
const formStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    background: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    alignItems: 'end'
};

const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
    fontSize: '14px'
};

const tdStyle = { padding: '10px', textAlign: 'left' };
const buttonStyle = {
    padding: '10px',
    background: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
};