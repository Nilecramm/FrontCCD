import { useEffect, useState } from 'react';
import { adminAPI } from '../../api';

export default function AdminCampaigns() {
    const [campaigns, setCampaigns] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [boxes, setBoxes] = useState([]);
    const [weight, setWeight] = useState(1200);

    // Charge la liste au démarrage
    const loadCampaigns = async () => {
        try {
            const res = await adminAPI.getCampaigns();
            setCampaigns(res.data || []);
        } catch (e) { console.error("Erreur chargement campagnes", e); }
    };

    useEffect(() => {
        const init = async () => {
            await loadCampaigns();
        };
        init();
    }, []);

    // 1. Créer (Toujours autorisé)
    const handleCreate = async () => {
        try {
            await adminAPI.createCampaign(weight);
            await loadCampaigns();
            alert("Nouvelle campagne créée !");
        } catch { alert("Erreur création."); }
    };

    // 2. Optimiser une campagne spécifique
    const handleOptimize = async (id) => {
        try {
            await adminAPI.optimizeCampaign(id);
            alert("Optimisation terminée.");
            handleView(id); // Affiche les box après l'optimisation
        } catch { alert("Erreur optimisation."); }
    };

    // 3. Voir les box d'une campagne
    const handleView = async (id) => {
        setSelectedId(id);
        try {
            const res = await adminAPI.getBoxes(id);
            setBoxes(res.data || []);
        } catch { setBoxes([]); }
    };

    // 4. Valider l'envoi
    const handleValidate = async (subId) => {
        try {
            await adminAPI.validateBox(selectedId, subId);
            handleView(selectedId); // Refresh la liste
        } catch { alert("Erreur validation."); }
    };

    return (
        <div className="admin-page-container">
            <h1>Gestion des Campagnes</h1>

            {/* Création : AUCUNE LOGIQUE DE BLOCAGE */}
            <section className="registration-form control-panel">
                <div className="input-group">
                    <div className="field">
                        <label>Poids max par box (g) : </label>
                        <input type="number" value={weight} onChange={e => setWeight(e.target.value)} />
                    </div>
                    <button onClick={handleCreate} className="submit-btn highlight-btn">
                        Lancer une nouvelle campagne
                    </button>
                </div>
            </section>

            <div className="campaign-layout">
                {/* Liste de gauche (Historique) */}
                <aside className="sidebar">
                    <h3>Historique</h3>
                    <div className="history-list">
                        {[...campaigns].reverse().map(c => (
                            <div key={c.id} className={`history-item ${selectedId === c.id ? 'active' : ''}`}>
                                <strong>Campagne #{c.id}</strong>
                                <div className="item-actions">
                                    <button onClick={() => handleOptimize(c.id)} className="mini-btn opt-btn">Optimiser</button>
                                    <button onClick={() => handleView(c.id)} className="mini-btn view-btn">Détails</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Détails de droite */}
                <main className="main-content">
                    <h3>Box de la campagne {selectedId || '---'}</h3>
                    <div className="boxes-grid">
                        {boxes.map(box => (
                            <div key={box.subscriber_id} className={`registration-form box-item ${box.validated ? 'validated' : ''}`}>
                                <div className="box-item-header">
                                    <strong>{box.subscriber_name}</strong>
                                    {box.validated && <span className="check">✅ Validée</span>}
                                </div>
                                <ul className="articles-small-list">
                                    {box.articles.map(a => <li key={a.id}>{a.designation}</li>)}
                                </ul>
                                {!box.validated && (
                                    <button onClick={() => handleValidate(box.subscriber_id)} className="validate-btn">
                                        Valider l'envoi
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </main>
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

                .control-panel {
                    margin-bottom: 40px;
                    text-align: left;
                }

                .input-group {
                    display: flex;
                    align-items: flex-end;
                    gap: 20px;
                    flex-wrap: wrap;
                }

                .field { display: flex; flex-direction: column; gap: 5px; }

                label { font-size: 14px; font-weight: 600; color: var(--text-black); }

                input {
                    padding: 10px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.1); 
                    background: #f4f4f4; width: 120px;
                }

                .submit-btn {
                    padding: 12px 25px; border-radius: 8px;
                    background: linear-gradient(135deg, var(--primary), var(--primary-light));
                    color: white; border: none; font-weight: bold; cursor: pointer;
                }

                .campaign-layout {
                    display: grid;
                    grid-template-columns: 280px 1fr;
                    gap: 30px;
                }

                .sidebar h3, .main-content h3 {
                    color: var(--primary);
                    margin-bottom: 20px;
                }

                .history-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .history-item {
                    padding: 15px;
                    background: var(--glass);
                    border-radius: 12px;
                    border: 1px solid rgba(255,255,255,0.3);
                    backdrop-filter: blur(10px);
                    transition: 0.2s;
                }

                .history-item.active {
                    background: var(--primary);
                    color: white;
                }

                .item-actions {
                    margin-top: 10px;
                    display: flex;
                    gap: 5px;
                }

                .mini-btn {
                    flex: 1;
                    padding: 5px;
                    font-size: 0.8em;
                    border-radius: 4px;
                    border: 1px solid rgba(0,0,0,0.1);
                    cursor: pointer;
                }

                .opt-btn { background: #fff; color: var(--primary); }
                .view-btn { background: var(--primary-light); color: white; border: none; }

                .boxes-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                }

                .box-item {
                    text-align: left;
                    padding: 20px;
                    margin: 0;
                }

                .box-item.validated {
                    border: 2px solid #4CAF50;
                }

                .box-item-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 15px;
                    color: var(--text-black);
                }

                .check { color: #4CAF50; font-weight: bold; font-size: 0.85em; }

                .articles-small-list {
                    list-style: disc;
                    padding-left: 20px;
                    font-size: 0.9em;
                    color: #444;
                    margin-bottom: 20px;
                }

                .validate-btn {
                    width: 100%;
                    padding: 10px;
                    background: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-weight: bold;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
}