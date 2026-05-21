import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetTransactions } from '../hooks/use-get-transactions';
import { useCreateTransaction } from '../hooks/use-create-transaction';
import { useGetProducts } from '../hooks/use-get-products';
import { Plus } from 'lucide-react';
import Pagination from '../components/molecules/Pagination';
import TransactionTable from '../components/organisms/TransactionTable';
import TransactionModal from '../components/organisms/TransactionModal';

const Transactions = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Parse with fallback to default values to avoid NaN
    const currentPage = Math.max(1, parseInt(searchParams.get('page')) || 1);
    const itemsPerPage = Math.max(1, parseInt(searchParams.get('limit')) || 10);
    
    const { data: transactionData, isLoading: isTxLoading } = useGetTransactions(currentPage, itemsPerPage);
    const transactions = transactionData?.transactions || [];
    const totalItems = transactionData?.total || 0;
    const totalPages = transactionData?.totalPages || 1;
    
    const { data: productData, isLoading: isProdLoading } = useGetProducts(1, 100); // Get all products for dropdown
    const products = productData?.products || [];
    
    const createTransaction = useCreateTransaction();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ product_id: '', amount: 1 });

    const loading = isTxLoading || isProdLoading;
    const submitting = createTransaction.isPending;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createTransaction.mutateAsync({ 
                product_id: formData.product_id, 
                amount: parseInt(formData.amount) 
            });
            setIsModalOpen(false);
            setFormData({ product_id: '', amount: 1 });
        } catch (err) {
            console.error("Failed to process transaction", err);
            alert("Error processing transaction");
        }
    };

    const handlePageChange = (page) => {
        setSearchParams({ page: page.toString(), limit: itemsPerPage.toString() });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
                    <TransactionTable transactions={transactions} />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}

            <TransactionModal
                isOpen={isModalOpen}
                products={products}
                formData={formData}
                setFormData={setFormData}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                submitting={submitting}
            />
        </div>
    );
};

export default Transactions;
