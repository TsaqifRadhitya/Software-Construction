import { Transaction } from "../repository/transaction-repository.js";

export const getAllTransactions = async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    return await Transaction.findAndCountAll({ limit, offset });
};

export const getTransactionById = async (id) => {
    return await Transaction.findByPk(parseInt(id));
};

export const createTransaction = async (amount, product_id, user_id) => {
    return await Transaction.create({ amount, product_id, user_id });
};

export const fetchUserInfo = async (userId, authHeader) => {
    try {
        const res = await fetch(`http://auth_service:3001/users/${userId}`, {
            headers: {
                ...(authHeader && { 'Authorization': authHeader })
            }
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json.data || null;
    } catch {
        return null;
    }
};

export const fetchProductInfo = async (productId, authHeader) => {
    try {
        const res = await fetch(`http://product_service:8000/api/products/${productId}`, {
            headers: {
                ...(authHeader && { 'Authorization': authHeader })
            }
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json.data || null;
    } catch {
        return null;
    }
};

export const fetchUsersBulk = async (userIds, authHeader) => {
    if (!userIds || userIds.length === 0) return {};
    try {
        const res = await fetch(`http://auth_service:3001/users?ids=${userIds.join(',')}`, {
            headers: {
                ...(authHeader && { 'Authorization': authHeader })
            }
        });
        if (!res.ok) return {};
        const json = await res.json();
        const users = json.data?.rows || [];
        const map = {};
        for (const u of users) map[u.id] = u;
        return map;
    } catch {
        return {};
    }
};

export const fetchProductsBulk = async (productIds, authHeader) => {
    if (!productIds || productIds.length === 0) return {};
    try {
        const res = await fetch(`http://product_service:8000/api/products?ids=${productIds.join(',')}`, {
            headers: {
                ...(authHeader && { 'Authorization': authHeader })
            }
        });
        if (!res.ok) return {};
        const json = await res.json();
        const products = json.data?.data || [];
        const map = {};
        for (const p of products) map[p.id] = p;
        return map;
    } catch {
        return {};
    }
};
