import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://backend-sucuri-api.vercel.app/api/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('user', JSON.stringify(res.data.user)); // Salva o user
        navigate('/dashboard');
      }
    } catch (err) {
      alert(err.response?.data?.message || "Erro no login");
    }
  };

    return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="bg-[#1e293b] w-full max-w-md p-8 rounded-2xl border border-slate-700 shadow-2xl">
        <h2 className="text-3xl font-bold text-white text-center mb-8 tracking-tight">Sucuri <span className="text-indigo-500">Login</span></h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <input type="email" placeholder="E-mail" required className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-slate-600 text-white outline-none focus:border-indigo-500" onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Senha" required className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-slate-600 text-white outline-none focus:border-indigo-500" onChange={e => setPassword(e.target.value)} />
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20">Entrar</button>
        </form>
        <p className="text-center text-slate-400 mt-6 text-sm">Não tem conta? <Link to="/register" className="text-indigo-400 hover:underline">Cadastre-se</Link></p>
      </div>
    </div>
  );
}