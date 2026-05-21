import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetUsers } from '../hooks/use-get-users';
import { useCreateUser } from '../hooks/use-create-user';
import { useUpdateUser } from '../hooks/use-update-user';
import { useDeleteUser } from '../hooks/use-delete-user';
import { Plus } from 'lucide-react';
import ConfirmationModal from '../components/molecules/ConfirmationModal';
import Pagination from '../components/molecules/Pagination';
import UserTable from '../components/organisms/UserTable';
import UserModal from '../components/organisms/UserModal';

const Users = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Parse with fallback to default values to avoid NaN
    const currentPage = Math.max(1, parseInt(searchParams.get('page')) || 1);
    const itemsPerPage = Math.max(1, parseInt(searchParams.get('limit')) || 10);
    
    const { data, isLoading } = useGetUsers(currentPage, itemsPerPage);
    const users = data?.users || [];
    const totalItems = data?.total || 0;
    const totalPages = data?.totalPages || 1;
    
    const createUser = useCreateUser();
    const updateUser = useUpdateUser();
    const deleteUser = useDeleteUser();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ id: null, nama: '', role: 'user' });
    const [isEditing, setIsEditing] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updateUser.mutateAsync({ 
                    id: formData.id, 
                    data: { nama: formData.nama, role: formData.role } 
                });
            } else {
                await createUser.mutateAsync({ nama: formData.nama, role: formData.role });
            }
            setIsModalOpen(false);
        } catch (err) {
            console.error("Failed to save user", err);
            alert("Error saving user");
        }
    };

    const handleDeleteClick = (id) => {
        setUserToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;
        try {
            await deleteUser.mutateAsync(userToDelete);
        } catch (err) {
            console.error("Failed to delete user", err);
        } finally {
            setUserToDelete(null);
        }
    };

    const openEditModal = (user) => {
        setFormData({ id: user.id, nama: user.nama, role: user.role === 'admin' ? 'admin' : 'user' });
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setFormData({ id: null, nama: '', role: 'user' });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const handlePageChange = (page) => {
        setSearchParams({ page: page.toString(), limit: itemsPerPage.toString() });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Users Management</h1>
                    <p className="text-sm text-slate-400">Manage access across the microservices</p>
                </div>
                <button 
                    onClick={openCreateModal}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
                >
                    <Plus size={18} />
                    <span>New User</span>
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-12">
                    <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
                    <UserTable
                        users={users}
                        onEdit={openEditModal}
                        onDelete={handleDeleteClick}
                    />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}

            <UserModal
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
                title="Delete User"
                message="Are you sure you want to delete this user? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </div>
    );
};

export default Users;
