import React from 'react';
import { Edit2, Trash2, Shield, User } from 'lucide-react';

const UserTable = ({ users, onEdit, onDelete }) => {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl shadow-black/20">
            <table className="w-full text-left text-sm text-slate-400">
                <thead className="text-xs uppercase bg-slate-950/50 text-slate-500 border-b border-slate-800">
                    <tr>
                        <th className="px-6 py-4 font-semibold">ID</th>
                        <th className="px-6 py-4 font-semibold">Name</th>
                        <th className="px-6 py-4 font-semibold">Role</th>
                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                            <td className="px-6 py-4 font-mono text-indigo-400">{user.id}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
                                        {user.role === 'admin' ? <Shield size={14} /> : <User size={14} />}
                                    </div>
                                    <span className="font-medium text-slate-200">{user.nama}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${user.role === 'admin' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-slate-800 text-slate-300 border border-slate-700'}`}>
                                    {user.role === 'admin' ? 'admin' : 'karyawan'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => onEdit(user)} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => onDelete(user.id)} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && (
                        <tr>
                            <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                                No users found in Auth Service.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;
