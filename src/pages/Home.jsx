import React from 'react';
import Header from '../components/Header';
import { ShieldCheck, Zap, Lock } from 'lucide-react'; // Sugestão de ícones

const Home = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      <Header />
      <main className="max-w-5xl mx-auto px-6 py-20 text-center">
        <span className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.4em]">Plataforma de Gestão</span>
        <h1 className="text-6xl font-black text-white mt-4 mb-6 tracking-tighter">
          Segurança e Agilidade no <br/>
          <span className="text-indigo-500">SucuriDrive</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12">
          Centralize seus arquivos, gerencie permissões de membros e mantenha o controle total da sua infraestrutura digital em um único lugar.
        </p>
        
        {/* CARDS DE DESTAQUE OPCIONAIS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-8 bg-[#1e293b] rounded-[40px] border border-slate-800">
            <Lock className="text-indigo-500 mb-4" size={32} />
            <h3 className="font-bold text-white mb-2">Segurança Total</h3>
            <p className="text-sm text-slate-500">Acesso controlado por níveis de permissão e criptografia de ponta.</p>
          </div>
          <div className="p-8 bg-[#1e293b] rounded-[40px] border border-slate-800">
            <Zap className="text-emerald-500 mb-4" size={32} />
            <h3 className="font-bold text-white mb-2">Alta Performance</h3>
            <p className="text-sm text-slate-500">Uploads instantâneos e filtros de busca em tempo real.</p>
          </div>
          <div className="p-8 bg-[#1e293b] rounded-[40px] border border-slate-800">
            <ShieldCheck className="text-amber-500 mb-4" size={32} />
            <h3 className="font-bold text-white mb-2">Gestão de Membros</h3>
            <p className="text-sm text-slate-500">Controle quem pode ver ou editar cada documento do sistema.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;