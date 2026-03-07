import React, { useState, useEffect } from 'react';
import { supabase } from "../supabaseClient";
import Header from '../components/Header';
import { Save, Loader2, ArrowLeft, Eye, EyeOff, Phone, Fingerprint } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfileEdit = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", cpf: "", password: "", confirmPassword: ""
  });

  // Funções de Máscara
  const maskCPF = (v) => v ? v.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4").substring(0, 14) : "";
  const maskPhone = (v) => v ? v.replace(/\D/g, "").replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3").substring(0, 15) : "";

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setFetching(true);
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return navigate('/login');

        const userData = JSON.parse(storedUser);
        const userId = userData?.id || userData?._id || userData?.user_id;
        
        if (!userId) {
          toast.error("Sessão expirada. Faça login novamente.");
          return;
        }

        // 1. Busca os dados no Supabase com maybeSingle para não gerar erro 406
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (error) throw error;

        // 2. Preenche o formulário aplicando máscaras nos dados vindos do banco
        if (profile) {
          setFormData(prev => ({
            ...prev,
            name: profile.name || userData.name || "",
            email: profile.email || userData.email || "",
            phone: profile.phone ? maskPhone(profile.phone) : "",
            cpf: profile.cpf ? maskCPF(profile.cpf) : ""
          }));
        } else {
          // Caso o perfil ainda não exista no banco, preenche apenas com o básico do login
          setFormData(prev => ({ 
            ...prev, 
            name: userData.name || "",
            email: userData.email || "" 
          }));
        }
      } catch (error) {
        console.error("Erro ao carregar:", error);
      } finally {
        setFetching(false);
      }
    };
    loadUserData();
  }, [navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const userId = (storedUser?.id || storedUser?._id || storedUser?.user_id)?.toString().trim();

      // Limpa as máscaras para salvar apenas números no banco
      const updateData = {
        id: userId,
        name: formData.name || "",
        cpf: formData.cpf.replace(/\D/g, ""), 
        phone: formData.phone.replace(/\D/g, ""),
        email: formData.email || storedUser.email || ""
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updateData, { onConflict: 'id' });

      if (error) throw error;

      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error(`Erro: ${error.message || 'Verifique as permissões do banco'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!formData.password || formData.password !== formData.confirmPassword) {
      return toast.error("As senhas não coincidem!");
    }

    setLoading(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const userId = storedUser?.id || storedUser?._id || storedUser?.user_id;
      
      const response = await axios.put('https://backend-sucuri-api.vercel.app/api/auth/update-password', {
        userId,
        newPassword: formData.password
      });

      if (response.data) {
        toast.success("Senha atualizada com sucesso!");
        setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao trocar senha.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <Loader2 className="animate-spin text-indigo-500" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      <Header />
      <main className="max-w-6xl mx-auto p-6 py-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-white mb-8 text-xs font-black uppercase tracking-widest transition-all">
          <ArrowLeft size={16}/> Voltar
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <section className="lg:col-span-2 space-y-8">
            <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">Meu Perfil</h1>
            <form onSubmit={handleUpdateProfile} className="bg-[#1e293b] rounded-[40px] border border-slate-800 p-8 space-y-6 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nome Completo</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-[#0f172a] border border-slate-800 rounded-2xl p-4 text-sm outline-none focus:border-indigo-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">E-mail (Login)</label>
                  <input type="email" value={formData.email} disabled className="w-full bg-[#0f172a]/50 border border-slate-800 rounded-2xl p-4 text-sm text-slate-500 cursor-not-allowed" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 flex items-center gap-1"><Phone size={12}/> Telefone</label>
                  <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: maskPhone(e.target.value)})} className="w-full bg-[#0f172a] border border-slate-800 rounded-2xl p-4 text-sm outline-none focus:border-indigo-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 flex items-center gap-1"><Fingerprint size={12}/> CPF</label>
                  <input type="text" value={formData.cpf} onChange={(e) => setFormData({...formData, cpf: maskCPF(e.target.value)})} className="w-full bg-[#0f172a] border border-slate-800 rounded-2xl p-4 text-sm outline-none focus:border-indigo-500 transition-all" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase text-[10px] flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20">
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Salvar Alterações
              </button>
            </form>
          </section>

          <aside className="space-y-8">
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Segurança</h2>
            <form onSubmit={handleUpdatePassword} className="bg-[#1e293b] rounded-[40px] border border-slate-800 p-8 space-y-6 shadow-2xl">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nova Senha</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-[#0f172a] border border-slate-800 rounded-2xl p-4 pr-12 text-sm outline-none focus:border-amber-500 transition-all" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-500 transition-colors">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Confirmar Senha</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className="w-full bg-[#0f172a] border border-slate-800 rounded-2xl p-4 pr-12 text-sm outline-none focus:border-amber-500 transition-all" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-500 transition-colors">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full py-4 bg-amber-600/10 text-amber-500 border border-amber-600/20 hover:bg-amber-600 hover:text-white rounded-2xl font-black uppercase text-[10px] transition-all">
                Atualizar Senha
              </button>
            </form>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default ProfileEdit;