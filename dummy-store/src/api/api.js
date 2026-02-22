const API_URL = 'http://localhost:5000/api';

const handleRes = async (res) => {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data.error || data.message || `HTTP Error ${res.status}`);
    }
    if (data.error) throw new Error(data.error);
    return data;
};

export const api = {
    // Auth
    login: async (email, password) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        return handleRes(res);
    },

    // Products
    getProducts: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const res = await fetch(`${API_URL}/products?${query}`);
        return handleRes(res);
    },

    getProductById: async (id) => {
        const res = await fetch(`${API_URL}/products/${id}`);
        return handleRes(res);
    },

    // Cart
    getCart: async () => {
        const res = await fetch(`${API_URL}/cart`);
        return handleRes(res);
    },

    addToCart: async (productId, qty = 1) => {
        const res = await fetch(`${API_URL}/cart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, qty })
        });
        return handleRes(res);
    },

    updateCartQty: async (productId, qty) => {
        const res = await fetch(`${API_URL}/cart/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ qty })
        });
        return handleRes(res);
    },

    removeFromCart: async (productId) => {
        const res = await fetch(`${API_URL}/cart/${productId}`, {
            method: 'DELETE'
        });
        return handleRes(res);
    },

    // User & Orders
    getProfile: async () => {
        const res = await fetch(`${API_URL}/user/profile`);
        return handleRes(res);
    },

    getOrders: async () => {
        const res = await fetch(`${API_URL}/orders`);
        return handleRes(res);
    },

    placeOrder: async () => {
        const res = await fetch(`${API_URL}/orders`, {
            method: 'POST'
        });
        return handleRes(res);
    }
};
