import React from 'react';
import { Box, Edit2, Trash2, PackageOpen } from 'lucide-react';
import { formatIDR } from '../../utils/format';

const ProductGrid = ({ products, onEdit, onDelete }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
                <div key={product.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors shadow-lg shadow-black/10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400">
                            <Box size={24} />
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => onEdit(product)} className="text-slate-500 hover:text-blue-400 transition-colors">
                                <Edit2 size={18} />
                            </button>
                            <button onClick={() => onDelete(product.id)} className="text-slate-500 hover:text-rose-400 transition-colors">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
                    <p className="text-xl text-emerald-400 font-mono mb-4">{formatIDR(product.price)}</p>
                    
                    <p className="text-sm text-slate-400 mb-6 flex-1 line-clamp-3">
                        {product.description || 'No description provided.'}
                    </p>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-slate-800 mt-auto">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">Stock:</span>
                            <span className={`text-sm font-medium ${product.stock > 0 ? 'text-slate-200' : 'text-rose-400'}`}>
                                {product.stock}
                            </span>
                        </div>
                        {product.owner && (
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold">
                                    {product.owner.nama.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-xs text-slate-400">{product.owner.nama}</span>
                            </div>
                        )}
                    </div>
                </div>
            ))}
            {products.length === 0 && (
                <div className="col-span-full p-12 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-500">
                    <PackageOpen size={48} className="mb-4 opacity-50" />
                    <p>No products found. Add some inventory to get started.</p>
                </div>
            )}
        </div>
    );
};

export default ProductGrid;
