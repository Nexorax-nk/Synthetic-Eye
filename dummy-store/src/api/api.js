const API_URL = 'http://localhost:5000/api';

export const api = {
    chaos: false, // Chaos Toggle state

    // Auth
    login: async (email, password) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(api.chaos && { 'x-chaos-trigger': 'crash' })
            },
            body: JSON.stringify({ email, password })
        });
        return res.json();
    },

    // Products
    getProducts: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const res = await fetch(`${API_URL}/products?${query}`, {
            headers: {
                ...(api.chaos && { 'x-chaos-trigger': 'corrupt' })
            }
        });
        return res.json();
    },

    getProductById: async (id) => {
        const res = await fetch(`${API_URL}/products/${id}`);
        return res.json();
    },

    // Cart
    getCart: async () => {
        const res = await fetch(`${API_URL}/cart`);
        return res.json();
    },

    addToCart: async (productId, qty = 1) => {
        const res = await fetch(`${API_URL}/cart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, qty })
        });
        return res.json();
    },

    updateCartQty: async (productId, qty) => {
        const res = await fetch(`${API_URL}/cart/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ qty })
        });
        return res.json();
    },

    removeFromCart: async (productId) => {
        const res = await fetch(`${API_URL}/cart/${productId}`, {
            method: 'DELETE'
        });
        return res.json();
    },

    // User & Orders
    getProfile: async () => {
        const res = await fetch(`${API_URL}/user/profile`);
        return res.json();
    },

    getOrders: async () => {
        const res = await fetch(`${API_URL}/orders`);
        return res.json();
    },

    placeOrder: async () => {
        const res = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                ...(api.chaos && { 'x-chaos-trigger': 'latency' })
            }
        });
        return res.json();
    }
};
