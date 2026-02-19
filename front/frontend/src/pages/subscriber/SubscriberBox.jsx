import { useState } from 'react';
import { subscriberAPI, CATEGORIES } from '../../api';

export default function SubscriberBox() {
    const [email, setEmail] = useState('');
    const [boxes, setBoxes] = useState([]); // Initialisé avec un tableau vide
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        setBoxes([]);
        setError('');

        try {
            const res = await subscriberAPI.getBox(email);
            // On vérifie si on a reçu des données et si le tableau n'est pas vide
            if (res.data && res.data.length > 0) {
                setBoxes(res.data);
            } else {
                setError("Aucune box validée n'a été trouvée pour cet email.");
            }
        } catch (err) {
            if (err.response?.status === 404) {
                setError("Aucune box validée n'a été trouvée pour cet email.");
            } else {
                setError("Une erreur est survenue lors de la recherche.");
            }
        }
    };

    return (
        <div className="container" style={{ padding: '20px' }}>
            <h1>Consulter mes ToyBoxes</h1>
            <form onSubmit={handleSearch} style={{ marginBottom: '30px' }}>
                <input
                    type="email"
                    placeholder="votre.email@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ padding: '10px', width: '250px' }}
                />
                <button type="submit" style={{ marginLeft: '10px' }}>Voir mes box</button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Titre global si on a des résultats */}
            {boxes.length > 0 && (
                <h2 style={{ marginBottom: '20px' }}>
                    Bonjour {boxes[0].subscriber_name}, voici vos box :
                </h2>
            )}

            {/* On boucle sur chaque box de la liste */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                {boxes.map((box, index) => (
                    <div key={index} className="box-card" style={{ border: '2px solid #4CAF50', padding: '20px', borderRadius: '8px', textAlign: 'left' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', marginBottom: '15px' }}>
                            <h3 style={{ margin: 0 }}>📦 Campagne : {box.campaign_id}</h3>
                            <span style={{ background: '#4CAF50', color: 'white', padding: '5px 10px', borderRadius: '15px', fontSize: '0.8em' }}>
                                Validée
                            </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                            {box.articles.map(article => (
                                <div key={article.id} style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '4px' }}>
                                    <strong style={{ fontSize: '1em' }}>{article.designation}</strong>
                                    <p style={{ margin: '5px 0', color: '#666', fontSize: '0.9em' }}>
                                        Catégorie : {CATEGORIES[article.category]}<br />
                                        Prix : {article.price} €
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '20px', paddingTop: '10px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', color: '#2c3e50' }}>
                            <span>Poids total : {box.total_weight}g</span>
                            <span>Valeur totale : {box.total_price}€</span>
                            <span>Score : {box.score} pts</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}