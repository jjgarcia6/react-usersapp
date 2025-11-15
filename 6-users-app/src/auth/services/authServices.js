import axios from 'axios';

// Usa VITE_API_URL si está definida, si no usa localhost:8080
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

//podriamos desestructurar el objeto userLogin en username y password
//para hacerlo mas legible
export const loginUser = async ({ username, password }) => {
    try {
        return await axios.post(`${API_BASE}/login`, {
            username,
            password,
        });
    } catch (error) {
        console.error('loginUser error:', error?.response ?? error?.message ?? error);
        throw error;
    }
}
