import axios from 'axios';

//const api = axios.create({ baseURL: '' });
const api = axios.create({ baseURL: 'https://toyboxing.th-fchs.fr' }); // Ne pas utiliser directement pour éviter le CORS en dev

// INTERCEPTEUR : Ajoute automatiquement le token s'il existe dans le localStorage
api.interceptors.request.use(config => {
    const token = localStorage.getItem('admin_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// --- ENUMS (Indispensables pour l'affichage) ---
export const CATEGORIES = {
    SOC: 'Jeux de société', FIG: 'Figurines', CON: 'Construction',
    EXT: 'Extérieur', EVL: 'Éveil', LIV: 'Livres'
};

export const AGE_RANGES = {
    BB: '0-3 ans', PE: '3-6 ans', EN: '6-10 ans', AD: '10+ ans'
};

export const CONDITIONS = {
    N: 'Neuf', TB: 'Très bon état', B: 'Bon état'
};

// --- ROUTES API ---

export const subscriberAPI = {
    register: (data) => api.post('/subscriber/register', data),
    getBox: (email) => api.get(`/subscriber/box?email=${email}`),
};

export const adminAPI = {
    getCampaigns: () => api.get('/admin/campaigns'),
    login: (username, password) => api.post('/admin/login', { username, password }),
    getArticles: (page = 1) => api.get(`/admin/articles?page=${page}`),
    addArticle: (data) => api.post('/admin/articles', data),
    createCampaign: (maxWeight) => api.post('/admin/campaigns', { max_weight_per_box: maxWeight }),
    optimizeCampaign: (id) => api.post(`/admin/campaigns/${id}/optimize`),
    getBoxes: (id) => api.get(`/admin/campaigns/${id}/boxes`),
    validateBox: (campId, subId) => api.post(`/admin/campaigns/${campId}/boxes/${subId}/validate`),
    getDashboard: () => api.get('/admin/dashboard'),
    getSubscribers: () => api.get('/admin/subscribers'),
};
