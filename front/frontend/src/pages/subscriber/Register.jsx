import { useState } from 'react';
import { subscriberAPI, CATEGORIES, AGE_RANGES } from '../../api';

export default function Register() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        child_age_range: 'PE',
        category_preferences: Object.keys(CATEGORIES) // Tableau de préférences
    });

    const [draggedIndex, setDraggedIndex] = useState(null);

    const onDragStart = (index) => {
        setDraggedIndex(index);
    };

    const onDragOver = (e, index) => {
        e.preventDefault();
        if (draggedIndex === index) return;

        const newPrefs = [...formData.category_preferences];
        const itemToMove = newPrefs[draggedIndex];

        // Supprimer l'item de l'ancienne position
        newPrefs.splice(draggedIndex, 1);
        // L'insérer à la nouvelle position
        newPrefs.splice(index, 0, itemToMove);

        setDraggedIndex(index);
        setFormData({ ...formData, category_preferences: newPrefs });
    };

    const onDragEnd = () => {
        setDraggedIndex(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // On envoie le tableau directement (Axios se charge du format JSON)
            await subscriberAPI.register(formData);
            alert("Inscription réussie !");
        } catch (err) {
            const backendErrors = err.response?.data?.errors;
            if (backendErrors) {
                alert("Erreurs du serveur :\n- " + backendErrors.join("\n- "));
            } else {
                alert("Une erreur inconnue est survenue.");
            }
        }
    };

    return (
        <div className="container">
            <h1>Inscription ToyBoxing</h1>
            <p className="subtitle">Configurez votre box en quelques clics</p>

            <form onSubmit={handleSubmit} className="registration-form">
                <div className="form-section">
                    <h3>Informations Personnelles</h3>
                    <div className="input-group">
                        <input
                            placeholder="Prénom"
                            value={formData.first_name}
                            onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                            required
                        />
                        <input
                            placeholder="Nom"
                            value={formData.last_name}
                            onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                            required
                        />
                    </div>
                    <input
                        placeholder="Email (ex: test@exemple.com)"
                        type="email"
                        className="full-width"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                </div>

                <div className="form-section">
                    <h3>Détails Enfant</h3>
                    <label>Tranche d'âge de l'enfant :</label>
                    <select
                        className="full-width"
                        value={formData.child_age_range}
                        onChange={e => setFormData({ ...formData, child_age_range: e.target.value })}
                    >
                        {Object.entries(AGE_RANGES).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>
                </div>

                <div className="form-section">
                    <h3>Vos Préférences (Drag & Drop)</h3>
                    <p className="hint">Faites glisser les catégories pour définir l'ordre de priorité (1er en haut).</p>
                    <div className="category-list">
                        {formData.category_preferences.map((cat, index) => (
                            <div
                                key={cat}
                                draggable
                                onDragStart={() => onDragStart(index)}
                                onDragOver={(e) => onDragOver(e, index)}
                                onDragEnd={onDragEnd}
                                className={`category-item ${draggedIndex === index ? 'dragging' : ''}`}
                            >
                                <span className="rank">{index + 1}</span>
                                <span className="label">{CATEGORIES[cat]}</span>
                                <span className="drag-handle">☰</span>
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit" className="submit-btn">Créer mon compte et ma Box</button>
            </form>

            <style>{`
                :root { 
                    --primary: #646cff;
                    --glass: rgba(240, 240, 240, 0.8);
                    --text-white: #ffffff;
                }
                
                /* Container principal responsive */
                .registration-form {
                    display: flex; flex-direction: column; gap: 20px;
                    max-width: 500px; width: 95%; margin: 0 auto; padding: 25px;
                    background: var(--glass); border-radius: 16px;
                    backdrop-filter: blur(10px); box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                }

                .form-section h3 {
                    margin-bottom: 15px; border-bottom: 1px solid var(--glass);
                    padding-bottom: 5px; color: var(--primary); font-weight: 600;
                }

                /* Grid responsive : 1 colonne sur mobile, 2 sur tablette/PC */
                .input-group { 
                    display: grid; 
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
                    gap: 15px; 
                }
                
                input, select {
                    padding: 12px; border-radius: 8px; 
                    color: #000000; /* Texte noir sur fond clair */
                    border: 1px solid rgba(0,0,0,0.1); 
                    background: var(--glass); /* Couleur glass permanente */
                    width: 100%; box-sizing: border-box; font-size: 16px;
                    transition: none; /* Supprime les effets de transition qui pourraient assombrir */
                }

                input::placeholder {
                    color: rgba(0,0,0,0.5);
                }

                input:focus, select:focus {
                    outline: 2px solid var(--primary);
                    background: var(--glass); /* Garde la couleur glass même au focus */
                }

                /* Empêche l'assombrissement par le navigateur (autofill) */
                input:-webkit-autofill,
                input:-webkit-autofill:hover, 
                input:-webkit-autofill:focus {
                    -webkit-text-fill-color: #000000;
                    -webkit-box-shadow: 0 0 0px 1000px rgba(240, 240, 240, 0.9) inset;
                    transition: background-color 5000s ease-in-out 0s;
                }

                /* Liste de catégories et Drag-Handle */
                .category-item {
                    display: flex; align-items: center; padding: 12px 15px;
                    background: var(--glass); border-radius: 10px; cursor: grab;
                    transition: 0.2s ease; border: 1px solid transparent;
                }

                .category-item:hover { background: rgba(255,255,255,0.15); }
                
                /* Style des chiffres (Rank) - Plus lisible */
                .rank {
                    width: 26px; height: 26px; min-width: 26px;
                    background: var(--primary); color: var(--text-white) !important;
                    border-radius: 50%; display: flex; align-items: center; justify-content: center;
                    font-size: 0.85em; font-weight: 800; margin-right: 15px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }

                .label { flex-grow: 1; color: #000000; }

                .drag-handle {
                    display: block;
                    margin-left: 10px;
                    opacity: 0.7;
                    cursor: grabbing;
                    font-size: 1.2em;
                    color: #000000; /* Force l'icône ☰ en noir */
                }
                }
                .drag-handle::before { content: '☰'; }

                .submit-btn {
                    margin-top: 10px; padding: 15px; border-radius: 8px;
                    background-color: var(--primary); 
                    background-attachment: fixed;
                    color: white; border: none; font-weight: bold; cursor: pointer;
                    transition: transform 0.1s, opacity 0.2s;
                }

                .submit-btn:active { transform: scale(0.98); }
            `}</style>
        </div>
    );
}
