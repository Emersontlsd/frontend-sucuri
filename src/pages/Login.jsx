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
        
        // Criamos um toast de carregamento
        const idToast = toast.loading("Autenticando...");

        try {
            const response = await axios.post('https://backend-sucuri-api.vercel.app/api/auth/login', form);
            
            if (response.data.success) {
                // 1. Salva o Token
                localStorage.setItem('token', response.data.token);

                // 2. Salva o Perfil e a Role separadamente para facilitar o acesso no App.js
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('role', response.data.profile.role);
                
                // 3. Sucesso! Atualiza o toast e redireciona
                toast.update(idToast, { 
                    render: `Bem-vindo, ${response.data.profile.name || 'usuário'}!`, 
                    type: "success", 
                    isLoading: false, 
                    autoClose: 2000 
                });
                
                // Redireciona baseado na Role (importante: nomes iguais aos das rotas no App.js)
                if (response.data.profile.role === 'admin') {
                    navigate('/admindashboard');
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (err) {
            const status = err.response?.status;
            let errorMessage = "Erro ao fazer login. Verifique suas credenciais.";

            if (status === 403) {
                errorMessage = "Sua conta ainda não foi liberada pelo administrador.";
            } else if (status === 401) {
                errorMessage = "E-mail ou senha incorretos.";
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            }

            // Atualiza o toast para erro
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
            <div className="bg-[#1e293b] w-full max-w-md p-8 rounded-2xl border border-slate-700 shadow-2xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white tracking-tight">
                        Sucuri <span className="text-emerald-500">Login</span>
                    </h2>
                    <p className="text-slate-400 text-sm mt-2">Acesse sua conta para continuar</p>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-5">
                    {/* E-mail */}
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                            type="email" 
                            placeholder="Seu e-mail" 
                            required 
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#0f172a] border border-slate-600 text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" 
                            onChange={e => setForm({ ...form, email: e.target.value })} 
                        />
                    </div>

                    {/* Senha */}
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Sua senha" 
                            required 
                            className="w-full pl-12 pr-12 py-3 rounded-xl bg-[#0f172a] border border-slate-600 text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" 
                            onChange={e => setForm({ ...form, password: e.target.value })} 
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <button 
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            "Entrar"
                        )}
                    </button>
                </form>
                
                <div className="mt-8 pt-6 border-t border-slate-700 text-center">
                    <p className="text-slate-400 text-sm">
                        Não tem conta? <Link to="/register" className="text-emerald-400 font-medium hover:underline">Cadastre-se agora</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}