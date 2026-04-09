import React from 'react';
import Header from '../components/Header';
import { Target, Eye, Award, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserHome = () => {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      <Header />
      <main className="max-w-6xl mx-auto p-6 py-12 space-y-16">
        
        {/* Banner Principal */}
        <section className="text-center space-y-4">
          <h2 className="text-indigo-500 font-black uppercase tracking-[0.3em] text-xs">Bem-vindo ao SucuriDrive</h2>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">Sua Central de Conhecimento</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Abaixo você encontrará as diretrizes que guiam nossa empresa e o acesso seguro aos documentos autorizados.
          </p>
        </section>

        {/* Visão, Missão e Valores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#1e293b] p-8 rounded-[40px] border border-slate-800 hover:border-indigo-500/30 transition-all">
            <Target className="text-indigo-400 mb-6" size={40} />
            <h3 className="text-xl font-bold text-white mb-4">Nossa Missão</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Prover segurança digital e acesso simplificado à informação, garantindo que cada membro da equipe tenha as ferramentas certas no momento certo.
            </p>
          </div>

          <div className="bg-[#1e293b] p-8 rounded-[40px] border border-slate-800 hover:border-emerald-500/30 transition-all">
            <Eye className="text-emerald-400 mb-6" size={40} />
            <h3 className="text-xl font-bold text-white mb-4">Nossa Visão</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Ser a maior referência em gestão de acervo digital privado, reconhecida pela robustez tecnológica e facilidade de uso em todo o Brasil.
            </p>
          </div>

          <div className="bg-[#1e293b] p-8 rounded-[40px] border border-slate-800 hover:border-amber-500/30 transition-all">
            <Award className="text-amber-400 mb-6" size={40} />
            <h3 className="text-xl font-bold text-white mb-4">Nossos Valores</h3>
            <ul className="text-slate-400 text-sm space-y-2">
              <li className="flex items-center gap-2 italic">• Transparência Radical</li>
              <li className="flex items-center gap-2 italic">• Segurança Inegociável</li>
              <li className="flex items-center gap-2 italic">• Inovação Constante</li>
            </ul>
          </div>
        </div>

        {/* Call to Action para Arquivos */}
        <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-[40px] p-12 text-center text-white shadow-2xl shadow-indigo-500/20">
          <h3 className="text-2xl font-bold mb-4">Pronto para começar?</h3>
          <p className="mb-8 opacity-80 max-w-xl mx-auto">
            Acesse a nossa biblioteca protegida para consultar manuais, diretrizes e documentos corporativos autorizados para o seu perfil.
          </p>
          <button onClick={() => navigate('/admin/arquivos')} className="px-10 py-4 bg-white text-indigo-600 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all">
            Acessar Meus Arquivos
          </button>
        </section>
      </main>
    </div>
  );
};

export default UserHome;