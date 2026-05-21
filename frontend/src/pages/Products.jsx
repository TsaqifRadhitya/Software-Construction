import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, Edit2, Trash2, Box, PackageOpen } from 'lucide-react';

const Products = () => {
    const { user } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ id: null, name: '', stock: 0, price: 0, description: '' });
    const [isEditing, setIsEditing] = useState(false);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await api.get('/products');
            setProducts(res.data.data.data || []);
        } catch (err) {
            console.error("Failed to fetch products", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            name: formData.name,
            stock: parseInt(formData.stock),
            price: parseFloat(formData.price),
            description: formData.description,
            user_id: user.id // Tie creation to the current user
        };

        try {
            if (isEditing) {
                await api.put(`/products/${formData.id}`, payload);
            } else {
                await api.post('/products', payload);
            }
            setIsModalOpen(false);
            fetchProducts();
        } catch (err) {
            console.error("Failed to save product", err);
            alert("Error saving product");
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this product?")) {
            try {
                await api.delete(`/products/${id}`);
                fetchProducts();
            } catch (err) {
                console.error("Failed to delete product", err);
            }
        }
    };

    const openEditModal = (product) => {
        setFormData({ id: product.id, name: product.name, stock: product.stock, price: product.price, description: product.description || '' });
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setFormData({ id: null, name: '', stock: 0, price: 0, description: '' });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Products Inventory</h1>
                    <p className="text-sm text-slate-400">Manage products powered by Laravel</p>
                </div>
                <button 
                    onClick={openCreateModal}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
                >
                    <Plus size={18} />
                    <span>New Product</span>
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors shadow-lg shadow-black/10 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400">
                                    <Box size={24} />
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => openEditModal(product)} className="text-slate-500 hover:text-blue-400 transition-colors">
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(product.id)} className="text-slate-500 hover:text-rose-400 transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            
                            <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
                            <p className="text-xl text-emerald-400 font-mono mb-4">${parseFloat(product.price).toFixed(2)}</p>
                            
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
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-800">
                            <h2 className="text-xl font-bold text-white">{isEditing ? 'Edit Product' : 'Create New Product'}</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-slate-950/50 border border-slate-700 text-slate-100 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Price ($)</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                                        className="w-full bg-slate-950/50 border border-slate-700 text-slate-100 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Stock</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({...formData, stock: e.target.value})}
                                        className="w-full bg-slate-950/50 border border-slate-700 text-slate-100 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                                <textarea
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="w-full bg-slate-950/50 border border-slate-700 text-slate-100 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                                ></textarea>
                            </div>
                            
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-600/20 transition-all">
                                    {isEditing ? 'Save Changes' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
