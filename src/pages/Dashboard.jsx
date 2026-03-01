import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function () {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200">
            <nav className="border-b border-slate-800 bg-[#1e293b]/50 backdrop-blur-md sticky top-0 p-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold text-indigo-400">Sucuri<span className="text-white">Drive</span></h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm hidden md:block">Olá, {user?.email}</span>
                        <button onClick={handleLogout} className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all text-sm font-medium">Sair</button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 hover:border-indigo-500/50 transition-all group">
                        <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-500/20">
                            📁
                        </div>
                        <h3 className="text-lg font-bold mb-2">Meus Arquivos</h3>
                        <p className="text-slate-400 text-sm">Gerencie seus uploads de forma rápida e segura.</p>
                    </div>
                </div>
            </main>
        </div>
    );

}