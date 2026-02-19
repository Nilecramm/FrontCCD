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

    useEffect(() => {
        const init = async () => {
            await loadArticles();
        };
        init();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await adminAPI.addArticle(newArticle);
            alert("Article ajouté avec succès !");
            loadArticles();
        } catch {
            alert("Erreur lors de l'ajout");
        }
    };

    return (
        <div className="admin-page-container">
            <h2>Gestion du Stock</h2>

            <form onSubmit={handleAdd} className="registration-form">
                <div className="form-section">
                    <div className="input-group">
                        <div className="field">
                            <label>Désignation</label>
                            <input
                                placeholder="Ex: Puzzle 500 pièces"
                                onChange={e => setNewArticle({ ...newArticle, designation: e.target.value })}
                                required
                            />
                        </div>
                        <div className="field">
                            <label>Catégorie</label>
                            <select value={newArticle.category} onChange={e => setNewArticle({ ...newArticle, category: e.target.value })}>
                                {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <div className="input-group">
                        <div className="field">
                            <label>Tranche d'âge</label>
                            <select value={newArticle.age_range} onChange={e => setNewArticle({ ...newArticle, age_range: e.target.value })}>
                                {Object.entries(AGE_RANGES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                        </div>
                        <div className="field">
                            <label>État</label>
                            <select value={newArticle.condition} onChange={e => setNewArticle({ ...newArticle, condition: e.target.value })}>
                                {Object.entries(CONDITIONS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <div className="input-group">
                        <div className="field">
                            <label>Prix (€)</label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                onChange={e => setNewArticle({ ...newArticle, price: parseFloat(e.target.value) })}
                                required
                            />
                        </div>
                        <div className="field">
                            <label>Poids (g)</label>
                            <input
                                type="number"
                                placeholder="En grammes"
                                onChange={e => setNewArticle({ ...newArticle, weight: parseInt(e.target.value) })}
                                required
                            />
                        </div>
                    </div>
                </div>

                <button type="submit" className="submit-btn" style={{ width: '100%' }}>Ajouter au stock</button>
            </form>

            <div className="table-container registration-form" style={{ marginTop: '30px', maxWidth: 'none' }}>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Désignation</th>
                            <th>Catégorie</th>
                            <th>Âge</th>
                            <th>État</th>
                            <th>Prix</th>
                            <th>Poids</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.map(art => (
                            <tr key={art.id} className="category-item">
                                <td>{art.id}</td>
                                <td><strong>{art.designation}</strong></td>
                                <td>{CATEGORIES[art.category]}</td>
                                <td>{AGE_RANGES[art.age_range]}</td>
                                <td>{CONDITIONS[art.condition]}</td>
                                <td>{art.price}€</td>
                                <td>{art.weight}g</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style>{`
                :root { 
                    --primary: #646cff;
                    --primary-light: #8b91ff;
                    --light-gray: #f4f4f4;
                    --glass: rgba(255, 255, 255, 0.8);
                    --text-black: #000000;
                    --text-white: #ffffff;
                }

                .admin-page-container {
                    padding: 40px 20px;
                    width: 100%;
                    max-width: 1000px;
                    margin: 0 auto;
                }

                .registration-form {
                    display: flex; flex-direction: column; gap: 20px;
                    padding: 25px;
                    background: var(--glass); border-radius: 16px;
                    backdrop-filter: blur(10px); box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                }

                .form-section h3 {
                    margin-bottom: 15px; color: var(--primary); font-weight: 600;
                }

                .input-group { 
                    display: grid; 
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
                    gap: 15px; 
                }

                .field {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                    text-align: left;
                }

                label {
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--text-black);
                }

                input, select {
                    padding: 12px; border-radius: 8px; 
                    color: var(--text-black);
                    border: 1px solid rgba(0,0,0,0.1); 
                    background: var(--light-gray);
                    width: 100%; box-sizing: border-box; font-size: 16px;
                }

                input:focus, select:focus {
                    outline: 2px solid var(--primary);
                    background: var(--text-white);
                }

                .submit-btn {
                    padding: 15px; border-radius: 8px;
                    background: linear-gradient(135deg, var(--primary), var(--primary-light));
                    color: white; border: none; font-weight: bold; cursor: pointer;
                    transition: transform 0.1s, opacity 0.2s;
                }

                .submit-btn:hover {
                    opacity: 0.9;
                    transform: translateY(-1px);
                }

                .admin-table {
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 0 8px;
                }

                .admin-table th {
                    text-align: left;
                    padding: 12px;
                    color: var(--text-black);
                    font-weight: 600;
                    border-bottom: 2px solid var(--primary);
                }

                .category-item {
                    background: rgba(255, 255, 255, 0.5);
                    transition: 0.2s ease;
                }

                .category-item td {
                    padding: 12px;
                    color: var(--text-black);
                }

                .category-item:hover {
                    background: var(--text-white);
                }

                .category-item td:first-child { border-radius: 8px 0 0 8px; }
                .category-item td:last-child { border-radius: 0 8px 8px 0; }
            `}</style>
        </div>
    );
}