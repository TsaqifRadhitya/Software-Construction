import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, ShoppingCart, ArrowRightLeft, CreditCard } from 'lucide-react';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ product_id: '', amount: 1 });
    const [submitting, setSubmitting] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [txRes, prodRes] = await Promise.all([
                api.get('/transactions'),
                api.get('/products')
            ]);
            setTransactions(txRes.data.data.rows || []);
            setProducts(prodRes.data.data.data || []);
        } catch (err) {
            console.error("Failed to fetch data", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/transactions', { 
                product_id: formData.product_id, 
                amount: parseInt(formData.amount) 
            });
            setIsModalOpen(false);
            setFormData({ product_id: '', amount: 1 });
            fetchData();
        } catch (err) {
            console.error("Failed to process transaction", err);
            alert("Error processing transaction");
        }
        setSubmitting(false);
    };

    const selectedProduct = products.find(p => p.id === parseInt(formData.product_id));

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Transactions</h1>
                    <p className="text-sm text-slate-400">View and create cross-service transactions</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-orange-600/20 transition-all"
                >
                    <Plus size={18} />
                    <span>New Transaction</span>
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <div className="w-8 h-8 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl shadow-black/20">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="text-xs uppercase bg-slate-950/50 text-slate-500 border-b border-slate-800">
                            <tr>
                                <th className="px-6 py-4 font-semibold">ID</th>
                                <th className="px-6 py-4 font-semibold">Buyer (Owner)</th>
                                <th className="px-6 py-4 font-semibold">Product</th>
                                <th className="px-6 py-4 font-semibold text-right">Amount</th>
                                <th className="px-6 py-4 font-semibold text-right">Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                                    <td className="px-6 py-4 font-mono text-orange-400">#{tx.id}</td>
                                    <td className="px-6 py-4">
                                        {tx.owner ? (
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
                                                    {tx.owner.nama.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-200">{tx.owner.nama}</p>
                                                    <p className="text-xs text-slate-500">ID: {tx.owner.id}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-slate-500 italic">User Unknown ({tx.user_id})</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {tx.product ? (
                                            <div>
                                                <p className="font-medium text-slate-200">{tx.product.name}</p>
                                                <p className="text-xs text-slate-500 font-mono">${tx.product.price}</p>
                                            </div>
                                        ) : (
                                            <span className="text-slate-500 italic">Product Unknown ({tx.product_id})</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="inline-block px-2 py-1 bg-slate-800 rounded font-medium text-slate-300">
                                            x{tx.amount}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-emerald-400 font-medium">
                                        ${tx.product ? (parseFloat(tx.product.price) * tx.amount).toFixed(2) : '0.00'}
                                    </td>
                                </tr>
                            ))}
                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                        <ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
                                        <p>No transactions yet.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-800">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <CreditCard size={20} className="text-orange-500"/>
                                Checkout Process
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Select Product</label>
                                <select
                                    required
                                    value={formData.product_id}
                                    onChange={(e) => setFormData({...formData, product_id: e.target.value})}
                                    className="w-full bg-slate-950/50 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="" disabled>Choose a product...</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.id} disabled={p.stock < 1}>
                                            {p.name} - ${p.price} {p.stock < 1 ? '(Out of stock)' : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Quantity</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    max={selectedProduct ? selectedProduct.stock : 99}
                                    value={formData.amount}
                                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                    className="w-full bg-slate-950/50 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                                {selectedProduct && (
                                    <p className="text-xs text-slate-500 mt-2 text-right">
                                        Max available: {selectedProduct.stock}
                                    </p>
                                )}
                            </div>
                            
                            {selectedProduct && formData.amount > 0 && (
                                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl flex justify-between items-center">
                                    <span className="text-sm text-slate-400">Total Price</span>
                                    <span className="text-lg font-bold text-orange-400 font-mono">
                                        ${(parseFloat(selectedProduct.price) * parseInt(formData.amount)).toFixed(2)}
                                    </span>
                                </div>
                            )}
                            
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors font-medium">
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={submitting || !formData.product_id}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl shadow-lg shadow-orange-600/20 transition-all font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {submitting ? 'Processing...' : (
                                        <>
                                            Pay Now <ArrowRightLeft size={16} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Transactions;
