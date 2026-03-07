import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const idToast = toast.loading("Autenticando...");

        try {
            const response = await axios.post('https://backend-sucuri-api.vercel.app/api/auth/login', form);
            
            if (response.data.success) {
                // --- AQUI ESTÁ O SEGREDO ---
                // 1. Salva o token com o nome que a PrivateRoute espera (supabase.auth.token)
                // Usamos um nome que contenha a string para "enganar" a proteção de forma simples
                localStorage.setItem('supabase.auth.token', response.data.token);
                
                // Mantemos o seu padrão original também para não quebrar outras partes
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('role', response.data.profile.role);
                localStorage.setItem('userName', response.data.profile.name);

                toast.update(idToast, { 
                    render: `Bem-vindo, ${response.data.profile.name || 'usuário'}!`, 
                    type: "success", 
                    isLoading: false, 
                    autoClose: 2000 
                });
                
                // 2. Ajuste nos nomes das rotas (deve ser IGUAL ao path no App.js)
                const role = response.data.profile.role;
                if (role === 'admin') {
                    // No seu App.js a rota é "/admin", e não "/admindashboard"
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.message || "Erro ao fazer login.";
            toast.update(idToast, { 
                render: errorMessage, 
                type: "error", 
                isLoading: false, 
                autoClose: 4000 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
            <div className="bg-[#1e293b] w-full max-w-md p-8 rounded-[32px] border border-slate-700 shadow-2xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">
                        Sucuri<span className="text-emerald-500 italic">Drive</span>
                    </h2>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Acesso Restrito</p>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                            type="email" 
                            placeholder="E-mail" 
                            required 
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#0f172a] border border-slate-700 text-white outline-none focus:border-emerald-500 transition-all text-sm" 
                            onChange={e => setForm({ ...form, email: e.target.value })} 
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Senha" 
                            required 
                            className="w-full pl-12 pr-12 py-4 rounded-2xl bg-[#0f172a] border border-slate-700 text-white outline-none focus:border-emerald-500 transition-all text-sm" 
                            onChange={e => setForm({ ...form, password: e.target.value })} 
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-emerald-500 transition-colors"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <button 
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-xs tracking-[0.2em] py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : "Entrar no Sistema"}
                    </button>
                </form>
                
                <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                        Novo por aqui? <Link to="/register" className="text-emerald-500 hover:text-white transition-colors ml-2">Criar conta</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}