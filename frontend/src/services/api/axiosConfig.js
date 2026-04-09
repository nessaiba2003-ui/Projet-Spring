import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// SIMULATEUR FRONTEND POUR LES OPÉRATIONS CRUD
const simulateBackendCRUD = (config) => {
  const method = config.method.toUpperCase();
  const cleanUrl = config.url.replace(/^\//, '').split('?')[0];
  const parts = cleanUrl.split('/');
  const entity = parts[0];
  const id = parts[1];

  const storageKey = `mock_${entity}`;
  let db = JSON.parse(localStorage.getItem(storageKey)) || [];

  if (method === 'GET') {
    if (id && !isNaN(id)) {
      return db.find(x => String(x.id) === String(id)) || {};
    }
    return db;
  }

  // Extraction sécurisée du body même si c'est du FormData
  let body = {};
  if (config.data instanceof FormData) {
    for (let [key, value] of config.data.entries()) {
      if (value instanceof File) body[key] = value.name; // On sauvegarde juste le nom du fichier
      else body[key] = value;
    }
  } else if (typeof config.data === 'string') {
    try { body = JSON.parse(config.data); } catch(e) {}
  } else {
    body = config.data || {};
  }

  if (method === 'POST') {
    const newItem = { ...body, id: Date.now() };
    db.push(newItem);
    localStorage.setItem(storageKey, JSON.stringify(db));
    return newItem;
  }

  if (method === 'PUT') {
    db = db.map(x => String(x.id) === String(id) ? { ...x, ...body } : x);
    localStorage.setItem(storageKey, JSON.stringify(db));
    return body;
  }

  if (method === 'DELETE') {
    db = db.filter(x => String(x.id) !== String(id));
    localStorage.setItem(storageKey, JSON.stringify(db));
    return null;
  }

  return [];
};

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const status = error.response ? error.response.status : null;

    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // SIMULATION DÉSACTIVÉE : on renvoie la vraie erreur au frontend
    return Promise.reject(error);
  }
);

export default api;
