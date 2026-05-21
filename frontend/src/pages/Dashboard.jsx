import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Users, Box, ShoppingCart, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    const cards = [
        { title: 'Users', path: '/users', icon: Users, color: 'from-blue-500 to-indigo-500' },
        { title: 'Products', path: '/products', icon: Box, color: 'from-emerald-500 to-teal-500' },
        { title: 'Transactions', path: '/transactions', icon: ShoppingCart, color: 'from-orange-500 to-amber-500' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header>
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-slate-400">Welcome back, {user?.nama}! Here's an overview of your microservices.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Link 
                            key={card.path}
                            to={card.path}
                            className="group block relative p-6 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-slate-700 transition-colors"
                        >
                            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${card.color} opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-3 rounded-xl bg-slate-800 text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                    <Icon size={24} />
                                </div>
                                <div className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center text-slate-500 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                                    <Activity size={14} />
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-200 mb-1">{card.title}</h3>
                            <p className="text-sm text-slate-500">Manage {card.title.toLowerCase()} data</p>
                        </Link>
                    )
                })}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-[-50%] right-[-10%] w-[40%] h-[150%] bg-indigo-500/10 blur-[100px] rounded-full rotate-45 pointer-events-none"></div>
                <h2 className="text-xl font-bold text-white mb-4">Architecture Status</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                        <div>
                            <p className="font-medium text-slate-200">API Gateway</p>
                            <p className="text-xs text-slate-500">Port 8000 (Active)</p>
                        </div>
                    </div>
                    <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                        <div>
                            <p className="font-medium text-slate-200">Auth Service</p>
                            <p className="text-xs text-slate-500">IAM & Users (Active)</p>
                        </div>
                    </div>
                    <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                        <div>
                            <p className="font-medium text-slate-200">Transaction Service</p>
                            <p className="text-xs text-slate-500">Node/Express (Active)</p>
                        </div>
                    </div>
                    <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                        <div>
                            <p className="font-medium text-slate-200">Product Service</p>
                            <p className="text-xs text-slate-500">Laravel 11 (Active)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
