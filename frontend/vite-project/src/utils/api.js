const API_URL = 'http://localhost:5000/api';

export const api = {
    get: async (endpoint, token = null) => {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}${endpoint}`, { headers });
        const data = await response.json();

        if (!response.ok) throw new Error(data.message);

        return data;
    },

    post: async (endpoint, body, token = null) => {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message);

        return data;
    },

    put: async (endpoint, body, token = null) => {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message);

        return data;
    },

    delete: async (endpoint, token = null) => {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'DELETE',
            headers
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message);

        return data;
    }
};