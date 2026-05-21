import React from 'react';
import { CreditCard, ArrowRightLeft } from 'lucide-react';
import FormField from '../molecules/FormField';
import { formatIDR } from '../../utils/format';

const TransactionModal = ({
    isOpen,
    products,
    formData,
    setFormData,
    onClose,
    onSubmit,
    submitting
}) => {
    if (!isOpen) return null;

    const selectedProduct = products.find(p => p.id === parseInt(formData.product_id));

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <CreditCard size={20} className="text-orange-500"/>
                        Checkout Process
                    </h2>
                </div>
                <form onSubmit={onSubmit} className="p-6 space-y-5">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">Select Product</label>
                        <select
                            required
                            value={formData.product_id}
                            onChange={(e) => setFormData({...formData, product_id: e.target.value})}
                            className="w-full bg-slate-950/50 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        >
                            <option value="" disabled>Choose a product...</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id} disabled={p.stock < 1}>
                                    {p.name} - {formatIDR(p.price)} {p.stock < 1 ? '(Out of stock)' : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    <FormField
                        label="Quantity"
                        type="number"
                        required
                        min="1"
                        max={selectedProduct ? selectedProduct.stock : 99}
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    />
                    
                    {selectedProduct && (
                        <p className="text-xs text-slate-500 -mt-2 text-right">
                            Max available: {selectedProduct.stock}
                        </p>
                    )}
                    
                    {selectedProduct && formData.amount > 0 && (
                        <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl flex justify-between items-center animate-in fade-in duration-200">
                            <span className="text-sm text-slate-400">Total Price</span>
                            <span className="text-lg font-bold text-orange-400 font-mono">
                                {formatIDR(parseFloat(selectedProduct.price) * parseInt(formData.amount))}
                            </span>
                        </div>
                    )}
                    
                    <div className="pt-4 flex gap-3">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors font-medium text-sm"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={submitting || !formData.product_id}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl shadow-lg shadow-orange-600/20 transition-all font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2"
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
    );
};

export default TransactionModal;
