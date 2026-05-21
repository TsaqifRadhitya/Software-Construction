import { useState, useContext } from 'react';
import { useGetProducts } from '../hooks/use-get-products';
import { useCreateProduct } from '../hooks/use-create-product';
import { useUpdateProduct } from '../hooks/use-update-product';
import { useDeleteProduct } from '../hooks/use-delete-product';
import { AuthContext } from '../context/AuthContext';
import { Plus } from 'lucide-react';
import ConfirmationModal from '../components/molecules/ConfirmationModal';
import ProductGrid from '../components/organisms/ProductGrid';
import ProductModal from '../components/organisms/ProductModal';

const Products = () => {
    const { user } = useContext(AuthContext);
    const { data: products = [], isLoading } = useGetProducts();
    const createProduct = useCreateProduct();
    const updateProduct = useUpdateProduct();
    const deleteProduct = useDeleteProduct();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ id: null, name: '', stock: 0, price: 0, description: '' });
    const [isEditing, setIsEditing] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updateProduct.mutateAsync({
                    id: formData.id,
                    data: {
                        name: formData.name,
                        stock: parseInt(formData.stock),
                        price: parseFloat(formData.price),
                        description: formData.description
                    }
                });
            } else {
                await createProduct.mutateAsync({
                    name: formData.name,
                    stock: parseInt(formData.stock),
                    price: parseFloat(formData.price),
                    description: formData.description
                });
            }
            setIsModalOpen(false);
        } catch (err) {
            console.error("Failed to save product", err);
            alert("Error saving product");
        }
    };

    const handleDeleteClick = (id) => {
        setProductToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;
        try {
            await deleteProduct.mutateAsync(productToDelete);
        } catch (err) {
            console.error("Failed to delete product", err);
        } finally {
            setProductToDelete(null);
        }
    };

    const openEditModal = (product) => {
        setFormData({
            id: product.id,
            name: product.name,
            stock: product.stock,
            price: product.price,
            description: product.description || ''
        });
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
                    <p className="text-sm text-slate-400">View and manage products across services</p>
                </div>
                {user?.role === 'admin' && (
                    <button 
                        onClick={openCreateModal}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
                    >
                        <Plus size={18} />
                        <span>New Product</span>
                    </button>
                )}
            </div>

            {isLoading ? (
                <div className="flex justify-center p-12">
                    <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                </div>
            ) : (
                <ProductGrid
                    products={products}
                    onEdit={openEditModal}
                    onDelete={handleDeleteClick}
                />
            )}

            <ProductModal
                isOpen={isModalOpen}
                isEditing={isEditing}
                formData={formData}
                setFormData={setFormData}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Product"
                message="Are you sure you want to delete this product? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </div>
    );
};

export default Products;
