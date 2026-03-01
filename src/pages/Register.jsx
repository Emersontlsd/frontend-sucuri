import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://backend-sucuri-api.vercel.app/api/register', form);
            alert("Conta criada! Faça login.");
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.message || "Erro ao registrar");
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
            <div className="bg-[#1e293b] w-full max-w-md p-8 rounded-2xl border border-slate-700 shadow-2xl">
                <h2 className="text-3xl font-bold text-white text-center mb-8 tracking-tight">Nova <span className="text-emerald-500">Conta</span></h2>
                <form onSubmit={handleRegister} className="space-y-5">
                    <input type="text" placeholder="Nome" required className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-slate-600 text-white outline-none focus:border-emerald-500" onChange={e => setForm({ ...form, name: e.target.value })} />
                    <input type="email" placeholder="E-mail" required className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-slate-600 text-white outline-none focus:border-emerald-500" onChange={e => setForm({ ...form, email: e.target.value })} />
                    <input type="password" placeholder="Senha" required className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-slate-600 text-white outline-none focus:border-emerald-500" onChange={e => setForm({ ...form, password: e.target.value })} />
                    <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20">Criar Agora</button>
                </form>
                <p className="text-center text-slate-400 mt-6 text-sm">Já é membro? <Link to="/login" className="text-emerald-400 hover:underline">Fazer Login</Link></p>
            </div>
        </div>
    );


}