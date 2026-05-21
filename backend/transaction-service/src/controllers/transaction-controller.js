import { getAllTransactions, getTransactionById, createTransaction, fetchUserInfo, fetchProductInfo, fetchUsersBulk, fetchProductsBulk } from "../services/transaction-service.js";
import { response } from "../utils/response.js";

export const listTransactions = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const txResult = await getAllTransactions(page, limit);
    
    // txResult is { count, rows }
    const txs = txResult.rows;
    const userIds = [...new Set(txs.map(t => t.user_id).filter(id => id))];
    const productIds = [...new Set(txs.map(t => t.product_id).filter(id => id))];
    
    const [usersMap, productsMap] = await Promise.all([
        fetchUsersBulk(userIds, req.headers.authorization),
        fetchProductsBulk(productIds, req.headers.authorization)
    ]);
    
    const enhancedTxs = txs.map(t => {
        const tJson = t.toJSON();
        tJson.owner = usersMap[t.user_id] || null;
        tJson.product = productsMap[t.product_id] || null;
        return tJson;
    });

    return res.json(response({ count: txResult.count, rows: enhancedTxs }));
};

export const create = async (req, res) => {
    const { amount, product_id } = req.body;
    const userId = req.user.id;
    if (!amount || !product_id) {
        return res.status(400).json(response(undefined, { name: "Missing fields" }, "Validation Exception", 400));
    }
    const newTx = await createTransaction(amount, product_id, userId);
    return res.status(201).json(response(newTx, undefined, "Created", 201));
};

export const getTransaction = async (req, res) => {
    const { id } = req.params;
    try {
        const tx = await getTransactionById(id);
        if (!tx) {
            return res.status(404).json(response(undefined, undefined, "Not Found", 404));
        }
        
        const [ownerData, productData] = await Promise.all([
            fetchUserInfo(tx.user_id, req.headers.authorization),
            fetchProductInfo(tx.product_id, req.headers.authorization)
        ]);

        return res.json(response({ ...tx.toJSON(), owner: ownerData, product: productData }));
    } catch {
        return res.status(404).json(response(undefined, undefined, "Not Found", 404));
    }
};
