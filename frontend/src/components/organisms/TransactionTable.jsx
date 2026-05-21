import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { formatIDR } from '../../utils/format';

const TransactionTable = ({ transactions }) => {
    return (
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
                                        <p className="text-xs text-slate-500 font-mono">{formatIDR(tx.product.price)}</p>
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
                                {tx.product ? formatIDR(parseFloat(tx.product.price) * tx.amount) : formatIDR(0)}
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
    );
};

export default TransactionTable;
