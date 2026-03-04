import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2, User, Mail, Lock, Phone, CreditCard } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Register() {
    const [form, setForm] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        phone: '', 
        cpf: '' 
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Inicia o toast de carregamento
        const idToast = toast.loading("Enviando seu cadastro...");

        try {
            await axios.post('https://backend-sucuri-api.vercel.app/api/auth/register', form);
            
            // Sucesso
            toast.update(idToast, { 
                render: "Cadastro realizado! Aguarde a aprovação do administrador.", 
                type: "success", 
                isLoading: false, 
                autoClose: 5000 
            });
            
            navigate('/login');
        } catch (err) {
            // Tratamento de erro
            const errorMessage = err.response?.data?.message || "Erro ao registrar. Tente novamente.";
            
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
                        Nova <span className="text-emerald-500">Conta</span>
                    </h2>
                    <p className="text-slate-400 text-sm mt-2">Preencha os dados para solicitar acesso</p>
                </div>
                
                <form onSubmit={handleRegister} className="space-y-4">
                    {/* Nome */}
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                            type="text" 
                            placeholder="Nome Completo" 
                            required 
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#0f172a] border border-slate-600 text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" 
                            onChange={e => setForm({ ...form, name: e.target.value })} 
                        />
                    </div>

                    {/* CPF */}
                    <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                            type="text" 
                            placeholder="CPF (apenas números)" 
                            required 
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#0f172a] border border-slate-600 text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" 
                            onChange={e => setForm({ ...form, cpf: e.target.value })} 
                        />
                    </div>

                    {/* Telefone */}
                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                            type="text" 
                            placeholder="Telefone / WhatsApp" 
                            required 
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#0f172a] border border-slate-600 text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" 
                            onChange={e => setForm({ ...form, phone: e.target.value })} 
                        />
                    </div>

                    {/* E-mail */}
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                            type="email" 
                            placeholder="E-mail" 
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
                            placeholder="Senha" 
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
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            "Criar Agora"
                        )}
                    </button>
                </form>
                
                <div className="mt-8 pt-6 border-t border-slate-700 text-center">
                    <p className="text-slate-400 text-sm">
                        Já é membro? <Link to="/login" className="text-emerald-400 font-medium hover:underline">Fazer Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}