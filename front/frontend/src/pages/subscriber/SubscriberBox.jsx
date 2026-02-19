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
        <div className="subscriber-page-container">
            <h1>Consulter mes ToyBoxes</h1>
            <p className="subtitle">Retrouvez le contenu de vos box validées</p>

            <form onSubmit={handleSearch} className="registration-form search-form">
                <div className="input-group">
                    <input
                        type="email"
                        placeholder="votre.email@exemple.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit" className="submit-btn">Voir mes box</button>
                </div>
            </form>

            {error && <p className="error-message">{error}</p>}

            {/* Titre global si on a des résultats */}
            {boxes.length > 0 && (
                <h2 className="greeting">
                    Bonjour {boxes[0].subscriber_name}, voici vos box :
                </h2>
            )}

            {/* On boucle sur chaque box de la liste */}
            <div className="boxes-list">
                {boxes.map((box, index) => (
                    <div key={index} className="registration-form box-card">
                        <div className="box-header">
                            <h3>📦 Campagne : {box.campaign_id}</h3>
                            <span className="status-badge">Validée</span>
                        </div>

                        <div className="articles-grid">
                            {box.articles.map(article => (
                                <div key={article.id} className="article-item">
                                    <strong>{article.designation}</strong>
                                    <p>
                                        <span className="cat-badge">{CATEGORIES[article.category]}</span>
                                        <span className="price-tag">{article.price} €</span>
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="box-footer">
                            <div className="footer-stat">
                                <span className="label">Poids :</span>
                                <span className="value">{box.total_weight}g</span>
                            </div>
                            <div className="footer-stat">
                                <span className="label">Valeur :</span>
                                <span className="value">{box.total_price}€</span>
                            </div>
                            <div className="footer-stat highlighted">
                                <span className="label">Score :</span>
                                <span className="value">{box.score} pts</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                :root { 
                    --primary: #646cff;
                    --primary-light: #8b91ff;
                    --glass: rgba(255, 255, 255, 0.7);
                    --light-gray: #f4f4f4;
                    --text-black: #000000;
                    --text-white: #ffffff;
                }

                .subscriber-page-container {
                    padding: 40px 20px;
                    width: 100%;
                    max-width: 900px;
                    margin: 0 auto;
                    text-align: center;
                }

                .subtitle { color: var(--primary); margin-bottom: 30px; opacity: 0.8; }

                .registration-form {
                    padding: 25px;
                    background: var(--glass); 
                    border-radius: 16px;
                    backdrop-filter: blur(10px); 
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    margin-bottom: 30px;
                }

                .search-form .input-group {
                    display: flex;
                    gap: 10px;
                    max-width: 500px;
                    margin: 0 auto;
                }

                input {
                    flex: 1;
                    padding: 12px; border-radius: 8px; 
                    color: var(--text-black);
                    border: 1px solid rgba(0,0,0,0.1); 
                    background: var(--light-gray);
                    font-size: 16px;
                }

                .submit-btn {
                    padding: 12px 25px; border-radius: 8px;
                    background: linear-gradient(135deg, var(--primary), var(--primary-light));
                    color: white; border: none; font-weight: bold; cursor: pointer;
                }

                .error-message { color: #cc0000; font-weight: 500; }
                .greeting { margin: 40px 0 20px; color: var(--text-black); }

                .boxes-list { display: flex; flexDirection: column; gap: 30px; }

                .box-card { text-align: left; }

                .box-header { 
                    display: flex; justify-content: space-between; align-items: center; 
                    border-bottom: 1px solid rgba(0,0,0,0.1); padding-bottom: 15px; margin-bottom: 20px; 
                }

                .box-header h3 { margin: 0; color: var(--primary); }

                .status-badge { 
                    background: #4CAF50; color: white; padding: 5px 12px; 
                    border-radius: 20px; font-size: 0.8em; font-weight: bold;
                }

                .articles-grid { 
                    display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; 
                }

                .article-item { 
                    background: rgba(255,255,255,0.4); padding: 15px; 
                    border-radius: 10px; border: 1px solid rgba(0,0,0,0.05);
                }

                .article-item strong { display: block; margin-bottom: 8px; color: var(--text-black); }

                .cat-badge { font-size: 0.8em; background: var(--primary); color: white; padding: 2px 8px; border-radius: 4px; margin-right: 8px; }
                .price-tag { font-weight: bold; color: var(--primary); }

                .box-footer { 
                    margin-top: 25px; padding-top: 20px; border-top: 1px solid rgba(0,0,0,0.1);
                    display: flex; justify-content: space-between; 
                }

                .footer-stat .label { font-size: 0.9em; color: #555; margin-right: 5px; }
                .footer-stat .value { font-weight: bold; color: var(--text-black); }

                .footer-stat.highlighted {
                    background: var(--primary); color: white !important;
                    padding: 8px 15px; border-radius: 10px;
                }
                .footer-stat.highlighted .label { color: rgba(255,255,255,0.8); }
                .footer-stat.highlighted .value { color: var(--text-white) !important; font-size: 1.1em; }
            `}</style>
        </div>
    );
}