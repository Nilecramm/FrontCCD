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

    useEffect(() => { loadCampaigns(); }, []);

    // 1. Créer (Toujours autorisé)
    const handleCreate = async () => {
        try {
            await adminAPI.createCampaign(weight);
            await loadCampaigns();
            alert("Nouvelle campagne créée !");
        } catch (e) { alert("Erreur création."); }
    };

    // 2. Optimiser une campagne spécifique
    const handleOptimize = async (id) => {
        try {
            await adminAPI.optimizeCampaign(id);
            alert("Optimisation terminée.");
            handleView(id); // Affiche les box après l'optimisation
        } catch (e) { alert("Erreur optimisation."); }
    };

    // 3. Voir les box d'une campagne
    const handleView = async (id) => {
        setSelectedId(id);
        try {
            const res = await adminAPI.getBoxes(id);
            setBoxes(res.data || []);
        } catch (e) { setBoxes([]); }
    };

    // 4. Valider l'envoi
    const handleValidate = async (subId) => {
        try {
            await adminAPI.validateBox(selectedId, subId);
            handleView(selectedId); // Refresh la liste
        } catch (e) { alert("Erreur validation."); }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Gestion des Campagnes</h1>

            {/* Création : AUCUNE LOGIQUE DE BLOCAGE */}
            <section style={{ marginBottom: '30px', padding: '15px', background: '#f0f0f0', borderRadius: '8px' }}>
                <label>Poids max par box (g) : </label>
                <input type="number" value={weight} onChange={e => setWeight(e.target.value)} style={{ width: '80px', marginRight: '10px' }} />
                <button onClick={handleCreate} style={{ padding: '8px 15px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Lancer une nouvelle campagne
                </button>
            </section>

            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>
                {/* Liste de gauche (Historique) */}
                <aside>
                    <h3>Historique</h3>
                    {[...campaigns].reverse().map(c => (
                        <div key={c.id} style={{
                            padding: '10px', border: '1px solid #ccc', marginBottom: '10px', borderRadius: '5px',
                            background: selectedId === c.id ? '#e7f3ff' : 'white'
                        }}>
                            <strong>Campagne #{c.id}</strong><br/>
                            <div style={{ marginTop: '5px' }}>
                                <button onClick={() => handleOptimize(c.id)} style={{ fontSize: '0.8em' }}>Optimiser</button>
                                <button onClick={() => handleView(c.id)} style={{ fontSize: '0.8em', marginLeft: '5px' }}>Détails</button>
                            </div>
                        </div>
                    ))}
                </aside>

                {/* Détails de droite */}
                <main>
                    <h3>Box de la campagne {selectedId || '---'}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        {boxes.map(box => (
                            <div key={box.subscriber_id} style={{
                                border: '1px solid #ddd', padding: '15px', borderRadius: '8px',
                                background: box.validated ? '#f0fff4' : 'white'
                            }}>
                                <strong>{box.subscriber_name}</strong> {box.validated && '✅'}
                                <ul style={{ fontSize: '0.85em' }}>
                                    {box.articles.map(a => <li key={a.id}>{a.designation}</li>)}
                                </ul>
                                {!box.validated && (
                                    <button onClick={() => handleValidate(box.subscriber_id)} style={{ cursor: 'pointer' }}>
                                        Valider l'envoi
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}