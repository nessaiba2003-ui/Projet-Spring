import axios from 'axios';
import { store } from '../../store';
import { logout } from '../../store/authSlice';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth?.token;
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
    const shouldRedirectOn403 = Boolean(error?.config?.redirectOn403);

    if (status === 401) {
      store.dispatch(logout());
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Important: do not force a global redirect on every 403.
    // Some pages call mixed endpoints (e.g. dashboard counters) where one forbidden
    // request should not eject the user to /denied.
    if (status === 403 && shouldRedirectOn403) {
      window.location.href = '/denied';
      return Promise.reject(error);
    }

    // SIMULATION DÉSACTIVÉE : on renvoie la vraie erreur au frontend
    return Promise.reject(error);
  }
);

export default api;
